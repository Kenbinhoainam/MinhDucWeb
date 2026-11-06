import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const scope = vm.createContext({
  window: {},
  document: { readyState: 'loading', addEventListener() {} },
  URLSearchParams
});
vm.runInContext(readFileSync(new URL('../public/ai-assistant.js', import.meta.url), 'utf8'), scope);
const { answer } = scope.window.MDAssistant;

const jobs = [
  { id: 'mechanical', title: 'Công nhân lắp ráp cơ khí', open: true, location: 'Bắc Giang', park: 'KCN Vân Trung', min: 10, max: 14 },
  { id: 'warehouse', title: 'Nhân viên kho vận', open: true, location: 'Bắc Giang', park: 'KCN Quang Châu', min: 12, max: 16 },
  { id: 'operator', title: 'Công nhân vận hành máy', open: true, location: 'Hà Nội', park: 'KCN Thăng Long', min: 8, max: 11 },
  { id: 'qc', title: 'Nhân viên kiểm tra chất lượng (QC)', open: true, location: 'Bắc Ninh', park: 'KCN Quế Võ', min: 9, max: 13 },
  { id: 'electric', title: 'Công nhân sản xuất linh kiện điện tử', open: true, location: 'Bắc Ninh', park: 'KCN Yên Phong', min: 9, max: 12 },
  { id: 'welder', title: 'Thợ hàn', open: false, location: 'Bắc Ninh', park: 'KCN Yên Phong', min: 88, max: 99 }
];
const urlFor = link => new URL(link.href, 'https://prototype.example/');
const sources = result => Array.from(result.links).filter(link => urlFor(link).pathname === '/chi-tiet-viec-lam.html');
const ids = result => sources(result).map(link => urlFor(link).searchParams.get('id'));

test('filters the current sample catalog by title, province and park before limiting results', () => {
  const data = { jobs };
  for (const [question, expected] of [
    ['Tôi muốn tìm việc tại Bắc Ninh', ['qc', 'electric']],
    ['Có việc ở Khu công nghiệp Yên Phong không?', ['electric']],
    ['Nhân viên kiểm tra chất lượng', ['qc']],
    ['QC tại Quế Võ', ['qc']],
    ['Tìm việc kho vận ở Bắc Giang', ['warehouse']],
    ['Lương cơ khí ở Bắc Giang bao nhiêu?', ['mechanical']],
    ['Tìm việc ở BAC NINH', ['qc', 'electric']]
  ]) assert.deepEqual(ids(answer(question, 'vi', data)), expected, question);
});

test('understands ordinary Vietnamese question framing without dropping constraints', () => {
  assert.deepEqual(ids(answer('Mức lương ở Hà Nội là bao nhiêu?', 'vi', {jobs})), ['operator']);
  assert.deepEqual(ids(answer('Ở Bắc Ninh có những công việc nào?', 'vi', {jobs})), ['qc', 'electric']);
  assert.deepEqual(ids(answer('Có những vị trí kho vận ở Hà Nội nào?', 'vi', {jobs})), []);
});

test('includes an individually labeled sample source for a localized pay answer', () => {
  for (const [lang, title, question, sourceLabel] of [
    ['vi', jobs[3].title, 'Lương QC ở Bắc Ninh bao nhiêu?', /Nguồn.*tin mẫu/],
    ['en', 'Quality control inspector (QC)', 'What is the salary for QC in Bac Ninh?', /Source.*sample listing/],
    ['zh', '质量检验员（QC）', '请问北宁的质量检验员薪资是多少？', /来源.*示例职位/],
    ['ko', '품질 검사원(QC)', '박닌에서 품질 검사원의 급여는 얼마인가요?', /출처.*예시 채용 공고/]
  ]) {
    const result = answer(question, lang, { jobs: [...jobs.slice(0, 3), { ...jobs[3], title }] });
    assert.match(result.text, /Demo|演示|데모/);
    assert.deepEqual(ids(result), ['qc'], question);
    const [source] = sources(result);
    assert.match(source.source, sourceLabel);
    assert.match(source.label, /9–13/);
    assert.match(source.label, /Quế Võ.*Bắc Ninh/);
    assert.equal(urlFor(source).searchParams.get('lang'), lang);
  }
});

test('falls back for closed, unknown or unsupported queries without showing unrelated details', () => {
  for (const question of [
    'Tìm việc thợ hàn tại Bắc Ninh',
    'Tìm việc ở Đà Nẵng',
    'Tìm việc tại Bắc Võ',
    'Tìm việc kho vận ở Hà Nội',
    'Có việc ca đêm tại Bắc Ninh không?',
    'Lương QC có đảm bảo 20 triệu không?',
    'Any jobs near me?',
    'How is the weather?'
  ]) {
    const result = answer(question, 'vi', { jobs });
    assert.deepEqual(ids(result), [], question);
    assert.deepEqual(Array.from(result.links, link => urlFor(link).pathname), ['/viec-lam.html', '/lien-he.html'], question);
    assert.doesNotMatch(JSON.stringify(result), /88–99|20 triệu|ca đêm/);
  }
});

test('handles empty, invalid and updated records and keeps broad prompts available', () => {
  for (const data of [undefined, null, { jobs: [] }, { jobs: [jobs.at(-1), null, { id: '', title: 'Invalid', open: true }] }]) {
    const result = answer('Find jobs', 'en', data);
    assert.deepEqual(ids(result), []);
    assert.match(result.text, /no open listings/);
    assert.equal(urlFor(result.links[0]).pathname, '/viec-lam.html');
  }
  const data = { jobs: [{ ...jobs[3], min: '9' }] };
  const result = answer('salary for QC', 'en', data);
  assert.deepEqual(ids(result), ['qc']);
  assert.match(result.text, /no income range/);
  assert.doesNotMatch(sources(result)[0].label, /9–13/);
  data.jobs[0].open = false;
  assert.deepEqual(ids(answer('salary for QC', 'en', data)), []);
  const prompted = answer('Lương & phúc lợi', 'vi', { jobs }, 1);
  assert.deepEqual(ids(prompted), ['mechanical', 'warehouse', 'operator']);
  assert.ok(sources(prompted).every(source => source.source));
});
