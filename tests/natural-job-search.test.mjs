import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const window = {};
const document = { readyState: 'loading', addEventListener() {} };
const source = readFileSync(new URL('../public/natural-job-search.js', import.meta.url), 'utf8');
const localeSource = readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8');
runInNewContext(source, { window, document, URLSearchParams });
const { parseQuery, filterJobs, jobLink } = window.MDNaturalJobSearch;
const native = value => JSON.parse(JSON.stringify(value));
const job = (id, values = {}) => ({
  id, open: true, type: 'worker', location: 'Bắc Ninh', park: 'KCN Yên Phong', min: 9, max: 13, ...values
});
const jobs = [
  job('day', { shift: 'day' }),
  job('unknown', { tags: ['Ca ngày'], description: 'Chỉ làm ca ngày', preference: 'day' }),
  job('invalid', { shift: 'ca ngày' }),
  job('night', { shift: 'night' }),
  job('elsewhere', { location: 'Bắc Giang', park: 'KCN Vân Trung' }),
  job('below', { max: 11 }),
  job('closed', { open: false, shift: 'day', location: 'Đà Nẵng', park: 'KCN Hòa Khánh' }),
  job('internal', { type: 'internal' }),
  job('punctuated', { location: 'Hà Nội', park: 'KCN VSIP II-A', shift: 'rotating' })
];

test('reads the quoted example and leaves the rest open for explicit confirmation', () => {
  assert.deepEqual(native(parseQuery('Tìm việc ca ngày ở Bắc Ninh', jobs)), {
    criteria: { location: 'Bắc Ninh', park: '', income: '', shift: 'day', type: '' },
    unknown: [], conflicts: []
  });
});

test('recognizes accent-free text, a park alias, decimals and explicit worker type', () => {
  const result = native(parseQuery('Tim viec pho thong o Bac Ninh, khu cong nghiep Yen Phong, thu nhap tu 12,5tr tro len', jobs));
  assert.deepEqual(result, {
    criteria: { location: 'Bắc Ninh', park: 'KCN Yên Phong', income: 12.5, shift: '', type: 'worker' },
    unknown: [], conflicts: []
  });
  assert.equal(parseQuery('Tìm ở KCN VSIP II-A', jobs).criteria.park, 'KCN VSIP II-A');
});

test('flags unrecognized conditions, unsupported income expressions and ambiguous location choices', () => {
  const result = native(parseQuery('Tìm việc ở Bắc Ninh hoặc Bắc Giang, không làm ca đêm, lương dưới 12 triệu, có xe đưa đón', jobs));
  assert.deepEqual(result.conflicts, ['location']);
  assert.deepEqual(result.criteria, { location: '', park: '', income: '', shift: '', type: '' });
  assert.deepEqual(result.unknown, ['hoặc', 'không làm ca đêm', 'dưới 12 triệu', 'có xe đưa đón']);
  assert.equal(parseQuery('Lương 9–12 triệu', jobs).criteria.income, '');
  assert.equal(parseQuery('Lương 12 triệu trở xuống', jobs).criteria.income, '');
  assert.equal(parseQuery('Tìm việc ở Đà Nẵng', jobs).criteria.location, '');
});

test('preserves complete negated shift phrases without selecting their shifts', () => {
  for (const phrase of [
    'không làm việc theo ca đêm',
    'chưa thể làm việc theo ca đêm',
    'tránh phải nhận việc theo ca đêm',
    'ngoại trừ công việc theo ca đêm',
    'không làm ca đêm hoặc ca luân phiên'
  ]) {
    const result = native(parseQuery(`Tìm việc ở Bắc Ninh, ${phrase}.`, jobs));
    assert.equal(result.criteria.location, 'Bắc Ninh');
    assert.equal(result.criteria.shift, '', phrase);
    assert.deepEqual(result.unknown, [phrase]);
  }
});

test('keeps positive criteria outside a negative expression', () => {
  const result = native(parseQuery('Tìm việc không làm ca đêm ở Bắc Ninh, ca ngày và lương từ 12 triệu', jobs));
  assert.deepEqual(result.criteria, { location: 'Bắc Ninh', park: '', income: 12, shift: 'day', type: '' });
  assert.deepEqual(result.unknown, ['không làm ca đêm']);
  assert.equal(parseQuery('Không có kinh nghiệm, làm ca đêm', jobs).criteria.shift, 'night');
});

test('checks only explicit shifts and counts unknowns after applying the other criteria', () => {
  const criteria = { location: 'Bắc Ninh', park: 'KCN Yên Phong', income: 12, type: 'worker', shift: 'day' };
  const result = native(filterJobs(jobs, criteria));
  assert.deepEqual(result.matches.map(match => match.id), ['day']);
  assert.equal(result.unknownShift, 2);
  const relaxed = native(filterJobs(jobs, { ...criteria, shift: '' }));
  assert.deepEqual(relaxed.matches.map(match => match.id), ['day', 'unknown', 'invalid', 'night']);
  assert.equal(relaxed.unknownShift, 0);
});

test('constructs encoded same-site job links from IDs and permits only the supported locales', () => {
  const href = jobLink('unsafe?id=2&x=<script>', 'ko');
  const result = new URL(href, 'https://example.test/');
  assert.equal(result.origin, 'https://example.test');
  assert.equal(result.pathname, '/chi-tiet-viec-lam.html');
  assert.equal(result.searchParams.get('id'), 'unsafe?id=2&x=<script>');
  assert.equal(result.searchParams.get('lang'), 'ko');
  assert.match(jobLink('test', 'constructor'), /lang=vi$/);
});

function searchView({ page = 'jobs', path = 'viec-lam.html', routing = true } = {}) {
  const location = new URL(path, 'https://example.test/');
  const window = Object.assign(new EventTarget(), { MDPrototypeBridge: { snapshot: () => ({ jobs, lang: 'vi' }) } });
  let host, root;
  function replaceListing() {
    if (root) root.isConnected = false;
    host = {
      insertAdjacentElement(position, details) {
        assert.equal(position, 'afterend');
        root = details;
        root.isConnected = true;
      }
    };
  }
  replaceListing();
  const app = { querySelector: selector => selector === '#jobResults' ? host : null };
  const document = {
    readyState: 'complete', body: { dataset: { page } }, addEventListener() {},
    getElementById: id => id === 'app' ? app : null,
    createElement(tag) {
      assert.equal(tag, 'details');
      const listeners = new Map();
      const parts = new Map();
      return {
        addEventListener: (type, handler) => listeners.set(type, handler),
        querySelector: selector => parts.get(selector),
        remove() { this.isConnected = false; },
        set innerHTML(html) {
          this.markup = html;
          parts.clear();
          for (const [, id] of html.matchAll(/id="(md-njs-[\w-]+)"/g)) {
            parts.set(`#${id}`, { focus() {}, replaceChildren() { this.innerHTML = ''; } });
          }
        },
        dispatch(type, target) { listeners.get(type)({ target, preventDefault() {} }); }
      };
    }
  };
  const context = { window, document, location, URL, URLSearchParams, MutationObserver: class { observe() {} } };
  if (routing) runInNewContext(localeSource, context);
  runInNewContext(source, context);

  const part = name => root.querySelector(`#md-njs-${name}`);
  return {
    get root() { return root; },
    part,
    interpret(query) {
      root.open = true;
      part('query').value = query;
      root.dispatch('submit', part('query-form'));
      return part('type').value;
    },
    confirm() { root.dispatch('submit', part('criteria-form')); },
    reset() { root.dispatch('click', { closest: () => part('reset') }); },
    switchTab(tab, replace = true) {
      location.search = `?tab=${tab}`;
      if (replace) replaceListing();
      window.dispatchEvent(new Event('md:jobs-view-change'));
    }
  };
}

test('defaults to internal jobs on the unified internal URL and supports an explicit query override', () => {
  const view = searchView({ path: 'viec-lam.html?tab=internal' });
  assert.match(view.root.markup, /<option value="internal" selected>/);
  assert.equal(view.interpret('Tìm việc ở Bắc Ninh'), 'internal');
  view.confirm();
  assert.match(view.part('results').innerHTML, /id=internal&amp;/);
  assert.doesNotMatch(view.part('results').innerHTML, /id=day&amp;/);

  assert.equal(view.interpret('Tìm việc phổ thông hoặc nội bộ'), '');
  assert.match(view.part('message').innerHTML, /Có nhiều lựa chọn cho Loại việc/);
  assert.equal(view.interpret('Tìm việc phổ thông ở Bắc Ninh'), 'worker');
  view.confirm();
  assert.match(view.part('results').innerHTML, /id=day&amp;/);
  assert.doesNotMatch(view.part('results').innerHTML, /id=internal&amp;/);

  view.reset();
  assert.equal(view.part('type').value, 'internal');
  assert.equal(view.part('query').value, '');
  assert.equal(view.part('results').hidden, true);
});

test('clears prior search state only when the active tab changes', () => {
  const view = searchView();
  assert.equal(view.interpret('Tìm việc ở Bắc Ninh'), 'worker');
  view.confirm();
  view.switchTab('worker');
  assert.equal(view.root.open, true);
  assert.match(view.part('results').innerHTML, /id=day&amp;/);
  const workerRoot = view.root;

  view.switchTab('internal');
  assert.notEqual(view.root, workerRoot);
  assert.equal(view.root.open, false);
  assert.match(view.root.markup, /<option value="internal" selected>/);
  assert.equal(view.part('criteria-form').hidden, true);
  assert.equal(view.part('results').hidden, true);
  assert.equal(view.interpret('Tìm việc ở Bắc Ninh'), 'internal');
  view.confirm();

  const internalRoot = view.root;
  view.switchTab('worker', false);
  assert.equal(view.root, internalRoot);
  assert.match(view.root.markup, /<option value="worker" selected>/);
  assert.equal(view.part('criteria-form').hidden, true);
  assert.equal(view.part('results').hidden, true);
});

test('keeps the internal default on a legacy page without the routing API', () => {
  const view = searchView({ page: 'internal', path: 'tuyen-dung-noi-bo.html', routing: false });
  assert.equal(view.interpret('Tìm việc'), 'internal');
  assert.equal(view.interpret('Tìm việc phổ thông'), 'worker');
  view.reset();
  assert.equal(view.part('type').value, 'internal');
});
