import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/candidate-portal-demo.js', import.meta.url), 'utf8');
const key = 'md_candidate_portal_demo_v1';
const plain = value => JSON.parse(JSON.stringify(value));
const jobs = [
  { id: 'assembly', title: 'Assembly <sample>', open: true },
  { id: 'warehouse', title: 'Warehouse', open: true },
  { id: 'old-job', title: 'Closed job', open: false },
];
const defaults = { version: 1, preferences: { shift: 'any', transport: 'any' }, applicationJobIds: [] };

function memory(initial) {
  let value = initial;
  const writes = [];
  return {
    getItem(name) { assert.equal(name, key); return value; },
    setItem(name, next) { assert.equal(name, key); writes.push(next); value = next; },
    replace(next) { value = next; },
    get value() { return value; },
    writes,
  };
}

function scope({ page = 'jobs', hash = '', localStorage = memory() } = {}) {
  let root, now = 10_000, timerId = 0;
  let snapshot = { lang: 'en', jobs };
  const app = {};
  const handlers = {}, windowEvents = {}, observers = [], queues = [], timers = new Map(), bridgeWrites = [];
  const saved = new Set(['assembly']);
  const location = { hash, pathname: '/viec-lam.html', origin: 'https://example.test' };
  const createMain = () => ({
    append(node) { root = node; node.parentElement = this; node.isConnected = true; },
  });
  let main = createMain();
  const body = { dataset: { page } };
  const document = {
    readyState: 'loading', body, documentElement: { lang: 'en' }, activeElement: body,
    getElementById(id) { return { app, main }[id] ?? null; },
    addEventListener(name, handler) { handlers[name] = handler; },
    createElement(tag) {
      assert.equal(tag, 'details');
      const listeners = {}, parts = new Map();
      return {
        listeners, contains() { return false; },
        addEventListener(name, handler) { listeners[name] = handler; },
        remove() { this.isConnected = false; },
        scrollIntoView() {},
        querySelector(selector) {
          if (selector === '#md-cp-code-input') return null;
          if (!parts.has(selector)) parts.set(selector, { innerHTML: '', textContent: '' });
          return parts.get(selector);
        },
      };
    },
  };
  const window = {
    localStorage,
    MDPrototypeBridge: {
      snapshot: () => snapshot,
      getSavedJobIds: () => [...saved],
      setJobSaved(id, next) {
        bridgeWrites.push([id, next]);
        if (next) saved.add(id); else saved.delete(id);
        windowEvents['md:saved-jobs-change']();
        return true;
      },
    },
    addEventListener(name, handler) { windowEvents[name] = handler; },
    setTimeout(callback) { timers.set(++timerId, callback); return timerId; },
  };
  class MutationObserver {
    constructor(callback) { this.callback = callback; }
    observe(target, options) { observers.push({ target, options, callback: this.callback }); }
  }
  const context = vm.createContext({
    document, window, location, MutationObserver, Date: { now: () => now },
    clearTimeout: id => timers.delete(id), queueMicrotask: callback => queues.push(callback),
  });
  vm.runInContext(source, context);
  return {
    api: window.MDCandidatePortalDemo,
    handlers, windowEvents, saved, bridgeWrites, localStorage,
    get root() { return root; },
    get html() { return root.querySelector('.md-cp-content').innerHTML; },
    get status() { return root.querySelector('#md-cp-status').textContent; },
    mount() { handlers.DOMContentLoaded(); this.flush(); },
    flush() { while (queues.length) queues.shift()(); },
    replaceMain(lang) {
      snapshot = { ...snapshot, lang };
      root.isConnected = false;
      main = createMain();
      observers.find(observer => observer.target === app).callback([{ target: app }]);
      this.flush();
    },
    click(action, id) {
      root.listeners.click({ target: { closest: () => ({ dataset: { cpAction: action, cpJob: id } }) } });
      this.flush();
    },
    submit(form, fields) {
      root.listeners.submit({
        preventDefault() {},
        target: { id: 'md-cp-' + form + '-form', elements: Object.fromEntries(Object.entries(fields).map(([id, value]) => [id, { value }])) },
      });
      this.flush();
    },
    expire() {
      now += 120_000;
      const callbacks = [...timers.values()];
      timers.clear();
      callbacks.forEach(callback => callback());
    },
  };
}

test('OTP is six digits, distinguishes incorrect and expired codes, and replaces the previous code', () => {
  const { issueOtp, verifyOtp } = scope().api;
  const initial = issueOtp(null, 50, () => 0.0000125);
  assert.deepEqual(plain(initial), { code: '000012', expiresAt: 120_050 });
  assert.equal(verifyOtp(initial, '000011', 120_049), 'wrong');
  assert.equal(verifyOtp(initial, '000012', 120_049), 'verified');
  assert.equal(verifyOtp(initial, '000012', 120_050), 'expired');
  assert.equal(verifyOtp(null, '000012', 50), 'expired');
  const renewed = issueOtp(initial, 51, () => 0.0000125);
  assert.equal(renewed.code, '000013');
  assert.equal(verifyOtp(renewed, initial.code, 52), 'wrong');
});

test('corrupt and unknown-version data recover to defaults and only approved values survive sanitization', () => {
  const { read, savePreferences } = scope().api;
  for (const invalid of ['{bad', 'null', '42', '{"version":2,"applicationJobIds":["assembly"]}']) {
    assert.deepEqual(plain(read(memory(invalid), jobs)), defaults);
  }
  const storage = memory(JSON.stringify({
    version: 1,
    preferences: { shift: 'rotating', transport: '<free text>', notes: 'private' },
    applicationJobIds: ['assembly', 'old-job', 'assembly', 'missing', {}, '__proto__'],
    name: 'private', code: '123456', saved: ['warehouse'],
  }));
  assert.deepEqual(plain(read(storage, jobs)), {
    version: 1, preferences: { shift: 'rotating', transport: 'any' }, applicationJobIds: ['assembly', 'old-job'],
  });
  assert.equal(savePreferences(storage, jobs, { shift: 'wrong', transport: 'shuttle', phone: 'private' }), 'profileSaved');
  assert.deepEqual(JSON.parse(storage.value), {
    version: 1, preferences: { shift: 'any', transport: 'shuttle' }, applicationJobIds: ['assembly', 'old-job'],
  });
});

test('application mutations reread persisted data, keep stable unique IDs, and reject closed or unavailable jobs', () => {
  const { submitApplication, savePreferences } = scope().api;
  const storage = memory();
  assert.equal(submitApplication(storage, jobs, 'assembly'), 'created');
  const first = JSON.parse(storage.value);
  storage.replace(JSON.stringify({ ...first, preferences: { shift: 'day', transport: 'self' } }));
  assert.equal(submitApplication(storage, jobs, 'warehouse'), 'created');
  assert.equal(submitApplication(storage, jobs, 'assembly'), 'duplicate');
  for (const invalid of ['old-job', 'missing', '<injected>']) assert.equal(submitApplication(storage, jobs, invalid), 'unavailable');
  assert.equal(storage.writes.length, 2);
  assert.deepEqual(JSON.parse(storage.value), {
    version: 1, preferences: { shift: 'day', transport: 'self' }, applicationJobIds: ['assembly', 'warehouse'],
  });
  const denied = { getItem: () => storage.value, setItem: () => { throw new Error('denied'); } };
  assert.equal(savePreferences(denied, jobs, { shift: 'night' }), 'storage');
  assert.equal(submitApplication(denied, jobs, 'another'), 'unavailable');
  assert.equal(submitApplication(denied, [...jobs, { id: 'another', open: true }], 'another'), 'storage');
});

test('mounts collapsed on jobs only and renders the expired and resent OTP states in the UI', () => {
  const internal = scope({ page: 'internal' });
  internal.mount();
  assert.equal(internal.root, undefined);
  const demo = scope();
  demo.mount();
  assert.equal(demo.root.id, 'md-candidate-portal');
  assert.equal(demo.root.open, false);
  assert.match(demo.html, /Generate demo code/);
  demo.click('code');
  const oldCode = demo.html.match(/class="md-cp-code">(\d{6})/)[1];
  demo.submit('otp', { code: oldCode === '000000' ? '111111' : '000000' });
  assert.match(demo.status, /incorrect/);
  demo.expire();
  assert.match(demo.status, /expired/);
  assert.doesNotMatch(demo.html, /id="md-cp-code-input"/);
  demo.click('code');
  assert.match(demo.status, /new code is ready/);
  const nextCode = demo.html.match(/class="md-cp-code">(\d{6})/)[1];
  assert.notEqual(nextCode, oldCode);
  demo.submit('otp', { code: nextCode });
  assert.match(demo.status, /Signed in/);
  assert.deepEqual(demo.localStorage.writes, []);
});

test('uses the bridge for saved jobs and preserves authenticated review through a locale rerender', () => {
  const demo = scope({ hash: '#md-candidate-portal' });
  demo.mount();
  assert.equal(demo.root.open, true);
  demo.click('code');
  const code = demo.html.match(/class="md-cp-code">(\d{6})/)[1];
  demo.submit('otp', { code });
  assert.match(demo.html, /Assembly &lt;sample&gt;/);
  assert.match(demo.html, /Sample warehouse associate/);
  assert.match(demo.html, /Fictional data/);
  demo.saved.add('old-job');
  demo.windowEvents['md:saved-jobs-change']();
  demo.flush();
  assert.match(demo.html, /id="md-cp-remove-old-job"/);
  assert.doesNotMatch(demo.html, /id="md-cp-saved-old-job"|href="[^"]*id=old-job/);
  demo.saved.add('warehouse');
  demo.windowEvents['md:saved-jobs-change']();
  demo.flush();
  assert.match(demo.html, /id="md-cp-remove-warehouse"/);
  demo.click('remove', 'warehouse');
  assert.doesNotMatch(demo.html, /id="md-cp-remove-warehouse"/);
  assert.deepEqual(demo.bridgeWrites, [['warehouse', false]]);
  demo.submit('apply', { job: 'assembly' });
  assert.match(demo.html, /Confirm practice application/);
  assert.deepEqual(demo.localStorage.writes, []);
  demo.replaceMain('zh');
  assert.equal(demo.root.open, true);
  assert.equal(demo.root.lang, 'zh');
  assert.match(demo.html, /确认练习申请/);
  demo.click('confirm');
  assert.match(demo.html, /id="md-cp-application-assembly"/);
  demo.click('confirm');
  assert.equal(demo.localStorage.writes.length, 1);
  demo.replaceMain('ko');
  assert.match(demo.html, /지원 완료/);
  demo.replaceMain('vi');
  assert.match(demo.html, /Đã nộp/);
  demo.click('logout');
  assert.match(demo.html, /Tạo mã demo/);
  assert.doesNotMatch(demo.html, /md-cp-application-assembly/);
  assert.deepEqual(JSON.parse(demo.localStorage.value).applicationJobIds, ['assembly']);
});
