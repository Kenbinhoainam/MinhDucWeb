import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { sources } from './build-runtime.mjs';

const read = file => fs.readFileSync(new URL('../public/' + file, import.meta.url), 'utf8');

function load(code) {
  const listeners = [], timers = [], values = new Map();
  let requests = 0;
  const location = { href: 'https://minh-duc.example/?lang=en', pathname: '/', search: '?lang=en', hash: '' };
  const storage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const history = { replaceState(state, title, href) { const next = new URL(href, location.href); Object.assign(location, { href: next.href, pathname: next.pathname, search: next.search, hash: next.hash }); } };
  const classes = { add() {}, remove() {}, toggle() {}, contains() { return false; } };
  const document = {
    body: { dataset: { page: 'home' }, children: [], classList: classes },
    documentElement: { lang: 'en', style: { setProperty() {} }, classList: classes },
    querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
    addEventListener(type, callback, capture) { listeners.push({ type, callback, capture }); },
    createElement: () => ({ setAttribute() {}, focus() { this.focused = true; } }),
  };
  const window = { location, history, sessionStorage: storage, localStorage: storage, addEventListener() {}, scrollTo() {} };
  const scope = vm.createContext({
    window, document, location, history, sessionStorage: storage, localStorage: storage,
    URL, URLSearchParams, structuredClone, Intl, Date, console,
    MutationObserver: class { observe() {} disconnect() {} },
    setTimeout: callback => timers.push(callback), clearTimeout() {}, queueMicrotask,
    fetch() { requests++; throw new Error('A prototype form must not send a request.'); },
    FormData: class { constructor() { throw new Error('A prototype form must not read contact or CV data.'); } },
  });
  vm.runInContext(code, scope);
  return { window, listeners, timers, values, get requests() { return requests; } };
}

const source = sources.map(read).join('\n;\n');
const bundle = read('site-runtime.js');
const digest = createHash('sha256').update(source).digest('hex');
assert.ok(bundle.includes(`Source SHA256: ${digest}.`), 'Runtime sources changed; run node scripts/build-runtime.mjs first.');
const original = load(source);
const bundled = load(bundle);
const globals = ['MDBrandRights', 'MDTranslate', 'MD13', 'MD14', 'MD15', 'MDLocale', 'MDEditorial', 'MDFlagship', 'MDExperience'];
for (const name of globals) {
  assert.ok(bundled.window[name], `${name} must remain public`);
  assert.deepEqual(Object.keys(bundled.window[name]).sort(), Object.keys(original.window[name]).sort(), `${name} API changed`);
}
for (const locale of ['vi', 'en', 'zh', 'ko']) {
  assert.equal(bundled.window.MDLocale.resolve('/?lang=' + locale, 'en'), locale);
  assert.equal(bundled.window.MD13.text(locale, 'reduceMotion'), original.window.MD13.text(locale, 'reduceMotion'));
  assert.equal(bundled.window.MD14.text(locale, 'compare'), original.window.MD14.text(locale, 'compare'));
}

async function checkFormGuard(runtime, formId) {
  const data = { home: {}, jobs: [], posts: [], partners: [] };
  runtime.window.MD15.boot({ page: 'home', getData: () => data, setData() {}, render() {}, notify() {}, validateForm: () => true });
  const submit = runtime.listeners.filter(listener => listener.type === 'submit').at(-1).callback;
  let replacements = 0, result;
  const button = {};
  const form = {
    id: formId, dataset: {}, querySelector: () => button,
    replaceWith(node) { replacements++; result = node; },
    get elements() { throw new Error('Contact fields must not be read.'); },
  };
  const event = { target: form, preventDefault() {}, stopImmediatePropagation() {} };
  const first = submit(event);
  await submit(event);
  assert.equal(button.disabled, true);
  assert.equal(runtime.timers.length, 1);
  runtime.timers.shift()();
  await first;
  assert.equal(replacements, 1);
  assert.equal(result.focused, true);
  assert.equal(runtime.requests, 0);
  assert.match(result.innerHTML, /not sent or stored/);
  assert.equal([...runtime.values.keys()].some(key => /contact|cv|application/i.test(key)), false);
}

for (const runtime of [original, bundled]) {
  await checkFormGuard(runtime, 'applyForm');
  await checkFormGuard(runtime, 'contactForm');
}
assert.equal(read('site-runtime.js').includes('sourceMappingURL'), false);
console.log('Runtime verified: original/bundle startup, 9 public APIs, 4 locales, application/contact no-send guards and repeat-submit protection; no sourcemap.');
