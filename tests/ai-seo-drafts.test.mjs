import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/ai-seo-drafts.js', import.meta.url), 'utf8');
const scope = vm.createContext({ window: {}, document: { readyState: 'loading', addEventListener() {} }, Event });
vm.runInContext(source, scope);
const { generateDraft, captureSource, applyDraft, isDemoPath } = scope.window.MDSeoDrafts;
const fieldNames = ['title', 'keyword', 'seoTitle', 'meta', 'excerpt', 'body'];

function editor(recordId = 'post-1') {
  const fields = new Map();
  const translation = { dataset: { l10nId: recordId }, title: 'Manual English title' };
  const events = [];
  const form = {
    id: 'postEditForm',
    isConnected: true,
    elements: { namedItem: name => fields.get(name) },
    querySelector: () => translation,
    requestSubmit: () => assert.fail('Applying a draft must not submit the editor')
  };
  for (const name of [...fieldNames, 'type', 'category', 'cover', 'visible']) {
    const tagName = ['meta', 'excerpt', 'body'].includes(name) ? 'TEXTAREA' : 'INPUT';
    fields.set(name, {
      form, tagName, type: 'text', value: `Before ${name}`,
      maxLength: ({ title: 140, seoTitle: 70, meta: 165, excerpt: 290 })[name] ?? -1,
      dispatchEvent: event => events.push([name, event.type, event.bubbles])
    });
  }
  fields.get('type').value = 'article';
  return { form, fields, translation, events };
}

test('the assistant accepts CMS Demo paths only', () => {
  for (const path of ['/cms-demo', '/cms-demo.html', '/cms-demo/', '/MinhDucWeb/cms-demo.html', '/MinhDucWeb/cms-demo/']) assert.equal(isDemoPath(path), true);
  for (const path of ['/', '/quan-tri.html', '/cms-demo-other.html', '/MinhDucWeb/cms-demo-other.html', '/MinhDucWeb/not-cms-demo.html']) assert.equal(isDemoPath(path), false);
});

test('a topic generates topical Vietnamese metadata, outline and a complete article', () => {
  const interview = generateDraft('  phỏng  vấn   tại nhà máy ');
  assert.equal(interview.keyword, 'phỏng vấn tại nhà máy');
  assert.equal(interview.slug, 'phong-van-tai-nha-may');
  assert.match(interview.title, /^Phỏng vấn tại nhà máy/);
  assert.match(interview.seoTitle, /chuẩn bị/);
  assert.match(interview.meta, /tuyển dụng/);
  assert.ok(interview.body.startsWith(interview.excerpt));
  assert.equal(interview.outline.length, 5);
  for (const heading of interview.outline.slice(1, -1)) assert.ok(interview.body.includes(heading));
  assert.ok(interview.body.length > 750);
  assert.match(generateDraft('quyền lợi người lao động').body, /thời điểm chi trả/);
  assert.match(generateDraft('tuyển dụng công nhân').body, /vị trí còn tuyển/);
  assert.match(generateDraft('văn hóa doanh nghiệp').body, /ngày cập nhật/);
});

test('the generator rejects missing topics and keeps Unicode within CMS field limits', () => {
  for (const topic of ['', '   ', '!!!', 'a'.repeat(111)]) assert.equal(generateDraft(topic), null);
  const draft = generateDraft(`H${'ệ'.repeat(67)}🙂 ${'x'.repeat(36)}`);
  for (const [name, max] of [['title', 140], ['seoTitle', 70], ['meta', 165], ['excerpt', 290]]) {
    assert.ok(draft[name].length <= max, name);
    assert.doesNotMatch(draft[name], /[\uD800-\uDFFF]/u);
  }
  assert.ok(generateDraft('việc làm <img onerror=alert(1)>').body.includes('<img onerror=alert(1)>'));
});

test('Apply copies only the edited Vietnamese preview and emits bubbling field events', () => {
  const { form, fields, translation, events } = editor();
  const draft = { ...generateDraft('Việc làm'), body: 'Nội dung đã hiệu đính', meta: '  Mô tả đã hiệu đính  ' };
  assert.equal(applyDraft(form, captureSource(form), draft), 'applied');
  for (const name of fieldNames) assert.equal(fields.get(name).value, draft[name].trim());
  for (const name of ['category', 'cover', 'visible']) assert.equal(fields.get(name).value, `Before ${name}`);
  assert.equal(fields.get('type').value, 'article');
  assert.equal(translation.title, 'Manual English title');
  assert.deepEqual(events, fieldNames.flatMap(name => [[name, 'input', true], [name, 'change', true]]));
});

test('Apply rejects stale editors and invalid previews before writing any field', () => {
  const draft = generateDraft('Việc làm');
  for (const invalidate of [
    model => { model.form.isConnected = false; },
    model => { model.translation.dataset.l10nId = 'post-2'; },
    model => { model.fields.get('type').value = 'video'; },
    model => { model.fields.get('body').value = 'Manual source edit'; },
    model => { model.fields.set('title', { ...model.fields.get('title') }); },
    model => { model.fields.get('keyword').readOnly = true; }
  ]) {
    const model = editor();
    const snapshot = captureSource(model.form);
    invalidate(model);
    const before = fieldNames.map(name => model.fields.get(name).value);
    assert.equal(applyDraft(model.form, snapshot, draft), 'stale');
    assert.deepEqual(fieldNames.map(name => model.fields.get(name).value), before);
    assert.deepEqual(model.events, []);
  }

  const a = editor();
  const b = editor();
  assert.equal(applyDraft(b.form, captureSource(a.form), draft), 'stale');
  for (const invalid of [null, { ...draft, body: '' }, { ...draft, seoTitle: 'a'.repeat(71) }]) {
    assert.equal(applyDraft(a.form, captureSource(a.form), invalid), 'invalid');
  }
  assert.equal(a.fields.get('title').value, 'Before title');
  assert.deepEqual(a.events, []);
  assert.deepEqual(b.events, []);
});
