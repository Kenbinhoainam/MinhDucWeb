import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/business-portal-demo.js', import.meta.url), 'utf8');
const browser = {};
runInNewContext(source, { window: browser });
const { createStore, normalizeDemand, storageKey } = browser.MDBusinessPortal;

const today = '2026-11-06';
const demand = {
  sector: 'manufacturing', location: 'north', shift: 'day', count: '30',
  startWindow: { from: '2026-12-01', to: '2026-12-12' }
};
const first = 'MD-0000000000000001';
const second = 'MD-0000000000000002';
const plain = value => JSON.parse(JSON.stringify(value));

function memoryStorage(raw = null) {
  return {
    raw,
    getItem(key) { assert.equal(key, storageKey); return this.raw; },
    setItem(key, value) { assert.equal(key, storageKey); this.raw = value; }
  };
}

test('isolates company lists and resets, including changes written by another tab', () => {
  const storage = memoryStorage();
  const portal = createStore(() => storage);
  const otherTab = createStore(() => storage);
  assert.equal(portal.submit('lotus', first, demand, today).persisted, true);
  assert.equal(otherTab.submit('bamboo', second, demand, today).persisted, true);
  assert.deepEqual(plain(portal.list('lotus').requests.map(row => row.id)), [first]);
  assert.deepEqual(plain(portal.list('bamboo').requests.map(row => row.id)), [second]);
  assert.equal(portal.list('unknown').requests.length, 0);
  assert.equal(portal.reset('unknown'), false);
  assert.equal(portal.reset('lotus'), true);
  assert.equal(otherTab.list('lotus').requests.length, 0);
  assert.deepEqual(plain(otherTab.list('bamboo').requests.map(row => row.id)), [second]);
});

test('keeps one stable record when a reviewed submission is repeated', () => {
  const storage = memoryStorage();
  const portal = createStore(() => storage);
  const original = portal.submit('lotus', first, demand, today);
  const retry = createStore(() => storage).submit('lotus', first, { ...demand, count: '50' }, today);
  assert.deepEqual(retry, original);
  assert.equal(portal.list('lotus').requests.length, 1);
  assert.equal(portal.submit('bamboo', first, demand, today).error, 'invalid');
  assert.equal(portal.list('bamboo').requests.length, 0);
});

test('validates structured fields, integer boundaries, calendar dates and date window', () => {
  for (const invalid of [
    { sector: 'private' }, { location: 'outside' }, { shift: 'unknown' },
    { count: '501' }, { count: '0' }, { count: '1e2' }, { count: '20.5' }, { count: true },
    { startWindow: { from: '2026-02-29', to: '2026-03-01' } },
    { startWindow: { from: '2026-12-31', to: '2026-12-01' } },
    { startWindow: { from: '2026-11-06', to: '2027-02-05' } },
    { startWindow: { from: '2026-11-05', to: '2026-11-06' } },
    { startWindow: { from: '2027-11-06', to: '2027-11-07' } }
  ]) assert.equal(normalizeDemand({ ...demand, ...invalid }, today), null);
  assert.equal(normalizeDemand({ ...demand, count: '500' }, today).count, 500);
  assert.ok(normalizeDemand({ ...demand, startWindow: { from: '2026-11-06', to: '2027-02-04' } }, today));
  assert.ok(normalizeDemand({ ...demand, startWindow: { from: '2028-02-29', to: '2028-02-29' } }, '2028-02-01'));
  const portal = createStore(() => memoryStorage());
  assert.equal(portal.submit('constructor', first, demand, today).error, 'invalid');
  assert.equal(portal.submit('lotus', '<script>', demand, today).error, 'invalid');
});

test('recovers malformed storage and removes unallowlisted properties before writing', () => {
  for (const invalid of ['{', '{"version":2,"requests":[]}', '{"version":1,"requests":{}}']) {
    const storage = memoryStorage(invalid);
    const portal = createStore(() => storage);
    assert.equal(portal.list('lotus').issue, 'corrupt');
    assert.equal(portal.submit('lotus', first, demand, today).persisted, true);
    assert.equal(portal.list('lotus').issue, null);
  }
  const valid = { ...demand, id: first, org: 'lotus', createdOn: today, internalNote: 'not for the portal' };
  const storage = memoryStorage(JSON.stringify({ version: 1, requests: [valid, valid, { ...valid, id: second, org: 'unlisted' }] }));
  const portal = createStore(() => storage);
  assert.equal(portal.list('lotus').issue, 'corrupt');
  assert.deepEqual(plain(portal.list('lotus').requests), [
    { id: first, org: 'lotus', ...demand, count: 30, createdOn: today }
  ]);
  assert.equal(portal.submit('bamboo', second, { ...demand, email: 'discard' }, today).persisted, true);
  assert.equal(JSON.parse(storage.raw).requests.length, 2);
  assert.ok(!storage.raw.includes('internalNote') && !storage.raw.includes('email') && !storage.raw.includes('unlisted'));
});

test('keeps a blocked submission and reset in this tab and merges fresh storage after recovery', () => {
  const storage = memoryStorage();
  const otherTab = createStore(() => storage);
  let blocked = true;
  const portal = createStore(() => {
    if (blocked) throw new Error('blocked');
    return storage;
  });
  assert.equal(portal.submit('lotus', first, demand, today).persisted, false);
  assert.equal(portal.submit('lotus', first, demand, today).persisted, false);
  assert.equal(portal.list('lotus').requests.length, 1);
  assert.equal(portal.list('lotus').issue, 'unavailable');
  assert.equal(otherTab.submit('bamboo', second, demand, today).persisted, true);
  blocked = false;
  assert.equal(portal.submit('lotus', first, demand, today).persisted, true);
  assert.equal(otherTab.list('lotus').requests.length, 1);
  assert.equal(otherTab.list('bamboo').requests.length, 1);
  blocked = true;
  assert.equal(portal.reset('lotus'), false);
  assert.equal(portal.list('lotus').requests.length, 0);
  assert.equal(portal.list('bamboo').requests.length, 1);
  assert.equal(otherTab.list('lotus').requests.length, 1);
});

test('retries a blocked reset without clearing requests another tab created after it', () => {
  const storage = memoryStorage();
  const otherTab = createStore(() => storage);
  let blockWrite = false;
  const portal = createStore(() => ({
    getItem: key => storage.getItem(key),
    setItem(key, value) {
      if (blockWrite) throw new Error('blocked');
      storage.setItem(key, value);
    }
  }));
  assert.equal(portal.submit('lotus', first, demand, today).persisted, true);
  blockWrite = true;
  assert.equal(portal.reset('lotus'), false);
  assert.deepEqual(plain(portal.list('lotus').requests), []);
  assert.equal(otherTab.submit('lotus', second, demand, today).persisted, true);
  assert.deepEqual(plain(portal.list('lotus').requests.map(row => row.id)), [second]);
  blockWrite = false;
  const third = 'MD-0000000000000003';
  assert.equal(portal.submit('bamboo', third, demand, today).persisted, true);
  assert.deepEqual(plain(otherTab.list('lotus').requests.map(row => row.id)), [second]);
  assert.deepEqual(plain(otherTab.list('bamboo').requests.map(row => row.id)), [third]);
});

test('caps requests per company and handles storage write errors', () => {
  const storage = memoryStorage();
  const portal = createStore(() => storage);
  for (let index = 0; index < 25; index++) {
    const id = `MD-${index.toString(16).toUpperCase().padStart(16, '0')}`;
    assert.equal(portal.submit('lotus', id, demand, today).persisted, true);
  }
  assert.equal(portal.submit('lotus', 'MD-1000000000000000', demand, today).error, 'full');
  storage.setItem = () => { throw new Error('quota'); };
  assert.equal(portal.submit('bamboo', 'MD-2000000000000000', demand, today).persisted, false);
  assert.equal(portal.list('bamboo').requests.length, 1);
  assert.equal(portal.list('lotus').requests.length, 25);
});
