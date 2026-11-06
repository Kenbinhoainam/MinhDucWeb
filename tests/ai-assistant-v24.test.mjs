import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = fs.readFileSync(path.join(root, 'public/ai-assistant.js'), 'utf8');
const scope = vm.createContext({ window: {}, document: { readyState: 'loading', addEventListener() {} }, URLSearchParams });
vm.runInContext(source, scope);
const api = scope.window.MDAssistant;
const locales = ['vi', 'en', 'zh', 'ko'];

function application(worker = true) {
  const field = (name, value = '', type = 'text') => ({ name, value, type, checked: false, disabled: false, readOnly: false });
  const fields = [field('name'), field('phone', '', 'tel'), field('consent', 'on', 'checkbox'), field('testOnly', 'on', 'checkbox'), field('job', 'Immutable job', 'hidden'), field('cv', '', 'file')];
  if (worker) {
    const area = field('area', '', 'select-one'); area.options = ['', 'Bắc Ninh', 'Bắc Giang', 'Hà Nội'].map(value => ({ value, textContent: value }));
    fields.push(area, ...['Ca ngày', 'Ca đêm', 'Linh hoạt'].map(value => field('shift', value, 'radio')), ...['Có', 'Không'].map(value => field('shuttle', value, 'radio')));
  } else fields.push(field('desired', 'Hà Nội'));
  return {
    id: 'applyForm', isConnected: true, fields,
    classList: { contains: value => worker && value === 'apply-micro' },
    elements: { namedItem: name => fields.find(item => item.name === name) },
    querySelectorAll: selector => fields.filter(item => item.name === selector.match(/name="(.*?)"/)[1])
  };
}
const validDraft = { name: 'Demo Candidate', phone: '+84900000000', area: 'Bắc Ninh', shift: 'Ca ngày', shuttle: 'Không', desired: 'Bắc Ninh' };

test('all four languages provide distinct demo answers and allowlisted locale links', () => {
  const data = { jobs: [{ id: 'live & sample', title: '<script>title</script>', open: true, min: 11, max: 17 }, { id: 'closed', title: 'Closed role', open: false }] };
  for (const lang of locales) for (let topic = 0; topic < 5; topic++) {
    const result = api.answer('ignored', lang, data, topic);
    assert.match(result.text, /Demo|演示|데모/);
    assert.ok(result.links.length);
    for (const link of result.links) {
      const url = new URL(link.href, 'https://example.test/');
      assert.equal(url.origin, 'https://example.test');
      assert.match(url.pathname, /^\/(?:viec-lam|chi-tiet-viec-lam|lien-he)\.html$/);
      assert.equal(url.searchParams.get('lang'), lang);
      assert.notEqual(url.searchParams.get('id'), 'closed');
    }
    if (topic === 1) assert.ok(result.links[0].label.includes('11–17'));
  }
  assert.equal(new Set(locales.map(lang => api.answer('', lang).text)).size, 4);
});

test('intent detection handles Vietnamese accents and each language; ambiguous input has an honest fallback', () => {
  for (const [topic, questions] of [
    [0, ['Tìm việc phù hợp', 'Find jobs', '查找职位', '일자리 찾기']],
    [1, ['Lương & phúc lợi', 'Salary and benefits', '薪资与福利', '급여 및 복지']],
    [2, ['Liên hệ doanh nghiệp', 'Business staffing', '企业联系', '기업 문의']],
    [3, ['Gặp người tư vấn', 'Talk to a person', '联系人工顾问', '상담원 문의']]
  ]) for (const question of questions) assert.equal(api.intent(question), topic, question);
  assert.equal(api.intent('Where can I see the weather?'), 4);
  assert.match(api.answer('anything', 'unknown').text, /^Demo:/);
});

test('responses use only supplied current open jobs, encode ids and ignore arbitrary content URLs', () => {
  const malicious = { id: 'a&lang=xx#x', open: true, title: 'Current edited title', href: 'javascript:alert(1)', min: -1, max: Infinity };
  const result = api.answer('salary', 'ko', { jobs: [malicious, null, { title: 'Unknown', open: true }] });
  assert.equal(result.links[0].label, 'Current edited title');
  assert.equal(new URL(result.links[0].href, 'https://example.test/').searchParams.get('id'), malicious.id);
  assert.doesNotMatch(JSON.stringify(result), /javascript:|Infinity/);
  assert.equal(api.answer('jobs', 'en', {}).links.length, 1);
  assert.equal(api.answer('jobs', 'en', { jobs: 'wrong' }).links.length, 1);
});

test('guided answers validate actual phone requirements, localized options and Unicode names', () => {
  const form = application();
  for (const name of ['Nguyễn Minh Đức', 'Demo Candidate', '金明德', '김민덕']) assert.equal(api.normalizeAnswer('name', name, form, 'en'), name);
  for (const name of ['', 'A', '<img onerror=alert(1)>', '12345', 'a'.repeat(101)]) assert.equal(api.normalizeAnswer('name', name, form, 'vi'), null);
  assert.equal(api.normalizeAnswer('phone', '(090) 000-0000', form, 'vi'), '0900000000');
  assert.equal(api.normalizeAnswer('phone', '+84 90 000 0000', form, 'en'), '+84900000000');
  for (const phone of ['123', '0123456789', '+12025550100', '0900000000<script>']) assert.equal(api.normalizeAnswer('phone', phone, form, 'en'), null);
  for (const [lang, day, no, area] of [['vi', 'Ca ngày', 'Không', 'Bắc Ninh'], ['en', 'Day shift', 'No', 'Bac Ninh'], ['zh', '白班', '否', '北宁'], ['ko', '주간', '아니요', '박닌']]) {
    assert.equal(api.normalizeAnswer('shift', day, form, lang), 'Ca ngày');
    assert.equal(api.normalizeAnswer('shuttle', no, form, lang), 'Không');
    assert.equal(api.normalizeAnswer('area', area, form, lang), 'Bắc Ninh');
  }
  assert.equal(api.normalizeAnswer('area', 'Unknown region', form, 'en'), null);
  assert.equal(api.normalizeAnswer('desired', 'a'.repeat(121), application(false), 'en'), null);
});

test('confirmed fill updates both real form shapes without consent, files, hidden fields or events', () => {
  for (const worker of [true, false]) {
    const form = application(worker), untouched = form.fields.filter(field => ['consent', 'testOnly', 'cv', 'job'].includes(field.name));
    const before = JSON.stringify(untouched);
    form.submit = form.requestSubmit = form.dispatchEvent = () => assert.fail('Filling must not submit or dispatch persistence events');
    assert.equal(api.fillForm(form, validDraft, 'en'), true);
    assert.equal(form.elements.namedItem('name').value, 'Demo Candidate');
    assert.equal(form.elements.namedItem('phone').value, '+84900000000');
    if (worker) {
      assert.equal(form.elements.namedItem('area').value, 'Bắc Ninh');
      assert.deepEqual(form.fields.filter(field => field.name === 'shift' && field.checked).map(field => field.value), ['Ca ngày']);
      assert.deepEqual(form.fields.filter(field => field.name === 'shuttle' && field.checked).map(field => field.value), ['Không']);
    } else assert.equal(form.elements.namedItem('desired').value, 'Bắc Ninh');
    assert.equal(JSON.stringify(untouched), before);
  }
});

test('invalid, stale, missing and disabled controls fail atomically before changing any field', () => {
  for (const change of [
    form => { form.isConnected = false; },
    form => { form.id = 'contactForm'; },
    form => { form.elements.namedItem('area').options = []; },
    form => { form.elements.namedItem('phone').disabled = true; },
    form => { form.elements.namedItem('phone').type = 'hidden'; },
    form => { form.fields.splice(form.fields.findIndex(field => field.name === 'phone'), 1); }
  ]) {
    const form = application(); change(form); const before = JSON.stringify(form.fields);
    assert.equal(api.fillForm(form, validDraft, 'en'), false);
    assert.equal(JSON.stringify(form.fields), before);
  }
  const form = application(), before = JSON.stringify(form.fields);
  assert.equal(api.fillForm(form, { ...validDraft, shuttle: 'maybe' }, 'en'), false);
  assert.equal(JSON.stringify(form.fields), before);
});

test('assistant source has no HTML injection sink, persistence, network client, auto-submit or speech downloads', () => {
  assert.doesNotMatch(source, /\.innerHTML\s*=|insertAdjacentHTML|\beval\s*\(|\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.requestSubmit\s*\(|\.submit\s*\(|SpeechRecognition\.install/);
  assert.match(source, /recognition\.processLocally = true/);
  assert.match(source, /availability !== 'available'/);
});

