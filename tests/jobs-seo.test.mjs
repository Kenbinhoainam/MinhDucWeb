import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const origin = 'https://minh-duc-prototype.kenbinhoainam.chatgpt.site';
const localeSource = readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8');
const seoSource = readFileSync(new URL('../public/seo-preview.js', import.meta.url), 'utf8');
const locales = { vi: 'vi', en: 'en', 'zh-CN': 'zh', ko: 'ko', 'x-default': null };

function fixture(path, { page = 'jobs', lang = 'vi', canonical } = {}) {
  const location = new URL(path, 'https://preview.example');
  const tags = new Map();
  for (const selector of ['link[rel=canonical]', 'meta[name=description]', 'meta[name=robots]',
    ...['title', 'description', 'url', 'locale'].map(key => `meta[property="og:${key}"]`)]) {
    tags.set(selector, { setAttribute(name, value) { this[name] = value; } });
  }
  tags.get('meta[name=robots]').content = 'noindex, nofollow';
  if (canonical) tags.get('link[rel=canonical]').href = canonical;
  const alternates = Object.keys(locales).map(hreflang => ({ hreflang }));
  const summary = { textContent: 'Worker jobs summary' };
  const document = Object.assign(new EventTarget(), {
    body: { dataset: { page } },
    documentElement: { lang },
    title: 'Worker jobs',
    querySelector: selector => selector.includes('.v14-page-intro p') ? summary : tags.get(selector),
    querySelectorAll: selector => selector === 'link[rel=alternate][hreflang]' ? alternates : [],
  });
  const window = new EventTarget();
  const context = vm.createContext({ document, window, location, URL, URLSearchParams, queueMicrotask });
  vm.runInContext(localeSource, context);
  vm.runInContext(seoSource, context);
  return { location, document, window, summary, tags, alternates };
}

function assertUrls({ tags, alternates }, path, lang) {
  const url = new URL(path, origin);
  url.searchParams.set('lang', lang);
  assert.equal(tags.get('link[rel=canonical]').href, url.href);
  assert.equal(tags.get('meta[property="og:url"]').content, url.href);
  for (const { hreflang, href } of alternates) {
    const target = new URL(path, origin);
    if (locales[hreflang]) target.searchParams.set('lang', locales[hreflang]);
    assert.equal(href, target.href, hreflang);
  }
}

test('jobs metadata keeps only the internal tab and locale on the fixed origin', () => {
  const state = fixture('/viec-lam.html?tab=internal&q=QC&area=HN&park=YP&salary=12&saved=1&sort=high&page=3&preview=1#results', { lang: 'zh-CN' });
  assertUrls(state, '/viec-lam.html?tab=internal', 'zh');
  assert.equal(state.tags.get('meta[property="og:locale"]').content, 'zh_CN');
  assert.equal(state.tags.get('meta[name=robots]').content, 'noindex, nofollow');
  for (const tab of ['worker', 'unknown']) {
    assertUrls(fixture(`/viec-lam.html?tab=${tab}&q=QC`), '/viec-lam.html', 'vi');
  }
});

test('the legacy path resolves to internal jobs with the shared jobs page marker', () => {
  assertUrls(fixture('/tuyen-dung-noi-bo.html?tab=worker&sort=urgent'), '/viec-lam.html?tab=internal', 'vi');
});

test('metadata follows rendered tab, history and language changes', async () => {
  const state = fixture('/viec-lam.html');
  const { document, window, location, summary, tags } = state;
  location.search = '?tab=internal&q=QC';
  document.title = 'Internal jobs';
  summary.textContent = 'Internal jobs summary';
  window.dispatchEvent(new Event('md:jobs-view-change'));
  assertUrls(state, '/viec-lam.html?tab=internal', 'vi');
  assert.equal(tags.get('meta[property="og:title"]').content, 'Internal jobs');
  assert.equal(tags.get('meta[property="og:description"]').content, 'Internal jobs summary');
  assert.equal(tags.get('meta[name=description]').content, 'Internal jobs summary');

  window.addEventListener('popstate', () => {
    document.title = 'Worker jobs in English';
    document.documentElement.lang = 'en';
  });
  location.search = '?lang=en&sort=urgent';
  window.dispatchEvent(new Event('popstate'));
  await Promise.resolve();
  assertUrls(state, '/viec-lam.html', 'en');
  assert.equal(tags.get('meta[property="og:title"]').content, 'Worker jobs in English');

  document.addEventListener('change', () => { document.documentElement.lang = 'ko'; });
  const change = new Event('change');
  Object.defineProperty(change, 'target', { value: { id: 'languageSelect' } });
  document.dispatchEvent(change);
  await Promise.resolve();
  assertUrls(state, '/viec-lam.html', 'ko');
  assert.equal(tags.get('meta[property="og:locale"]').content, 'ko_KR');
});

test('job detail URLs retain the ID and discard list state', () => {
  const state = fixture('/chi-tiet-viec-lam.html?id=job%2F42&tab=internal&from=viec-lam.html', { page: 'detail', lang: 'en' });
  assertUrls(state, '/chi-tiet-viec-lam.html?id=job%2F42', 'en');
});

test('Pages metadata retains its deployment subpath exactly once', () => {
  const site = 'https://kenbinhoainam.github.io/MinhDucWeb/';
  const state = fixture('/MinhDucWeb/viec-lam.html?tab=internal&q=QC', {
    lang: 'en', canonical: site + 'viec-lam.html',
  });
  assert.equal(state.tags.get('link[rel=canonical]').href, site + 'viec-lam.html?tab=internal&lang=en');
  assert.equal(state.tags.get('meta[property="og:url"]').content, site + 'viec-lam.html?tab=internal&lang=en');
  assert.ok(state.alternates.every(({ href }) => href.startsWith(site + 'viec-lam.html?tab=internal')));
  const detail = fixture('/MinhDucWeb/chi-tiet-viec-lam.html?id=test', {
    page: 'detail', canonical: site + 'chi-tiet-viec-lam.html',
  });
  assert.equal(detail.tags.get('link[rel=canonical]').href, site + 'chi-tiet-viec-lam.html?id=test&lang=vi');
});
