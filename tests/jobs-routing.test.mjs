import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {}, URL });
vm.runInContext(readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8'), context);
const { jobsState, jobsHref } = context.window.MDLocale;
const origin = 'https://minh-duc.example';
const defaults = {
  tab: 'worker', q: '', area: '', park: '', salary: '', saved: false,
  sort: 'newest', page: 1, preview: false, hash: ''
};

test('jobs state has stable defaults and only accepts the two jobs tabs', () => {
  for (const input of [undefined, 'http://[', 'viec-lam.html', '?tab=worker', '?tab=other']) {
    assert.deepEqual({ ...jobsState(input) }, defaults);
  }
  assert.equal(jobsState({ search: '?tab=internal' }).tab, 'internal');
  assert.equal(jobsHref('?tab=worker&sort=newest&page=1&saved=0&preview=0'), 'viec-lam.html?lang=vi');
});

test('the legacy internal path takes precedence and canonicalizes to the unified route', () => {
  const legacy = new URL('/old/tuyen-dung-noi-bo.html?tab=worker&lang=ko&saved=1#jobResults', origin);
  assert.deepEqual({ ...jobsState(legacy) }, { ...defaults, tab: 'internal', saved: true, hash: '#jobResults' });
  assert.equal(jobsHref(legacy), 'viec-lam.html?tab=internal&saved=1&lang=ko#jobResults');
});

test('localized listing links round-trip all filters, flags, pagination and the fragment', () => {
  const input = `${origin}/viec-lam.html?tab=internal&q=kỹ+sư+%26+QC&area=Bắc+Ninh&park=Yên+Phong&salary=12&saved=1&sort=high&page=3&preview=1&lang=zh-CN#jobResults`;
  const state = jobsState(input);
  assert.deepEqual({ ...state }, {
    tab: 'internal', q: 'kỹ sư & QC', area: 'Bắc Ninh', park: 'Yên Phong', salary: '12',
    saved: true, sort: 'high', page: 3, preview: true, hash: '#jobResults'
  });
  const href = jobsHref(input);
  assert.equal(new URL(href, origin).searchParams.get('lang'), 'zh');
  assert.equal(jobsHref(state, 'ZH-cn'), href);
  assert.deepEqual(jobsState(href), state);
  assert.equal(jobsHref(Object.freeze({ ...state, tab: 'worker', page: 1 }), 'en'),
    'viec-lam.html?q=k%E1%BB%B9+s%C6%B0+%26+QC&area=B%E1%BA%AFc+Ninh&park=Y%C3%AAn+Phong&salary=12&saved=1&sort=high&preview=1&lang=en#jobResults');
});

test('jobs state validates sort, positive decimal page and enabled flags', () => {
  for (const sort of ['newest', 'high', 'low', 'urgent']) {
    assert.equal(jobsState(`?sort=${sort}`).sort, sort);
  }
  assert.equal(jobsState('?sort=salary').sort, 'newest');
  assert.equal(jobsState('?page=002').page, 2);
  for (const page of ['0', '-2', '2.5', '2e1', '0x10', 'Infinity', '9007199254740993']) {
    assert.equal(jobsState(`?page=${page}`).page, 1, page);
  }
  assert.deepEqual({ ...jobsState('?saved=false&preview=0') }, defaults);
});

test('jobs href validates locale and limits the destination to known jobs state', () => {
  assert.equal(jobsHref('https://other.example/elsewhere?lang=en&next=https://other.example/#details', 'vi'),
    'viec-lam.html?lang=vi#details');
  assert.equal(jobsHref('?lang=ko', 'unknown'), 'viec-lam.html?lang=ko');
  assert.equal(jobsHref('?lang=unknown'), 'viec-lam.html?lang=vi');
  assert.equal(jobsHref({ tab: 'other', sort: 'unknown', page: 2.5 }, 'en'), 'viec-lam.html?lang=en');
});
