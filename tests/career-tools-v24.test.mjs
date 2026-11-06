import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/career-tools.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/career-tools.css', import.meta.url), 'utf8');
const appSource = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const localeSource = fs.readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const profile = overrides => ({ park: '', location: '', salary: '', shift: '', skill: '', ...overrides });
const job = overrides => ({ id: 'worker', title: 'Assembly', open: true, type: 'worker', location: 'Bắc Ninh', park: 'KCN Yên Phong', min: 9, max: 12, description: 'Lắp ráp sản phẩm', requirements: 'Có thể làm việc theo ca.', tags: [], ...overrides });

// A bounded DOM harness verifies the actual standalone mount/observer integration.
// Browser integration QA covers native forms, keyboard focus and responsive layout.
function scope({ lang = 'en', jobs = [job()], page = 'jobs', id = '', ready = true, search = '', jobTab, useLocale = false, listingResults = false } = {}) {
  const handlers = {}, outputs = {}, queues = [], observations = [];
  let root, discover, inserts = 0, discoverInserts = 0, renders = 0, snapshot = { lang, jobs };
  const createHost = () => ({ insertAdjacentElement(position, node) {
    assert.equal(position, 'afterend');
    if (node.tag === 'section') { assert.equal(root, undefined); root = node; inserts++; }
    else { assert.equal(discover, undefined); discover = node; discoverInserts++; }
  } });
  const main = {};
  let host = createHost();
  const app = { querySelector(selector) {
    if (selector === '#md-career-tools') return root;
    if (selector === '[data-ct-discover]') return discover;
    if (selector === '#main') return main;
    if (listingResults && (selector === '#jobResults' || selector === '#pages')) return host;
    if (selector === '.listing-controls' || selector === '.detail-info') return host;
    return null;
  } };
  const document = {
    readyState: 'loading', body: { dataset: { page, jobTab } }, documentElement: { lang }, activeElement: null,
    addEventListener(name, fn) { handlers[name] = fn; },
    getElementById(selector) { return selector === 'app' ? app : null; },
    querySelector() { return null; },
    createElement(tag) {
      return { tag, dataset: {}, listeners: {}, setAttribute() {}, contains() { return false; },
        addEventListener(name, fn) { assert.equal(this.listeners[name], undefined); this.listeners[name] = fn; },
        querySelector(selector) { return outputs[selector] ||= { innerHTML: '' }; },
        set innerHTML(value) { this.html = value; renders++; }, get innerHTML() { return this.html; },
        remove() { if (tag === 'section') root = undefined; else discover = undefined; },
      };
    },
  };
  class MutationObserver {
    constructor(callback) { this.callback = callback; observations.push(this); }
    observe(node, options) { assert.equal(node, app); assert.equal(options.subtree, true); }
  }
  const window = ready ? { MDPrototypeBridge: { snapshot: () => snapshot } } : {};
  const location = new URL('https://career.local/viec-lam.html' + search);
  if (id) location.searchParams.set('id', id);
  const FormData = function (form) { return Object.entries(form.values); };
  const context = vm.createContext({ window, document, location, URLSearchParams, URL, Intl, FormData, MutationObserver, queueMicrotask: callback => queues.push(callback) });
  if (useLocale) vm.runInContext(localeSource, context);
  vm.runInContext(source, context);
  return { api: window.MDCareerTools, window, document, location, main, handlers, outputs, observations, queues,
    mount() { handlers.DOMContentLoaded(); return root; },
    get root() { return root; }, get discover() { return discover; }, get discoverInserts() { return discoverInserts; },
    get inserts() { return inserts; }, get renders() { return renders; },
    setSnapshot(next) { snapshot = next; }, replaceHost() { host = createHost(); root = discover = undefined; }, context,
  };
}

test('illustrative defaults produce a reproducible VND breakdown', () => {
  const { api } = scope();
  const result = api.calculate(api.defaults);
  assert.deepEqual(plain(result.errors), {});
  assert.equal(result.hourly, 6000000 / 208);
  assert.equal(result.overtimePay, 865385);
  assert.equal(result.gross, 7365385);
  assert.equal(result.net, 7365385);
  assert.equal(result.deduction, 0);
});

test('custom overtime and deduction rates use base only, round individual components, and do not mutate inputs', () => {
  const { api } = scope();
  const values = { base: '1000001', allowance: '200000', hours: '200', overtime: '1.25', multiplier: '1.75', rate: '7.5', fixed: '1234' };
  const original = { ...values };
  const result = api.calculate(values);
  assert.equal(result.overtimePay, Math.round((1000001 / 200) * 1.25 * 1.75));
  assert.equal(result.deduction, 75000);
  assert.equal(result.net, 1000001 + 200000 + result.overtimePay - 75000 - 1234);
  assert.deepEqual(values, original);
});

test('calculator accepts zero amounts and deductions equal to gross without negative clamping', () => {
  const { api } = scope();
  assert.equal(api.calculate({ ...api.defaults, base: 0, allowance: 0, overtime: 0 }).net, 0);
  assert.equal(api.calculate({ ...api.defaults, allowance: 0, overtime: 0, rate: 100 }).net, 0);
  assert.equal(api.calculate({ ...api.defaults, allowance: 0, overtime: 0, rate: 100, fixed: 1 }).errors.fixed.key, 'excessive');
});

test('calculator rejects missing, malformed, nonfinite, negative, fractional currency and out-of-model inputs', () => {
  const { api } = scope();
  for (const invalid of ['', ' ', undefined, null, NaN, Infinity, 'NaN', '-1', '1000000001', true, [], {}]) {
    assert.ok(api.calculate({ ...api.defaults, base: invalid }).errors.base, `reject base ${String(invalid)}`);
  }
  assert.equal(api.calculate({ ...api.defaults, base: 1.5 }).errors.base.key, 'whole');
  for (const [key, value] of [['hours', 0], ['hours', 745], ['overtime', -1], ['multiplier', 5.01], ['rate', 100.01], ['fixed', -1]]) {
    assert.ok(api.calculate({ ...api.defaults, [key]: value }).errors[key], key);
  }
  assert.equal(api.calculate({ ...api.defaults, hours: 744, overtime: 1 }).errors.overtime.key, 'totalHours');
  assert.deepEqual(plain(api.calculate({ ...api.defaults, hours: 744, overtime: 0 }).errors), {});
});

test('matching considers only actual currently open worker records and is stable on ties', () => {
  const { api } = scope();
  const jobs = [job({ id: 'first' }), job({ id: 'closed', open: false }), job({ id: 'internal', type: 'internal' }), job({ id: 'truthy', open: 'true' }), job({ id: 'second' })];
  assert.deepEqual(plain(api.rankJobs(jobs, profile({ location: 'Bắc Ninh' }))).map(result => result.job.id), ['first', 'second']);
  assert.deepEqual(jobs.map(j => j.id), ['first', 'closed', 'internal', 'truthy', 'second']);
});

test('weighted factors disclose partial salary credit and exclude unselected factors from denominator', () => {
  const { api } = scope();
  const [match] = api.rankJobs([job()], profile({ park: 'KCN Yên Phong', location: 'Bắc Ninh', salary: '10', shift: 'night', skill: 'production' }));
  assert.equal(match.denominator, 100);
  assert.equal(match.earned, 72.5);
  assert.equal(match.score, 73);
  assert.deepEqual(plain(match.factors).map(f => [f.key, f.points, f.reason]), [
    ['park', 25, 'yes'], ['location', 20, 'yes'], ['salary', 12.5, 'partial'], ['shift', 0, 'unknown'], ['skill', 15, 'keyword'],
  ]);
  const [one] = api.rankJobs([job()], profile({ location: 'Bắc Ninh' }));
  assert.equal(one.denominator, 20);
  assert.equal(one.score, 100);
  assert.equal(one.factors.filter(f => !f.active && f.reason === 'notSelected').length, 4);
});

test('income ceiling is a hard exclusion, advertised minimum earns full credit, missing salary stays unknown', () => {
  const { api } = scope();
  assert.equal(api.rankJobs([job()], profile({ salary: 13, location: 'Bắc Ninh' })).length, 0);
  assert.equal(api.rankJobs([job()], profile({ salary: 9 }))[0].score, 100);
  assert.equal(api.rankJobs([job()], profile({ salary: 12 }))[0].score, 50);
  const [unknown] = api.rankJobs([job({ min: undefined, max: undefined })], profile({ salary: 10, location: 'Bắc Ninh' }));
  assert.equal(unknown.factors.find(f => f.key === 'salary').reason, 'unknown');
  assert.equal(api.rankJobs([job()], profile({ location: 'Elsewhere' })).length, 0);
});

test('no default profile, invalid salary or unsupported categories can produce a misleading ranking', () => {
  const { api } = scope();
  assert.equal(api.rankJobs([job()], profile()).length, 0);
  for (const invalid of ['0', '-1', 'Infinity', 'abc', '1001', '0.001', true]) {
    assert.ok(api.validateProfile(profile({ salary: invalid })).salary);
    assert.equal(api.rankJobs([job()], profile({ salary: invalid, location: 'Bắc Ninh' })).length, 0);
  }
  assert.ok(api.validateProfile(profile({ skill: 'invented' })).skill);
  assert.ok(api.validateProfile(profile({ shift: 'rotating-made-up' })).shift);
});

test('shift keywords never equate unspecified shift work to day or night schedules', () => {
  const { api } = scope();
  assert.equal(api.rankJobs([job()], profile({ shift: 'night' })).length, 0);
  assert.equal(api.rankJobs([job()], profile({ shift: 'day' })).length, 0);
  assert.equal(api.rankJobs([job()], profile({ shift: 'shifts' }))[0].score, 100);
  for (const description of ['Ca đêm', 'Night shift', '夜班', '야간']) {
    assert.equal(api.rankJobs([job({ requirements: '', description })], profile({ shift: 'night' }))[0].score, 100);
  }
});

test('current CMS job edits, additions, removals and closures change the ranking with no cached seed data', () => {
  const { api } = scope();
  const jobs = [job()];
  assert.equal(api.rankJobs(jobs, profile({ skill: 'production' })).length, 1);
  jobs[0].title = 'Warehouse operator'; jobs[0].description = 'Quản lý kho'; jobs[0].requirements = '';
  assert.equal(api.rankJobs(jobs, profile({ skill: 'production' })).length, 0);
  assert.equal(api.rankJobs(jobs, profile({ skill: 'warehouse' })).length, 1);
  jobs.push(job({ id: 'new-live-job', min: 20, max: 22 }));
  assert.equal(api.rankJobs(jobs, profile({ salary: 20 }))[0].job.id, 'new-live-job');
  jobs[1].open = false;
  assert.equal(api.rankJobs(jobs, profile({ salary: 20 })).length, 0);
  jobs.splice(0, 1);
  assert.equal(api.rankJobs(jobs, profile({ skill: 'warehouse' })).length, 0);
});

test('actual app data uses million-VND income, open worker types, and evidence from current job descriptions', () => {
  const literal = appSource.match(/const defaultJobs=(\[[\s\S]*?\]);/)?.[1];
  assert.ok(literal, 'actual runtime seed jobs located');
  const jobs = vm.runInNewContext(literal);
  const { api } = scope();
  const results = api.rankJobs(jobs, profile({ salary: 12, skill: 'warehouse' }));
  assert.ok(results.length);
  assert.equal(results[0].job.id, 'kho-van');
  assert.equal(results[0].score, 100);
  assert.ok(results.every(({ job }) => job.type === 'worker' && job.open && job.max >= 12));
});

test('real local detail links retain IDs and use the active locale; unsafe or stale bridge hrefs cannot escape', () => {
  const { api } = scope();
  const id = 'CMS job & <"/?#';
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    for (const href of [undefined, 'https://evil.test/chi-tiet-viec-lam.html?id=' + id, 'javascript:alert(1)', 'chi-tiet-viec-lam.html?id=wrong&lang=vi', 'chi-tiet-viec-lam.html?id=' + encodeURIComponent(id) + '&lang=vi']) {
      const actual = new URL(api.jobLink({ id, href }, lang), 'https://example.test/');
      assert.equal(actual.origin, 'https://example.test');
      assert.equal(actual.pathname, '/chi-tiet-viec-lam.html');
      assert.equal(actual.searchParams.get('id'), id);
      assert.equal(actual.searchParams.get('lang'), lang);
    }
  }
});

test('all visible interface, error, method, privacy and empty-state copy exists in four locales', () => {
  const { api } = scope();
  for (const [key, values] of Object.entries(api.copy)) {
    assert.equal(values.length, 4, key);
    for (const value of values) assert.ok(typeof value === 'string' && value.trim(), key);
  }
  for (const [index, lang] of ['vi', 'en', 'zh', 'ko'].entries()) {
    const context = scope({ lang }); const root = context.mount();
    for (const key of ['tools', 'calculator', 'matching', 'calcNote', 'privacy', 'methodNote', 'choose']) {
      assert.ok((root.innerHTML + Object.values(context.outputs).map(o => o.innerHTML).join('')).includes(api.copy[key][index]), `${lang}:${key}`);
    }
    assert.equal(root.lang, lang);
    assert.ok(root.innerHTML.includes('novalidate'));
    assert.ok(root.innerHTML.includes('role="alert"'));
    assert.ok(root.innerHTML.includes('aria-describedby="md-career-base-error"'));
    assert.ok(root.innerHTML.includes('for="md-career-base"'));
  }
});

test('mounting is idempotent and rehydrates after renderPage replacement or locale/CMS changes', () => {
  const context = scope(); context.mount();
  assert.equal(context.inserts, 1);
  assert.equal(context.renders, 1);
  context.api.refresh(); assert.equal(context.renders, 1);
  context.setSnapshot({ lang: 'ko', jobs: [job({ park: 'Changed live park' })] });
  context.api.refresh();
  assert.equal(context.renders, 2);
  assert.equal(context.root.lang, 'ko');
  assert.ok(context.root.innerHTML.includes('Changed live park'));
  context.replaceHost(); context.api.refresh();
  assert.equal(context.inserts, 2);
  assert.equal(context.renders, 3);
});

test('observer ignores its own output changes and coalesces external render mutations', () => {
  const context = scope(); context.mount();
  const observer = context.observations[0];
  observer.callback([{ target: { closest: () => context.root } }]);
  assert.equal(context.queues.length, 0);
  const mutations = [{ target: { closest: () => null } }];
  observer.callback(mutations); observer.callback(mutations);
  assert.equal(context.queues.length, 1);
  context.queues.shift()();
  assert.equal(context.renders, 1, 'no same-data observer render loop');
});

test('tools mount on the jobs page and existing open worker detail; omit missing/closed/internal detail and other pages', () => {
  const detail = scope({ page: 'detail', id: 'worker', search: '?tab=internal', jobTab: 'internal', listingResults: true });
  assert.ok(detail.mount());
  assert.equal(detail.discover, undefined);
  for (const options of [{ page: 'detail', id: 'missing' }, { page: 'detail', id: 'worker', jobs: [job({ open: false })] }, { page: 'detail', id: 'worker', jobs: [job({ type: 'internal' })] }, { page: 'internal' }, { page: 'home' }, { page: 'admin' }]) {
    assert.equal(scope(options).mount(), undefined);
  }
});

test('internal entry omits both worker tools and discovery with locale routing, URL, or body tab state', () => {
  for (const options of [
    { search: '?tab=internal', jobTab: 'worker', useLocale: true },
    { search: '?tab=internal', jobTab: 'worker' },
    { jobTab: 'internal' },
  ]) {
    const s = scope({ listingResults: true, ...options });
    assert.equal(s.mount(), undefined);
    assert.equal(s.discover, undefined);
    assert.equal(s.inserts + s.discoverInserts, 0);
  }
});

test('refresh removes worker tools and discovery when the listing DOM stays in place on Internal', () => {
  const s = scope({ listingResults: true });
  assert.ok(s.mount());
  assert.equal(s.discover.href, '#md-career-tools');
  s.document.body.dataset.jobTab = 'internal';
  s.api.refresh();
  assert.equal(s.root, undefined);
  assert.equal(s.discover, undefined);
});

test('listing replacements under the same main restore worker drafts and disclosures without duplicate mounts', () => {
  const s = scope({ listingResults: true, useLocale: true });
  const firstRoot = s.mount(), firstDiscover = s.discover;
  const changeForm = (id, values) => firstRoot.listeners.input({ target: { closest: () => ({ id, values }) } });
  changeForm('md-career-calculator', { ...s.api.defaults, base: '8700000' });
  changeForm('md-career-matching', profile({ salary: '11' }));
  firstRoot.listeners.toggle({ target: { dataset: { ctPanel: 'optional' }, open: true } });
  const switchTab = tab => {
    if (tab === 'internal') s.location.searchParams.set('tab', tab);
    else s.location.searchParams.delete('tab');
    s.document.body.dataset.jobTab = tab;
    s.replaceHost();
    s.observations[0].callback([{ target: s.main }]);
    s.queues.shift()();
  };

  switchTab('internal');
  assert.equal(s.root, undefined);
  assert.equal(s.discover, undefined);
  switchTab('worker');
  assert.notEqual(s.root, firstRoot);
  assert.notEqual(s.discover, firstDiscover);
  assert.match(s.root.innerHTML, /name="base"[^>]*value="8700000"/);
  assert.match(s.root.innerHTML, /name="salary"[^>]*value="11"/);
  assert.match(s.root.innerHTML, /data-ct-panel="optional" open/);
  const root = s.root, discover = s.discover;
  s.api.refresh();
  assert.equal(s.root, root);
  assert.equal(s.discover, discover);
  assert.equal(s.inserts, 2);
  assert.equal(s.discoverInserts, 2);
  assert.equal(s.renders, 2);
});

test('missing bridge reports unavailable data without inventing jobs and can recover', () => {
  const context = scope({ ready: false }); context.mount();
  assert.ok(context.outputs['#md-career-matches'].innerHTML.includes('Job data is not ready'));
  context.window.MDPrototypeBridge = { snapshot: () => ({ lang: 'en', jobs: [job()] }) };
  context.api.refresh();
  assert.ok(context.root.innerHTML.includes('KCN Yên Phong'));
  assert.equal(context.renders, 2);
});

test('CMS strings are escaped at the HTML boundary and unavailable profile options do not corrupt markup', () => {
  const context = scope({ jobs: [job({ park: '\"><img src=x onerror=alert(1)>', location: '<script>bad()</script>' })] });
  const root = context.mount();
  assert.ok(root.innerHTML.includes('&lt;img'));
  assert.ok(root.innerHTML.includes('&lt;script&gt;'));
  assert.ok(!root.innerHTML.includes('<img'));
  assert.ok(!root.innerHTML.includes('<script>'));
});

test('standalone module makes no storage writes, collects no contact fields, and leaves runtime rendering intact', () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest|sendBeacon|\.renderPage\s*=/);
  assert.doesNotMatch(source, /name=["'](?:phone|email|cv|name)["']/);
  assert.ok(source.includes('window.MDPrototypeBridge?.snapshot()'));
  assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(css, /\.ct-tools \[hidden\]/);
});
