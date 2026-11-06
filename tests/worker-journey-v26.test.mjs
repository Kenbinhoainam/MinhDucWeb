import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const workerSource = fs.readFileSync(new URL('../public/worker-journey.js', import.meta.url), 'utf8');
const careerSource = fs.readFileSync(new URL('../public/career-tools.js', import.meta.url), 'utf8');
const assistantSource = fs.readFileSync(new URL('../public/ai-assistant.js', import.meta.url), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const job = overrides => ({ id: 'chosen', type: 'worker', open: true, title: 'Chosen worker job', park: 'KCN Yên Phong', location: 'Bắc Ninh', min: 9, max: 12, tags: [], ...overrides });
const prefs = () => ({ shift: 'Ca ngày', shuttle: 'Không', area: 'Bắc Ninh' });

// A bounded DOM model executes the shipped module and its native event hooks.
// It is not a browser, layout check or substitute for the primary's CUA QA.
function workerScope({ page = 'detail', id = 'chosen', jobs = [job()], lang = 'vi', saved = {}, ready = true, channels = [] } = {}) {
  const handlers = {}, queues = [], observations = [], reads = [];
  let snapshot = { lang, jobs }, writes = 0, backClicks = 0, storageReads = 0;
  class Element {
    constructor(tag = 'section') { this.tag = tag; this.children = []; this.dataset = {}; this.handlers = {}; this.attributes = {}; this.hidden = false; this.value = ''; this.textContent = ''; }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key]; }
    append(...nodes) { for (const node of nodes) { node.parent = this; this.children.push(node); } }
    prepend(node) { node.parent = this; this.children.unshift(node); }
    after(node) { const list = this.parent.children; node.parent = this.parent; list.splice(list.indexOf(this) + 1, 0, node); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(item => item !== this); }
    set innerHTML(value) { this.html = value; writes++; }
    get innerHTML() { return this.html || ''; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    closest(selector) { if (selector === '.chip-row' && this.className === 'chip-row') return this; return this.parent?.closest(selector) || null; }
    descendants() { return this.children.flatMap(child => [child, ...child.descendants()]); }
    querySelector(selector) {
      if (selector.startsWith('#')) return this.descendants().find(node => node.id === selector.slice(1)) || null;
      if (selector === 'span' || selector === 'legend') return this.descendants().find(node => node.tag === selector) || null;
      const uncertain = selector.match(/^\[data-wj-uncertain="(\w+)"\]$/);
      if (uncertain) return this.descendants().find(node => node.dataset.wjUncertain === uncertain[1]) || null;
      const input = selector.match(/^input\[name="(\w+)"\]$/);
      if (input) return this.descendants().find(node => node.tag === 'input' && node.name === input[1]) || null;
      return null;
    }
  }
  const form = new Element('form'); form.id = 'applyForm'; form.dataset.formKey = id;
  const step1 = new Element('fieldset'), step2 = new Element('fieldset'); step2.hidden = true;
  const legend = new Element('legend'); step2.append(legend); form.append(step1, step2);
  const native = new Map();
  for (const [key, values] of [['shift', ['Ca ngày', 'Ca đêm', 'Linh hoạt']], ['shuttle', ['Có', 'Không']]]) {
    const group = new Element('div'); group.className = 'chip-row'; step1.append(group);
    for (const value of values) {
      const radio = new Element('input'); radio.type = 'radio'; radio.name = key; radio.value = value; radio.checked = false; group.append(radio);
    }
    native.set(key, {
      get value() { return group.descendants().find(node => node.checked)?.value || ''; },
      set value(value) { group.descendants().forEach(node => { if (node.tag === 'input') node.checked = node.value === value; }); },
    });
  }
  const area = new Element('select'); area.name = 'area'; area.value = '';
  Object.defineProperty(area, 'options', { get() { return this.children; } });
  for (const value of ['', 'Bắc Ninh', 'Bắc Giang']) { const option = new Element('option'); option.value = value; area.append(option); }
  native.set('area', area); step1.append(area);
  // Any accidental access to a contact field fails the behavior tests immediately.
  form.elements = { namedItem(key) { reads.push(key); assert.ok(['shift', 'shuttle', 'area'].includes(key), `must not read ${key}`); return native.get(key); } };
  const back = new Element('button'); back.id = 'applyBack'; back.click = () => { backClicks++; step1.hidden = false; step2.hidden = true; }; step2.append(back);
  const oldQuery = form.querySelector.bind(form);
  form.querySelector = selector => selector === '[data-step="2"]' ? step2 : oldQuery(selector);
  const info = new Element('div'), app = new Element('div'); app.append(info, form);
  let currentInfo = info, currentForm = form;
  app.querySelector = selector => selector === '.detail-info' ? currentInfo : selector === '#applyForm.apply-micro' ? currentForm : Element.prototype.querySelector.call(app, selector);
  app.querySelectorAll = selector => selector === '[data-wj-owned]' ? app.descendants().filter(node => 'wjOwned' in node.dataset) : [];
  const document = { readyState: 'loading', body: { dataset: { page } }, documentElement: { lang },
    getElementById: name => name === 'app' ? app : null,
    querySelectorAll: () => channels.map(href => ({ getAttribute: () => href })),
    createElement: tag => new Element(tag), addEventListener: (name, handler) => { handlers[name] = handler; },
  };
  const window = { sessionStorage: { getItem(key) { storageReads++; assert.equal(key, 'md_preferences_' + id); return JSON.stringify(saved); } } };
  if (ready) window.MDPrototypeBridge = { snapshot: () => snapshot };
  class MutationObserver { constructor(callback) { this.callback = callback; observations.push(this); } observe(node, options) { this.node = node; this.options = options; } }
  vm.runInNewContext(workerSource, { window, document, location: { search: '?' + new URLSearchParams({ id }) }, URLSearchParams, URL, MutationObserver, queueMicrotask: callback => queues.push(callback) });
  return { api: window.MDWorkerJourney, app, form, info, step1, step2, back, native, document, window, queues, observations, reads,
    mount() { handlers.DOMContentLoaded(); }, setSnapshot(value) { snapshot = value; },
    get writes() { return writes; }, get backClicks() { return backClicks; }, get storageReads() { return storageReads; },
    get facts() { return currentInfo.querySelector('#md-worker-facts'); }, get review() { return currentForm.querySelector('[data-step="2"]').querySelector('#md-worker-review'); },
    replaceShell(next) { currentInfo = next.info; currentForm = next.form; app.children = []; app.append(currentInfo, currentForm); },
    flush() { while (queues.length) queues.shift()(); },
  };
}

test('only the requested currently open worker job qualifies; no fallback to another vacancy', () => {
  const { api } = workerScope();
  for (const jobs of [[job({ open: false })], [job({ type: 'internal' })], [job({ id: 'other' })], [job({ open: 'true' })], []]) assert.equal(api.chosenWorker({ jobs }, 'chosen'), null);
  assert.equal(api.chosenWorker({}, 'chosen'), null);
  assert.equal(api.chosenWorker({ jobs: [job()] }, 'chosen').id, 'chosen');
});

test('facts separate advertised income from unknown pay breakdown, shifts and transport', () => {
  const { api } = workerScope();
  const rows = plain(api.facts(job({ description: 'Ca ngày, tăng ca', requirements: 'Có thể làm việc theo ca', tags: ['BHXH', 'Đào tạo'] }), 'en'));
  assert.match(rows[1].value, /9–12 million VND\/month/);
  assert.match(rows[1].value, /take-home pay is unconfirmed/);
  assert.equal(rows[2].value, api.copy.shiftUnknown[1], 'requirements cannot promise a schedule');
  assert.equal(rows[3].value, api.copy.transportUnknown[1]);
  const shuttle = api.facts(job({ tags: ['Xe đưa đón'] }), 'en')[3].value;
  assert.match(shuttle, /listing mentions a shuttle/); assert.match(shuttle, /unspecified/);
  for (const min of [undefined, NaN, -1]) assert.doesNotMatch(api.facts(job({ min }), 'en')[1].value, /million/);
});

test('Korean shuttle tags match in composed and decomposed Unicode without inventing route details', () => {
  const { api } = workerScope();
  for (const tag of ['통근버스', '통근버스'.normalize('NFD')]) {
    const transport = api.facts(job({ tags: [tag] }), 'ko')[3];
    assert.equal(transport.value, api.copy.shuttleMention[3]);
    assert.notEqual(transport.value, api.copy.transportUnknown[3]);
  }
});

test('review contains only the chosen job and explicit preferences, with no job-condition promises', () => {
  const { api } = workerScope();
  const rows = plain(api.reviewRows(job({ title: 'Specific chosen vacancy' }), prefs(), 'en'));
  assert.deepEqual(rows.map(row => row.value), ['Specific chosen vacancy', 'Day shift', 'No shuttle needed', 'Bắc Ninh']);
  assert.match(api.reviewHTML(job(), prefs(), 'en'), /not conditions confirmed by the employer/);
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    const uncertain = api.reviewRows(job(), { shift: 'Chưa rõ', shuttle: 'Chưa rõ', area: 'Chưa rõ' }, lang);
    assert.ok(uncertain.slice(1).every(row => row.value === api.copy.uncertain[['vi', 'en', 'zh', 'ko'].indexOf(lang)]));
  }
});

test('configured contact links are deduplicated and allowlisted; demo or unsafe URLs are not actions', () => {
  const { api } = workerScope();
  const links = ['tel:0912345678', 'https://zalo.me/company', 'https://m.me/company', 'https://messenger.com/t/company'];
  assert.equal(api.supportLinks(links.concat(links).map(href => ({ href }))).length, 4);
  for (const href of ['', '#', 'javascript:alert(1)', 'https://evil.test/help', 'http://zalo.me/company', 'https://zalo.me/', 'https://zalo.me.evil.test/a', 'https://user@zalo.me/company', 'https://messenger.com/other', 'tel:123']) assert.equal(api.supportLinks([{ href }]).length, 0, href);
  assert.match(api.factsHTML(job(), [], 'en'), /No direct contact channel is configured/);
  assert.doesNotMatch(api.factsHTML(job(), [], 'en'), /<a /);
});

test('all four locales cover the facts, review, uncertainty and direct contact text', () => {
  const { api } = workerScope();
  for (const [key, translations] of Object.entries(api.copy)) {
    assert.equal(translations.length, 4, key); assert.ok(translations.every(value => typeof value === 'string' && value.trim()), key);
  }
  for (const [index, lang] of ['vi', 'en', 'zh', 'ko'].entries()) {
    assert.ok(api.factsHTML(job(), [], lang).includes(api.copy.shiftUnknown[index]));
    assert.ok(api.reviewHTML(job(), prefs(), lang).includes(api.copy.preferenceNote[index]));
  }
});

test('CMS and form text is escaped at both HTML boundaries', () => {
  const { api } = workerScope();
  const malicious = '<img src=x onerror="bad()">';
  const html = api.factsHTML(job({ park: malicious }), [], 'en') + api.reviewHTML(job({ title: malicious }), { ...prefs(), area: malicious }, 'en');
  assert.ok(html.includes('&lt;img')); assert.doesNotMatch(html, /<img/);
});

test('mount is idempotent, adds no defaults, preserves native step state, and edit uses native Back', () => {
  const s = workerScope(); s.mount();
  assert.ok(s.facts); assert.ok(s.review); assert.equal(s.step2.hidden, true);
  assert.deepEqual(plain(s.api.nativePreferences(s.form)), { shift: '', shuttle: '', area: '' });
  const writes = s.writes; s.api.refresh(); assert.equal(s.writes, writes);
  assert.equal(s.info.children.length, 1); assert.equal(s.step2.children.filter(node => node.id === 'md-worker-review').length, 1);
  s.step1.hidden = true; s.step2.hidden = false;
  s.review.handlers.click({ target: { closest: () => ({}) } });
  assert.equal(s.backClicks, 1); assert.equal(s.step1.hidden, false); assert.equal(s.step2.hidden, true);
});

test('uncertain radio/select choices use one canonical value, localize, and never become flexible or yes', () => {
  const s = workerScope(); s.mount();
  for (const key of ['shift', 'shuttle']) {
    const label = s.form.querySelector(`[data-wj-uncertain="${key}"]`);
    assert.equal(label.children[0].value, 'Chưa rõ'); assert.notEqual(label.children[0].checked, true);
    s.native.get(key).value = 'Chưa rõ';
  }
  s.native.get('area').value = 'Chưa rõ'; s.api.refresh();
  assert.match(s.review.innerHTML, /Chưa rõ \/ cần tư vấn/);
  s.setSnapshot({ lang: 'ko', jobs: [job()] }); s.api.refresh();
  assert.equal(s.form.querySelector('[data-wj-uncertain="shift"]').querySelector('span').textContent, s.api.copy.uncertain[3]);
  assert.equal(s.native.get('area').options.filter(option => option.value === 'Chưa rõ').length, 1);
  assert.deepEqual(plain(s.api.nativePreferences(s.form)), { shift: 'Chưa rõ', shuttle: 'Chưa rõ', area: 'Chưa rõ' });
});

test('only explicitly saved per-job uncertain preferences restore, once, without overwriting current choices', () => {
  const s = workerScope({ saved: { shift: 'Chưa rõ', shuttle: 'Chưa rõ', area: 'Chưa rõ', name: 'ignored', phone: 'ignored' } });
  s.native.get('shift').value = 'Ca đêm'; s.mount();
  assert.deepEqual(plain(s.api.nativePreferences(s.form)), { shift: 'Ca đêm', shuttle: 'Chưa rõ', area: 'Chưa rõ' });
  s.native.get('shuttle').value = 'Không'; s.api.refresh(); assert.equal(s.native.get('shuttle').value, 'Không');
  assert.equal(s.storageReads, 1);
});

test('locale replacement restores saved uncertain choices after native options are recreated, without defaults or duplicates', () => {
  const saved = { shift: 'Chưa rõ', shuttle: 'Chưa rõ', area: 'Chưa rõ' };
  const s = workerScope({ saved }); s.mount();
  const replacement = workerScope({ lang: 'en' });
  assert.equal(replacement.native.get('shift').value, '');
  s.replaceShell(replacement); s.setSnapshot({ lang: 'en', jobs: [job()] }); s.api.refresh();
  assert.deepEqual(plain(s.api.nativePreferences(replacement.form)), saved);
  assert.match(s.review.innerHTML, /Not sure \/ need advice/); assert.equal(s.storageReads, 2);
  const writes = s.writes; s.api.refresh(); assert.equal(s.writes, writes);
  assert.equal(replacement.form.descendants().filter(node => node.id === 'applyShiftUncertain').length, 1);
  assert.equal(replacement.native.get('area').options.filter(option => option.value === 'Chưa rõ').length, 1);
});

test('in-memory locale snapshot retains explicit uncertainty when browser storage is denied', () => {
  const scope = vm.createContext({window:{},document:{documentElement:{lang:'vi'}},URL});
  vm.runInContext(fs.readFileSync('public/contact-media.js','utf8'),scope);
  const api = scope.window.MDExperience;
  const prepare = s => {
    s.form.querySelectorAll = selector => selector.startsWith('input:not') ? s.form.descendants().filter(node => ['input','select'].includes(node.tag)) : [];
    for(const node of s.form.descendants()) if(['input','select'].includes(node.tag)) {node.tagName=node.tag.toUpperCase();if(node.tag==='select')node.type='select-one';}
    return {querySelectorAll:()=>[s.form],querySelector:()=>s.form};
  };
  const s=workerScope();s.window.sessionStorage.getItem=()=>{throw new Error('storage denied');};s.mount();
  for(const key of ['shift','shuttle','area'])s.native.get(key).value='Chưa rõ';
  const snapshot=api.captureForms(prepare(s));
  const fresh=workerScope({lang:'en'});api.restoreForms(snapshot,prepare(fresh));
  assert.deepEqual(plain(fresh.form.__mdPendingWorkerPreferences),{shift:'Chưa rõ',shuttle:'Chưa rõ',area:'Chưa rõ'});
  s.replaceShell(fresh);s.setSnapshot({lang:'en',jobs:[job()]});s.api.refresh();
  for(const key of ['shift','shuttle','area'])assert.equal(fresh.native.get(key).value,'Chưa rõ',key);
  assert.equal(fresh.form.__mdPendingWorkerPreferences,undefined);
  assert.match(s.review.innerHTML,/Not sure \/ need advice/);
  assert.equal(fresh.form.descendants().filter(node=>node.id==='applyShiftUncertain').length,1);
});

test('native selection and silent voice-like value updates refresh review; no contact fields are read', () => {
  const s = workerScope({ lang: 'en' }); s.mount();
  for (const [key, value] of Object.entries(prefs())) s.native.get(key).value = value;
  s.app.handlers.change({ target: { closest: () => s.form } }); s.flush();
  assert.match(s.review.innerHTML, /Day shift/); assert.match(s.review.innerHTML, /No shuttle needed/);
  s.native.get('shift').value = 'Ca đêm';
  s.observations[0].callback([{ target: { closest: () => null } }]); s.flush();
  assert.match(s.review.innerHTML, /Night shift/);
  assert.ok(s.reads.every(key => ['shift', 'shuttle', 'area'].includes(key)));
});

test('locale and live job changes rehydrate; own mutations do not loop; closed jobs remove enhancements', () => {
  const s = workerScope(); s.mount();
  s.observations[0].callback([{ target: { closest: () => s.review } }]); assert.equal(s.queues.length, 0);
  s.setSnapshot({ lang: 'zh', jobs: [job({ title: 'Changed selected vacancy', min: 10, max: 14 })] }); s.api.refresh();
  assert.equal(s.facts.lang, 'zh'); assert.match(s.facts.innerHTML, /10–14/); assert.match(s.review.innerHTML, /Changed selected vacancy/);
  s.setSnapshot({ lang: 'zh', jobs: [job({ open: false })] }); s.api.refresh(); assert.equal(s.facts, null); assert.equal(s.review, null);
});

test('other pages, internal/closed/missing jobs and unavailable bridge are untouched', () => {
  for (const options of [{ page: 'home' }, { page: 'jobs' }, { jobs: [job({ type: 'internal' })] }, { jobs: [job({ open: false })] }, { id: 'missing' }, { ready: false }]) {
    const s = workerScope(options); s.mount(); assert.equal(s.facts, null); assert.equal(s.review, null); assert.equal(s.storageReads, 0);
  }
  const s = workerScope({ ready: false }); s.mount(); s.window.MDPrototypeBridge = { snapshot: () => ({ lang: 'en', jobs: [job()] }) }; s.api.refresh(); assert.ok(s.facts);
});

function careerScope({ jobs = [job()], lang = 'en' } = {}) {
  let snapshot = { lang, jobs }, root, discovery, renders = 0;
  const handlers = {}, queues = [], observations = [], outputs = {};
  const document = { readyState: 'loading', activeElement: null, body: { dataset: { page: 'jobs' } }, documentElement: { lang },
    addEventListener(name, fn) { handlers[name] = fn; }, getElementById: () => app, querySelector: () => null,
    createElement(tag) {
      const node = { tag, dataset: {}, handlers: {}, setAttribute() {}, contains() { return false; }, addEventListener(name, fn) { this.handlers[name] = fn; },
        querySelector(selector) { return selector === '.ct-optional' ? this.optional : outputs[selector] ||= { innerHTML: '' }; },
        set innerHTML(html) { this.html = html; renders++; this.optional = { open: /data-ct-panel="optional" open/.test(html), querySelector: () => ({ focus() { document.activeElement = 'optional-summary'; }, scrollIntoView() {} }) }; },
        get innerHTML() { return this.html; }, remove() { root = null; },
      }; return node;
    },
  };
  let order;
  const host = name => ({ name, insertAdjacentElement(position, node) { assert.equal(position, 'afterend'); order.splice(order.indexOf(this) + 1, 0, node); if (node.tag === 'section') root = node; else discovery = node; } });
  const results = host('results'), pages = host('pagination'), filter = host('filter');
  order = [filter, results, pages];
  const app = { querySelector(selector) { return ({ '#pages': pages, '#jobResults': results, '.v14-filter-disclosure': filter, '#md-career-tools': root, '[data-ct-discover]': discovery })[selector] || null; } };
  const window = { MDPrototypeBridge: { snapshot: () => snapshot } };
  class MutationObserver { constructor(fn) { this.callback = fn; observations.push(this); } observe() {} }
  vm.runInNewContext(careerSource, { window, document, location: { search: '' }, URLSearchParams, URL, Intl, MutationObserver, queueMicrotask: fn => queues.push(fn) });
  return { api: window.MDCareerTools, document, filter, results, pages, observations, queues,
    mount() { handlers.DOMContentLoaded(); }, setSnapshot(value) { snapshot = value; }, get root() { return root; }, get discovery() { return discovery; }, get order() { return order; }, get renders() { return renders; },
    replaceShell() { root = null; discovery = null; order = [filter, results, pages]; },
  };
}

test('career tools mount after pagination, collapsed, with one discovery entry after results', () => {
  const s = careerScope(); s.mount();
  assert.deepEqual(s.order.map(node => node.name || node.tag), ['filter', 'results', 'a', 'pagination', 'section']);
  assert.equal(s.root.optional.open, false); assert.equal(s.discovery.href, '#md-career-tools');
  assert.equal(s.discovery.textContent, 'Optional job tools');
  s.api.refresh(); assert.equal(s.order.filter(node => node.tag === 'a').length, 1); assert.equal(s.order.filter(node => node.tag === 'section').length, 1);
  s.discovery.handlers.click({ preventDefault() {} }); assert.equal(s.root.optional.open, true); assert.equal(s.document.activeElement, 'optional-summary');
});

test('empty results/filter refresh retain input focus and tool state; locale/full rerenders have no duplicate entries', () => {
  const s = careerScope(); s.mount(); s.document.activeElement = 'filter-query';
  const renders = s.renders;
  s.observations[0].callback([{ target: { closest: () => null } }]); s.queues.shift()();
  assert.equal(s.renders, renders); assert.equal(s.document.activeElement, 'filter-query');
  s.setSnapshot({ lang: 'zh', jobs: [] }); s.api.refresh(); assert.equal(s.root.lang, 'zh'); assert.equal(s.root.optional.open, false);
  assert.equal(s.discovery.textContent, '求职工具（可选）'); assert.equal(s.document.activeElement, 'filter-query');
  s.replaceShell(); s.api.refresh(); assert.equal(s.order.filter(node => node.tag === 'a').length, 1); assert.equal(s.order.indexOf(s.root), s.order.indexOf(s.pages) + 1);
});

test('existing voice answers still validate; uncertainty is never mapped to flexible or shuttle yes', () => {
  const window = {}, document = { readyState: 'loading', addEventListener() {} };
  vm.runInNewContext(assistantSource, { window, document, URLSearchParams });
  const s = workerScope(); s.mount();
  assert.equal(window.MDAssistant.normalizeAnswer('shift', 'Ca ngày', s.form, 'vi'), 'Ca ngày');
  assert.equal(window.MDAssistant.normalizeAnswer('shuttle', 'Có', s.form, 'vi'), 'Có');
  assert.equal(window.MDAssistant.normalizeAnswer('shift', 'Chưa rõ', s.form, 'vi'), null);
  assert.equal(window.MDAssistant.normalizeAnswer('shuttle', 'Chưa rõ', s.form, 'vi'), null);
  assert.equal(window.MDAssistant.normalizeAnswer('area', 'Chưa rõ', s.form, 'vi'), 'Chưa rõ');
});

test('module has no new contact persistence, submission, consent changes, or network side effects', () => {
  assert.doesNotMatch(workerSource, /localStorage|\.setItem\s*\(|fetch\s*\(|XMLHttpRequest|sendBeacon|requestSubmit|\.submit\s*\(/);
  assert.doesNotMatch(workerSource, /namedItem\(['"](?:name|phone|consent|cv)['"]\)|name\s*=\s*['"](?:consent|phone|cv)['"]/);
  assert.match(workerSource, /sessionStorage\?\.getItem\('md_preferences_'/);
});
