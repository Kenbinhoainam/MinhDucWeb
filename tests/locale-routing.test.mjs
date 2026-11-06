import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {}, URL });
vm.runInContext(readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8'), context);
const locale = context.window.MDLocale;
const origin = 'https://minh-duc.example';

test('explicit URL locale overrides session locale, including Vietnamese', () => {
  for (const selected of ['vi', 'en', 'zh', 'ko']) {
    for (const stored of ['vi', 'en', 'zh', 'ko']) {
      assert.equal(locale.resolve(`${origin}/?lang=${selected}`, stored), selected);
    }
  }
  assert.equal(locale.resolve('/?lang=invalid', 'ko'), 'ko');
  assert.equal(locale.resolve('/?lang=', 'invalid'), 'vi');
  assert.equal(locale.resolve('/?lang=zh-CN', 'en'), 'zh');
  assert.equal(locale.resolve({ search: '?lang=vi' }, 'en'), 'vi');
});

test('language changes survive reload and retain detail, filter and hash context', () => {
  const storage = new Map([['md_language', 'en']]);
  const location = { href: `${origin}/chi-tiet-viec-lam.html?id=qc&lang=en&saved=1#ung-tuyen` };
  const state = { scroll: 240 };
  const history = { state, replaceState(value, title, href) { assert.equal(value, state); location.href = href; } };
  const env = { storage: { setItem: (key, value) => storage.set(key, value) }, history, location };
  for (const selected of ['vi', 'zh', 'ko', 'en', 'vi']) {
    locale.persist(selected, env);
    const url = new URL(location.href);
    assert.equal(url.searchParams.get('id'), 'qc');
    assert.equal(url.searchParams.get('saved'), '1');
    assert.equal(url.searchParams.get('lang'), selected);
    assert.equal(url.hash, '#ung-tuyen');
    assert.equal(locale.resolve(location.href, storage.get('md_language')), selected);
  }
});

test('explicit Vietnamese remains stable through listing navigation with an English session', () => {
  const selected = locale.resolve(`${origin}/viec-lam.html?lang=vi`, 'en');
  const href = locale.withLocale('viec-lam.html?region=Bắc+Ninh&sort=salary&page=2#jobResults', selected, origin);
  const destination = new URL(href, origin);
  assert.equal(locale.resolve(destination, 'en'), 'vi');
  assert.equal(destination.searchParams.get('region'), 'Bắc Ninh');
  assert.equal(destination.searchParams.get('sort'), 'salary');
  assert.equal(destination.searchParams.get('page'), '2');
  assert.equal(destination.hash, '#jobResults');
});

test('internal links keep their original path form and one canonical locale parameter', () => {
  const cases = [
    ['index.html', 'index.html?lang=vi'],
    ['../dich-vu.html?service=staffing#consult', '../dich-vu.html?service=staffing&lang=vi#consult'],
    ['/viec-lam?lang=en&lang=ko', '/viec-lam?lang=vi'],
    ['?id=qc#apply', '?id=qc&lang=vi#apply'],
    [`${origin}/?lang=en`, `${origin}/?lang=vi`],
    ['//minh-duc.example/lien-he.html', '//minh-duc.example/lien-he.html?lang=vi']
  ];
  for (const [input, expected] of cases) assert.equal(locale.withLocale(input, 'vi', `${origin}/folder/page.html`), expected);
});

test('hash anchors, external destinations, assets and service endpoints are untouched', () => {
  const links = ['#ung-tuyen', '', '  ', 'https://other.example/jobs', 'mailto:hello@example.com', 'tel:123456789', 'javascript:void(0)', 'data:text/plain,hello', '/api/jobs', '/assets/logo.svg', '/_next/image?url=hero', 'profile.pdf', 'photo.webp', 'app.js', 'https://user:password@minh-duc.example/index.html'];
  for (const href of links) assert.equal(locale.withLocale(href, 'ko', origin), href);
});

test('a denied session store does not block locale persistence through the URL', () => {
  const location = { href: `${origin}/?lang=en&service=recruitment` };
  const storage = { setItem() { throw Error('Storage denied'); } };
  const history = { replaceState(state, title, href) { location.href = href; } };
  assert.equal(locale.persist('vi', { location, history, storage }), 'vi');
  assert.equal(locale.resolve(location.href, 'en'), 'vi');
  assert.equal(new URL(location.href).searchParams.get('service'), 'recruitment');
  assert.doesNotThrow(() => locale.persist('ko', { storage, location, history: { replaceState() { throw Error('History denied'); } } }));
});

function translatedText(text, lang) {
  const node = { textContent: text, parentElement: { closest: () => null } };
  let visited = false;
  const scope = vm.createContext({ window: {}, NodeFilter: { SHOW_TEXT: 4 }, document: {
    documentElement: {}, createTreeWalker: () => ({ currentNode: node, nextNode() { if (visited) return false; visited = true; return true; } })
  } });
  vm.runInContext(readFileSync(new URL('../public/demo-translations.js', import.meta.url), 'utf8'), scope);
  scope.window.MDTranslate.apply(lang, { querySelectorAll: () => [] });
  return node.textContent;
}

test('public benefit, place and form labels translate in every supported locale', () => {
  for (const original of ['BHXH', 'BHXH đầy đủ', 'Văn phòng', 'KCN Yên Phong · Bắc Ninh', 'KCN Quế Võ, Bắc Ninh', 'Họ và tên của bạn', 'Nhập số điện thoại', 'Tỉnh / KCN mong muốn']) {
    assert.equal(translatedText(original, 'vi'), original);
    for (const lang of ['en', 'zh', 'ko']) assert.notEqual(translatedText(original, lang), original, `${lang}: ${original}`);
  }
  assert.equal(translatedText('BHXH', 'en'), 'Social insurance');
  assert.doesNotMatch(translatedText('BHXH đầy đủ', 'ko'), /4대/);
});

test('prototype information page inherits the session and persists language changes without losing URL context', () => {
  const values = new Map([['md_language', 'en']]);
  const sessionStorage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const location = { href: `${origin}/chinh-sach-du-lieu.html?preview=1#forms` };
  const history = { replaceState(state, title, href) { location.href = href; } };
  const element = () => ({ children: [], listeners: {}, append(...children) { this.children.push(...children); }, replaceChildren() { this.children = []; }, addEventListener(type, callback) { this.listeners[type] = callback; } });
  const elements = Object.fromEntries(['info-content', 'back', 'jobs', 'cms', 'language-label', 'info-language'].map(id => [id, element()]));
  const document = { documentElement: {}, createElement: element, querySelector: selector => elements[selector.slice(1)], getElementById: id => elements[id] };
  const scope = vm.createContext({ window: { sessionStorage, history, location }, sessionStorage, location, document, URL });
  vm.runInContext(readFileSync(new URL('../public/locale-routing.js', import.meta.url), 'utf8'), scope);
  const source = readFileSync(new URL('../public/demo-info.js', import.meta.url), 'utf8');
  vm.runInContext(source, scope);
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(elements.jobs.href, 'viec-lam.html?lang=en');
  elements['info-language'].listeners.change({ target: { value: 'vi' } });
  assert.equal(document.documentElement.lang, 'vi');
  assert.equal(values.get('md_language'), 'vi');
  assert.equal(elements.back.href, 'index.html?lang=vi');
  assert.equal(elements.jobs.href, 'viec-lam.html?lang=vi');
  assert.equal(new URL(location.href).searchParams.get('preview'), '1');
  assert.equal(new URL(location.href).hash, '#forms');
  vm.runInContext(source, scope);
  assert.equal(elements['info-language'].value, 'vi');
  assert.equal(document.title, 'Thông tin bản trải nghiệm | Minh Đức');
});
