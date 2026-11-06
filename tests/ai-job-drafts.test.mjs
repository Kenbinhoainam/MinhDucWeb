import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../public/ai-job-drafts.js', import.meta.url), 'utf8');
const sections = ['description', 'requirements', 'benefits', 'apply'];
const existing = {
  title: 'Kỹ thuật viên', location: 'Hà Nội', company: 'Nhà máy (minh họa)',
  type: 'internal', min: '18', max: '23', openings: '12',
  description: 'Kiểm tra hệ thống.', requirements: 'Kinh nghiệm 2 năm.',
  benefits: 'Hỗ trợ ăn ca.', apply: 'Nộp hồ sơ qua cổng tuyển dụng.'
};

function load(pathname = '/cms-demo.html') {
  const window = { location: { pathname } };
  runInNewContext(script, { window, Event, document: { readyState: 'loading', addEventListener() {} } });
  return window.MDJobDrafts;
}

function editor(id) {
  const events = [];
  const fields = {};
  const form = {
    isConnected: true, dataset: { jobId: id },
    elements: { namedItem: name => fields[name] },
    querySelector: selector => selector.includes(':checked') ? fields.type : null
  };
  for (const [key, value] of Object.entries(existing)) {
    fields[key] = {
      value, form, tagName: sections.includes(key) ? 'TEXTAREA' : 'INPUT',
      maxLength: -1, matches: () => false, dispatchEvent: event => events.push([key, event.type])
    };
  }
  return { form, fields, events };
}

test('job drafting runs only on the exact CMS demo path', () => {
  assert.ok(load());
  assert.ok(load('/MinhDucWeb/cms-demo.html'));
  assert.equal(load('/quan-tri'), undefined);
  assert.equal(load('/viec-lam.html'), undefined);
});

test('generation includes only explicitly confirmed facts and flags missing authored details', () => {
  const { createDraft, summarize } = load();
  assert.equal(createDraft(existing, new Set(['salary'])), null);
  assert.equal(createDraft({ ...existing, title: 'Tin tuyển dụng mới' }, new Set(['core'])), null);
  assert.equal(summarize({ ...existing, min: '24' }).salary, '');
  const draft = createDraft(existing, new Set(['core', 'company', 'description', 'salary']));
  assert.match(draft.description, /Kỹ thuật viên[\s\S]*Hà Nội[\s\S]*Kiểm tra hệ thống\./);
  assert.doesNotMatch(draft.description, /Nhà máy|12 vị trí/);
  assert.match(draft.benefits, /18–23 triệu đồng\/tháng/);
  assert.doesNotMatch(draft.benefits, /ăn ca/);
  assert.match(draft.requirements, /^\[Bổ sung:/);
  assert.match(draft.apply, /^\[Bổ sung:/);
});

test('apply checks record, form, current input values and target controls before writing anything', () => {
  const { capture, writeDraft } = load();
  const { form, fields, events } = editor('first');
  const source = capture(form);
  const completed = Object.fromEntries(sections.map(key => [key, `Nội dung đã kiểm tra ${key}`]));

  assert.equal(writeDraft(editor('first').form, source, completed), false);
  form.dataset.jobId = 'other';
  assert.equal(writeDraft(form, source, completed), false);
  form.dataset.jobId = 'first';
  fields.max.value = '27';
  assert.equal(writeDraft(form, source, completed), false);
  fields.max.value = existing.max;
  const benefits = fields.benefits;
  fields.benefits = { ...benefits };
  assert.equal(writeDraft(form, source, completed), false);
  fields.benefits = benefits;
  assert.equal(writeDraft(form, source, { ...completed, apply: '[Bổ sung: kênh ứng tuyển]' }), false);
  fields.requirements.readOnly = true;
  assert.equal(writeDraft(form, source, completed), false);
  fields.requirements.readOnly = false;
  assert.equal(fields.description.value, existing.description);
  assert.deepEqual(events, []);

  assert.equal(writeDraft(form, source, { ...completed, title: 'Do not overwrite' }), true);
  assert.equal(fields.title.value, existing.title);
  assert.deepEqual(events, sections.map(key => [key, 'input']));
  for (const key of sections) assert.equal(fields[key].value, completed[key]);

  assert.equal(writeDraft(form, capture(form), { apply: 'Hồ sơ trực tuyến.' }), true);
  assert.equal(fields.apply.value, 'Hồ sơ trực tuyến.');
  assert.equal(fields.benefits.value, completed.benefits);
});
