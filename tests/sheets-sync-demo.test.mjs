import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { applyAction, createBrowserSession, createModel, createSession } from '../public/sheets-sync-demo.js';

const application = 'APP-DEMO-01';
const business = 'B2B-DEMO-01';
const action = (type, revision = 1, id = application) => ({ type, id, revision });

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('a simulated failure retains the queue item and a retry writes it once', () => {
  const session = createSession(memoryStorage());
  assert.equal(session.mutate(action('enqueue')).code, 'queued');
  assert.equal(session.mutate(action('enqueue')).code, 'pending');
  assert.equal(session.mutate(action('retry')).code, 'missing');
  const failed = session.mutate(action('fail'));
  assert.equal(failed.code, 'failed');
  assert.deepEqual(failed.state.rows, []);
  assert.deepEqual(failed.state.queue, [{ id: application, revision: 1, status: 'failed' }]);
  assert.equal(session.mutate(action('write')).code, 'missing');

  const retried = session.mutate(action('retry'));
  assert.equal(retried.code, 'retryInserted');
  assert.deepEqual(retried.state.rows, [{ id: application, revision: 1 }]);
  assert.deepEqual(retried.state.queue, []);
  assert.deepEqual(retried.state.history.map(item => item.code), ['retryInserted', 'failed', 'queued']);
  assert.deepEqual(session.mutate(action('retry')), { state: retried.state, code: 'missing' });
  assert.deepEqual(session.mutate(action('enqueue')), { state: retried.state, code: 'unchanged' });
});

test('sessions re-read before writing, preserve distinct records and update by stable ID', () => {
  const storage = memoryStorage();
  const first = createSession(storage);
  const second = createSession(storage);
  second.read();
  first.mutate(action('enqueue'));
  first.mutate(action('write'));
  second.mutate(action('enqueue', 1, business));
  second.mutate(action('write', 1, business));
  first.mutate(action('enqueue', 2));
  assert.equal(second.mutate(action('write')).code, 'missing');
  first.mutate(action('fail', 2));
  assert.equal(second.mutate(action('retry', 2)).code, 'retryUpdated');
  assert.deepEqual(first.read().state.rows, [{ id: application, revision: 2 }, { id: business, revision: 1 }]);
  assert.equal(first.mutate(action('enqueue')).code, 'unchanged');
});

test('storage corruption is sanitized before it can supply records or statuses', () => {
  const store = JSON.stringify({
    version: 1,
    rows: [null, { id: application, revision: 1, arbitrary: '<script>' }, { id: application, revision: 2 }, { id: 'constructor', revision: 1 }],
    queue: [
      { id: application, revision: 1, status: 'queued' }, { id: business, revision: 1, status: 'failed', extras: ['external'] },
      { id: 'B2B-DEMO-02', revision: '2', status: 'queued' }, { id: 'APP-DEMO-02', revision: 1, status: 'inserted' }
    ],
    history: [{ id: business, revision: 1, code: 'failed' }, { id: business, revision: 1, code: '__proto__' }, { id: 'external', revision: 2, code: 'queued' }]
  });
  const expected = {
    version: 1,
    rows: [{ id: application, revision: 1 }],
    queue: [{ id: business, revision: 1, status: 'failed' }],
    history: [{ id: business, revision: 1, code: 'failed' }]
  };
  assert.deepEqual(createModel(store), expected);
  for (const raw of ['', '{ broken', 'null', '{"version":2}', 'x'.repeat(16001)]) {
    assert.deepEqual(createModel(raw), createModel());
  }
  const session = createSession({ getItem: () => store, setItem: (_, value) => assert.equal(JSON.parse(value).rows.length, 2) });
  assert.equal(session.mutate(action('retry', 1, business)).code, 'retryInserted');
});

test('only known actions and fixture revisions can mutate the bounded model', () => {
  const empty = createModel();
  for (const invalid of [action('enqueue', '1'), action('enqueue', 3), action('enqueue', 1, 'toString'), action('launch'), { type: 'reset' }]) {
    assert.deepEqual(applyAction(empty, invalid), { state: empty, code: 'invalid' });
  }
  const session = createSession(memoryStorage());
  const ids = [application, 'APP-DEMO-02', business, 'B2B-DEMO-02'];
  for (const id of ids) session.mutate(action('enqueue', 1, id));
  assert.equal(session.read().state.queue.length, ids.length);
  for (const revision of [1, 2]) {
    for (const id of ids) {
      if (revision === 2) session.mutate(action('enqueue', revision, id));
      session.mutate(action('fail', revision, id));
      session.mutate(action('retry', revision, id));
    }
  }
  const { rows, history } = session.read().state;
  assert.deepEqual(rows, ids.map(id => ({ id, revision: 2 })));
  assert.equal(history.length, 16);
});

test('reset requires consent and clears only the simulated dataset', () => {
  const storage = memoryStorage();
  storage.setItem('other-cms-key', 'untouched');
  const session = createSession(storage);
  session.mutate(action('enqueue'));
  assert.equal(session.mutate({ type: 'reset', confirmed: 'yes' }).code, 'invalid');
  assert.equal(session.read().state.queue.length, 1);
  assert.deepEqual(session.mutate({ type: 'reset', confirmed: true }), { state: createModel(), code: 'reset' });
  assert.deepEqual(session.read().state, createModel());
  assert.equal(storage.getItem('other-cms-key'), 'untouched');
});

test('browser storage failures preserve the last state and report an unavailable write', () => {
  const storage = memoryStorage();
  const writable = createSession(storage);
  writable.mutate(action('enqueue'));
  const blocked = createSession({ ...storage, setItem() { throw new Error('Denied'); } });
  assert.deepEqual(blocked.mutate(action('write')), { state: writable.read().state, code: 'unavailable' });
  const unreadable = createSession({ getItem() { throw new Error('Denied'); } });
  assert.deepEqual(unreadable.mutate(action('write')), { state: createModel(), code: 'unavailable' });
});

test('concurrent browser tabs re-read and commit under the same exclusive lock', async () => {
  const requests = [];
  let held = false;
  const locks = {
    request(name, options, callback) {
      return new Promise(resolve => {
        requests.push({ name, options, grant() {
          held = true;
          try {
            resolve(callback());
          } finally {
            held = false;
          }
        } });
      });
    }
  };
  const storage = memoryStorage();
  let observeMutations = false;
  const browser = {
    navigator: { locks },
    localStorage: {
      getItem(key) {
        if (observeMutations) assert.equal(held, true, 'the mutating read must hold the lock');
        return storage.getItem(key);
      },
      setItem(key, value) {
        assert.equal(held, true, 'the write must hold the lock');
        storage.setItem(key, value);
      }
    }
  };
  const first = createBrowserSession(browser);
  const second = createBrowserSession(browser);
  assert.equal(first.read().scope, 'shared');
  observeMutations = true;
  const left = first.mutate(action('enqueue'));
  const right = second.mutate(action('enqueue', 1, business));
  await Promise.resolve();
  assert.equal(requests.length, 2);
  assert.equal(requests[0].name, requests[1].name);
  assert.deepEqual(requests.map(({ options }) => options.mode), ['exclusive', 'exclusive']);
  assert.deepEqual(createSession(storage).read().state.queue, []);
  requests[1].grant();
  requests[0].grant();
  assert.deepEqual((await Promise.all([left, right])).map(({ code }) => code), ['queued', 'queued']);
  observeMutations = false;
  assert.deepEqual(first.read().state.queue.map(({ id }) => id), [business, application]);
  assert.deepEqual(second.read().state, first.read().state);
});

test('without Web Locks, each tab keeps an isolated queue across its own reloads', async () => {
  const tabStorage = memoryStorage();
  const localStorage = memoryStorage();
  const browser = { localStorage, sessionStorage: tabStorage };
  const first = createBrowserSession(browser);
  const second = createBrowserSession({ localStorage, sessionStorage: memoryStorage() });
  assert.equal(first.read().scope, 'tab');
  await Promise.all([first.mutate(action('enqueue')), second.mutate(action('enqueue', 1, business))]);
  assert.deepEqual(createBrowserSession(browser).read().state.queue.map(({ id }) => id), [application]);
  assert.deepEqual(second.read().state.queue.map(({ id }) => id), [business]);
  assert.deepEqual(createSession(localStorage).read().state, createModel());
});

test('a denied lock or write falls back to an isolated storage scope', async () => {
  const localStorage = memoryStorage();
  const sessionStorage = memoryStorage();
  const browser = {
    localStorage,
    sessionStorage,
    navigator: { locks: { request: () => Promise.reject(new Error('Denied')) } }
  };
  const deniedLock = createBrowserSession(browser);
  assert.equal((await deniedLock.mutate(action('enqueue'))).code, 'queued');
  assert.equal(deniedLock.read().scope, 'tab');
  assert.deepEqual(createSession(localStorage).read().state, createModel());

  const blocked = createBrowserSession({ sessionStorage: { ...sessionStorage, setItem() { throw new Error('Denied'); } } });
  assert.equal((await blocked.mutate(action('write'))).code, 'inserted');
  assert.equal(blocked.read().scope, 'memory');
  assert.deepEqual(blocked.read().state.rows, [{ id: application, revision: 1 }]);
  assert.equal(createSession(sessionStorage).read().state.queue.length, 1);
  assert.equal(createBrowserSession({}).read().scope, 'memory');
});

test('queue refresh preserves keyboard context and completed writes respect changed focus', async () => {
  const localStorage = memoryStorage();
  const remote = createSession(localStorage);
  const elements = new Map();
  const windowEvents = new Map();
  let grant;
  const document = {
    activeElement: null,
    createElement: tag => new Element(tag),
    getElementById: id => elements.get(id) ?? elements.set(id, new Element()).get(id)
  };
  class Element {
    children = [];
    dataset = {};
    events = new Map();
    constructor(tag) { this.tag = tag; }
    get firstElementChild() { return this.children[0]; }
    append(...children) { this.children.push(...children); }
    contains(element) { return this === element || this.children.some(child => child.contains(element)); }
    replaceChildren(...children) {
      if (this.contains(document.activeElement)) document.activeElement = null;
      this.children = children;
      if (children[0]?.tag === 'option') this.value = children[0].value;
    }
    querySelectorAll() {
      return this.children.flatMap(child => [child, ...child.querySelectorAll()]).filter(child => child.dataset.syncQueueAction);
    }
    addEventListener(type, callback) { this.events.set(type, callback); }
    setAttribute() {}
    focus() { document.activeElement = this; }
  }
  const window = {
    localStorage,
    addEventListener: (type, callback) => windowEvents.set(type, callback),
    navigator: { locks: { request: (_name, _options, callback) => new Promise(resolve => { grant = () => resolve(callback()); }) } }
  };
  const get = id => document.getElementById(`sync-${id}`);
  const writeButton = id => get('queue').querySelectorAll().find(button => button.dataset.syncQueueAction === `${id}:1:write`);
  get('revision').value = '1';
  remote.mutate(action('enqueue'));
  const source = readFileSync(new URL('../public/sheets-sync-demo.js', import.meta.url), 'utf8');
  vm.runInNewContext(source.replace(/^export /gm, ''), { document, window });

  const oldButton = writeButton(application);
  oldButton.focus();
  remote.mutate(action('enqueue', 1, business));
  windowEvents.get('storage')({ key: null });
  const refreshedButton = writeButton(application);
  assert.notEqual(refreshedButton, oldButton);
  assert.equal(document.activeElement, refreshedButton);

  const pendingWrite = refreshedButton.events.get('click')();
  await Promise.resolve();
  get('sheet').focus();
  grant();
  await pendingWrite;
  assert.equal(document.activeElement, get('sheet'));
  assert.match(get('feedback').textContent, /Đã thêm dòng mới/);

  const lastButton = writeButton(business);
  lastButton.focus();
  const lastWrite = lastButton.events.get('click')();
  await Promise.resolve();
  grant();
  await lastWrite;
  assert.equal(document.activeElement, get('queue-title'));
});
