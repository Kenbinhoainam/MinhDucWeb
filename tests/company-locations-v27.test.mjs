import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/company-locations.js', import.meta.url), 'utf8');
const experience = fs.readFileSync(new URL('../public/contact-media.js', import.meta.url), 'utf8');
const profile = fs.readFileSync(new URL('../public/company-profile.js', import.meta.url), 'utf8');
const mapsA = 'https://maps.app.goo.gl/SourceVoi?g_st=ic';
const mapsB = 'https://maps.app.goo.gl/SourceBacNinh';
const embedA = 'https://www.google.com/maps/embed?pb=!1m18!2m3!3d21';
const embedB = 'https://www.google.com/maps/embed?pb=!1m18!2m3!3d22';
const facebook = 'https://www.facebook.com/md668.com.vn';
const fixture = () => ({
  company: { legalName: 'CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA', description: 'Cung ứng nguồn nhân lực, tư vấn/giới thiệu việc làm, lao động phổ thông nhà máy.', facebook },
  social: { hotline: '0364562868', zalo: 'https://zalo.me/0329138082', messenger: 'https://m.me/unused' },
  branches: [
    { id: 'voi', name: 'Vôi', address: '', mapsUrl: mapsA, embedUrl: embedA, visible: true },
    { id: 'bac-ninh', name: 'Bắc Ninh', address: '', mapsUrl: mapsB, embedUrl: embedB, visible: true },
    { id: 'quang-ninh', name: 'Quảng Ninh', address: '', mapsUrl: '', embedUrl: '', visible: true },
  ],
});

function scope({ document = {}, helpers = true, contacts = true, data = fixture(), search = '' } = {}) {
  const checks = [];
  const window = { location: { search }, MDPrototypeBridge: { snapshot: () => data } };
  if (helpers && helpers !== 'actual') window.MDCompanyProfile = Object.fromEntries([
    ['mapsUrl', [mapsA, mapsB]], ['embedUrl', [embedA, embedB]], ['facebookUrl', [facebook]],
  ].map(([kind, allowed]) => [kind, value => { checks.push([kind, value]); return allowed.includes(value) ? value : ''; }]));
  const context = vm.createContext({ window, document, URL, URLSearchParams });
  if (helpers === 'actual') vm.runInContext(profile, context);
  if (contacts) vm.runInContext(experience, context);
  vm.runInContext(source, context);
  return { api: window.MDCompanyLocations, window, checks, setData: value => { data = value; } };
}

// A small DOM adapter exercises the actual generated HTML and delegated handlers.
// It implements only the standard DOM methods used by this component, without a browser.
const decode = value => value.replace(/&(?:amp|lt|gt|quot|#39);/g, c => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }[c]));
function domScope(data = fixture(), lang = 'vi', helpers = true, search = '') {
  const events = [], listeners = new Map();
  let activeElement = null;
  class Element {
    constructor(tag) { this.tagName = tag; this.attributes = new Map(); this.content = []; this.parentElement = null; this.handlers = {}; }
    get children() { return this.content.filter(value => value instanceof Element); }
    get dataset() { return Object.fromEntries([...this.attributes].filter(([key]) => key.startsWith('data-')).map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), value])); }
    setAttribute(key, value) { this.attributes.set(key, String(value)); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    hasAttribute(key) { return this.attributes.has(key); }
    matches(selector) {
      return selector.split(',').some(part => {
        part = part.trim();
        const attr = part.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
        return attr ? this.hasAttribute(attr[1]) && (attr[2] === undefined || this.getAttribute(attr[1]) === attr[2]) : part === this.tagName;
      });
    }
    closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) || null; }
    querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    append(...nodes) { for (const node of nodes) { node.parentElement = this; this.content.push(node); } }
    remove() { if (this.parentElement) { events.push(['remove', this.tagName]); this.parentElement.content = this.parentElement.content.filter(node => node !== this); this.parentElement = null; } }
    replaceChildren(...nodes) { this.children.forEach(node => { node.parentElement = null; }); this.content = []; this.append(...nodes); }
    set innerHTML(value) { this.replaceChildren(); parse(value, this); events.push(['html', this.tagName]); }
    get textContent() { return this.content.map(node => typeof node === 'string' ? node : node.textContent).join(''); }
    set textContent(value) { this.replaceChildren(); this.content = [value]; }
    addEventListener(type, handler) { this.handlers[type] = handler; }
    get isConnected() { return this === documentRoot || !!this.parentElement?.isConnected; }
    focus() { activeElement = this; }
    set src(value) { this.attributes.set('src', value); events.push(['src', this.tagName, value]); }
    get src() { return this.getAttribute('src'); }
  }
  function parse(html, parent) {
    const stack = [parent];
    for (const token of html.match(/<[^>]+>|[^<]+/g) || []) {
      if (token.startsWith('</')) { stack.pop(); continue; }
      if (!token.startsWith('<')) { stack.at(-1).content.push(decode(token)); continue; }
      const tag = token.match(/^<([\w-]+)/)?.[1];
      assert.ok(tag, `unexpected tag ${token}`);
      const node = new Element(tag);
      for (const attr of token.slice(tag.length + 1, -1).matchAll(/([\w-]+)(?:="([^"]*)")?/g)) node.setAttribute(attr[1], decode(attr[2] ?? ''));
      stack.at(-1).append(node);
      if (!['img', 'input', 'br', 'hr'].includes(tag)) stack.push(node);
    }
    assert.equal(stack.length, 1);
  }
  const documentRoot = new Element('document');
  const document = {
    querySelectorAll: selector => documentRoot.querySelectorAll(selector),
    createElement: tag => { events.push(['create', tag]); return new Element(tag); },
    addEventListener: (type, handler) => { const handlers = listeners.get(type) || []; handlers.push(handler); listeners.set(type, handlers); },
  };
  const runtime = scope({ document, data, helpers, search });
  const form = new Element('form'), field = new Element('input'); field.value = 'Unsent native contact draft'; form.append(field);
  documentRoot.append(form);
  function render(value = data, locale = lang) {
    data = value; lang = locale; runtime.setData(value);
    documentRoot.querySelector('[data-md-company-scope]')?.remove();
    parse(runtime.api.html(value, 'contact', locale), documentRoot);
    runtime.api.init();
    return documentRoot.querySelector('[data-md-company-scope]');
  }
  let root = render();
  return { ...runtime, document, documentRoot, events, listeners, form, field,
    get root() { return root; },
    get activeElement() { return activeElement; },
    get status() { return root.querySelector('[data-md-branches-status]').textContent; },
    render(value = data, locale = lang) { root = render(value, locale); return root; },
    click(node) { assert.ok(node); node.focus(); for (const handler of listeners.get('click') || []) handler({ target: node }); },
  };
}

test('minimal-document prerender provides complete synchronous content without boot listeners', () => {
  const { api } = scope();
  assert.deepEqual(Object.keys(api), ['html', 'init']);
  assert.doesNotThrow(() => api.init());
  const data = fixture(), before = JSON.stringify(data);
  for (const mode of ['contact', 'about', 'home']) {
    const initial = api.html(data, mode, 'vi');
    assert.ok(initial.includes(data.company.legalName));
    assert.ok(initial.includes(data.company.description));
    assert.equal(api.html(data, mode, 'vi'), initial);
    assert.doesNotMatch(initial, /<iframe|<script|<h1\b|onload=|preconnect|dns-prefetch/);
  }
  assert.equal(JSON.stringify(data), before);
  assert.equal(api.html(data, 'unknown'), '');
});

test('contact renders all three source branches, source channels and honest absent addresses', () => {
  const { api, checks } = scope();
  const html = api.html(fixture(), 'contact', 'vi');
  assert.equal((html.match(/data-md-branches-select=/g) || []).length, 3);
  assert.match(html, /<h2 id="md-company-contact-title"/);
  assert.match(html, /Liên hệ trước khi đến/);
  assert.match(html, /href="tel:0364562868"/);
  assert.match(html, /href="https:\/\/zalo.me\/0329138082"/);
  assert.ok(html.includes(`href="${facebook}"`));
  assert.ok(html.includes(`href="${mapsA}"`));
  assert.doesNotMatch(html, /Messenger|m\.me|MD668|Nếnh|mailto:/);
  assert.ok(checks.some(([kind, value]) => kind === 'mapsUrl' && value === mapsA));
  assert.ok(checks.some(([kind, value]) => kind === 'embedUrl' && value === embedA));
  assert.ok(checks.some(([kind, value]) => kind === 'facebookUrl' && value === facebook));
});

test('all four authored locales preserve legal names and branch proper nouns', () => {
  const { api } = scope();
  const expected = { vi: 'Chọn chi nhánh', en: 'Choose a branch', zh: '选择分支机构', ko: '지점 선택' };
  for (const [lang, label] of Object.entries(expected)) {
    const html = api.html(fixture(), 'contact', lang);
    assert.ok(html.includes(label));
    assert.ok(html.includes(fixture().company.legalName));
    for (const branch of fixture().branches) assert.ok(html.includes(`translate="no">${branch.name}</b>`));
    assert.match(html, /aria-live="polite"/);
    assert.ok(html.includes(`data-md-company-lang="${lang}"`));
    if (lang !== 'vi') assert.doesNotMatch(html, /Liên hệ trước khi đến|Chọn chi nhánh|Xem bản đồ/);
  }
  assert.equal(api.html(fixture(), 'contact', 'zh-CN'), api.html(fixture(), 'contact', 'zh'));
  assert.equal(api.html(fixture(), 'contact', 'invalid'), api.html(fixture(), 'contact', 'vi'));
});

test('only visible branches appear, array order is retained and empty collections stay empty', () => {
  const { api } = scope();
  const data = fixture(); data.branches[0].visible = false;
  data.branches = [data.branches[2], data.branches[1], data.branches[0]];
  const html = api.html(data, 'contact', 'en');
  assert.doesNotMatch(html, /data-md-branches-select="voi"/);
  assert.ok(html.indexOf('data-md-branches-select="quang-ninh"') < html.indexOf('data-md-branches-select="bac-ninh"'));
  assert.match(html, /data-md-branches-select="quang-ninh"[^>]+aria-pressed="true"/);
  assert.doesNotMatch(html, /data-md-branches-load=/);
  data.branches = [];
  const empty = api.html(data, 'contact', 'en');
  assert.match(empty, /No branches are listed yet/);
  assert.match(empty, /href="tel:0364562868"/);
  assert.doesNotMatch(empty, /data-md-branches-select=|<iframe/);
  assert.doesNotMatch(api.html({}, 'contact'), /data-md-branches-select=|href="(?:tel:|https:)/);
});

test('missing helpers fail closed and no channel or map destination is invented', () => {
  const { api } = scope({ helpers: false, contacts: false });
  const html = api.html(fixture(), 'contact', 'en');
  assert.doesNotMatch(html, /href="(?:tel:|https:)|data-md-branches-load=/);
  assert.match(html, /Contact channels are being updated/);
  assert.match(html, /No map is available yet/);
});

test('untrusted text is escaped and rejected links cannot enter generated HTML', () => {
  const { api } = scope();
  const data = fixture();
  data.company.legalName = '<img src=x onerror=alert(1)> & "Name"';
  data.company.description = '<script>alert(1)</script>';
  data.company.facebook = 'https://facebook.com.evil.example/profile';
  data.branches[0].name = '"><img src=x onerror=alert(1)>';
  data.branches[0].address = '<svg onload=alert(1)>';
  data.branches[0].mapsUrl = 'javascript:alert(1)';
  data.branches[0].embedUrl = '<iframe src="https://evil.example"></iframe>';
  data.social.hotline = '123?call=evil'; data.social.zalo = 'https://zalo.me.evil.example/123';
  const html = api.html(data, 'contact');
  assert.doesNotMatch(html, /<img|<script|<svg|<iframe|evil\.example|href="javascript:|data-md-branches-load=/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /&lt;svg onload=alert\(1\)&gt;/);
});

test('about uses the original undistorted logo asset and home is a compact contact entry', () => {
  const { api } = scope();
  const about = api.html(fixture(), 'about', 'ko'), home = api.html(fixture(), 'home', 'en');
  assert.match(about, /src="assets\/logo-minh-duc-source.jpg"/);
  assert.equal((about.match(/href="lien-he.html\?lang=ko#chi-nhanh"/g) || []).length, 1);
  assert.match(home, /href="lien-he.html\?lang=en#chi-nhanh"/);
  assert.doesNotMatch(home, /<img|<h[1-6]|data-md-branches-select=|<iframe/);
  const ids = [...['home', 'about', 'contact'].flatMap(mode => [...api.html(fixture(), mode).matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))];
  assert.equal(new Set(ids).size, ids.length);
});

test('About links target each validated visible branch and carry the active locale', () => {
  const { api } = scope();
  const data = fixture();
  data.branches[0].visible = false;
  data.branches.push({ ...data.branches[1], id: 'bad&lang=en' }, { ...data.branches[1] });

  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    const about = api.html(data, 'about', lang);
    const branchHrefs = [...about.matchAll(/href="(lien-he\.html\?branch=[^"]+)"/g)].map(([, href]) => decode(href));
    assert.deepEqual(branchHrefs, ['bac-ninh', 'quang-ninh'].map(id => `lien-he.html?branch=${id}&lang=${lang}#chi-nhanh`));
  }
});

test('a direct branch link selects the requested branch and opens only its map', () => {
  const h = domScope(fixture(), 'en', true, '?branch=bac-ninh&lang=en');
  assert.equal(h.root.querySelector('[data-md-branches-select="bac-ninh"]').getAttribute('aria-pressed'), 'true');
  assert.equal(h.root.querySelector('[data-md-branches-select="voi"]').getAttribute('aria-pressed'), 'false');
  assert.equal(h.root.querySelector('iframe').src, embedB);
  assert.deepEqual(h.events.filter(([kind]) => kind === 'src'), [['src', 'iframe', embedB]]);
  assert.equal(h.root.querySelector('[data-md-branches-panel]').querySelector('a').getAttribute('href'), mapsB);
});

test('unknown, malformed or hidden direct branch requests fall back to the first visible branch', () => {
  const data = fixture();
  data.branches[0].visible = false;
  for (const branch of ['unknown', 'quang-ninh%22', 'voi']) {
    const h = domScope(data, 'en', true, `?branch=${branch}&lang=en`);
    assert.equal(h.root.querySelector('[data-md-branches-select="voi"]'), null);
    assert.equal(h.root.querySelector('[data-md-branches-select="bac-ninh"]').getAttribute('aria-pressed'), 'true');
    assert.deepEqual(h.events.filter(([kind]) => kind === 'src'), [['src', 'iframe', embedB]]);
  }
});

test('init binds once and selection changes only the owned panel, preserving focus and native forms', () => {
  const h = domScope(); h.api.init(); h.api.init();
  assert.equal(h.listeners.get('click').length, 1);
  assert.equal(h.root.querySelectorAll('iframe').length, 1);
  assert.equal(h.events.filter(([kind]) => kind === 'src').length, 1);
  const button = h.root.querySelector('[data-md-branches-select="bac-ninh"]');
  const originalRoot = h.root, form = h.form;
  h.click(button.children[1]);
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.equal(h.root.querySelector('[data-md-branches-select="voi"]').getAttribute('aria-pressed'), 'false');
  assert.equal(h.activeElement, button.children[1]);
  assert.match(h.status, /Bắc Ninh/);
  assert.equal(h.root, originalRoot); assert.equal(h.form, form);
  assert.equal(h.field.value, 'Unsent native contact draft');
  assert.equal(h.field.parentElement, form);
  assert.equal(h.root.querySelectorAll('iframe').length, 1);
  const panel = h.root.querySelector('[data-md-branches-panel]');
  assert.ok(panel.querySelectorAll('a').some(link => link.getAttribute('href') === mapsB));
});

test('maps load automatically with safe frame attributes and a persistent fallback', () => {
  const h = domScope();
  assert.equal(h.root.querySelector('[data-md-branches-load]'), null);
  const frame = h.root.querySelector('iframe');
  assert.ok(frame); assert.equal(frame.src, embedA);
  assert.equal(frame.title, 'Bản đồ chi nhánh: Vôi');
  assert.equal(frame.loading, 'eager'); assert.equal(frame.referrerPolicy, 'no-referrer');
  assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === mapsA));
  assert.match(h.status, /Đang tải bản đồ: Vôi/);
  h.api.init(); h.click(h.root.querySelector('[data-md-branches-select="voi"]'));
  assert.equal(h.events.filter(([kind, tag]) => kind === 'create' && tag === 'iframe').length, 1);
  frame.handlers.load(); assert.match(h.status, /Đã mở khung bản đồ: Vôi/);
});

test('changing branch removes the old frame before any new load and ignores stale frame callbacks', () => {
  const h = domScope();
  const old = h.root.querySelector('iframe');
  h.click(h.root.querySelector('[data-md-branches-select="bac-ninh"]'));
  const selectedStatus = h.status;
  old.handlers.load(); assert.equal(h.status, selectedStatus);
  assert.equal(old.isConnected, false); assert.notEqual(h.root.querySelector('iframe'), old);
  assert.equal(h.root.querySelector('iframe').src, embedB);
  const removed = h.events.findIndex(([kind, tag]) => kind === 'remove' && tag === 'iframe');
  const next = h.events.findIndex(([kind, tag, value]) => kind === 'src' && tag === 'iframe' && value === embedB);
  assert.ok(removed >= 0 && next > removed);
  h.click(h.root.querySelector('[data-md-branches-select="quang-ninh"]'));
  assert.equal(h.root.querySelector('iframe'), null);
  assert.equal(h.root.querySelector('[data-md-branches-load]'), null);
  assert.match(h.status, /Quảng Ninh/);
  assert.match(h.root.querySelector('[data-md-branches-panel]').textContent, /Chưa có bản đồ/);
});

test('a manual selection takes precedence over the direct branch link on locale rerender', () => {
  const h = domScope(fixture(), 'vi', true, '?branch=quang-ninh&lang=vi');
  assert.equal(h.root.querySelector('[data-md-branches-select="quang-ninh"]').getAttribute('aria-pressed'), 'true');
  h.click(h.root.querySelector('[data-md-branches-select="bac-ninh"]'));
  h.render(fixture(), 'zh');
  assert.equal(h.root.querySelector('[data-md-branches-select="bac-ninh"]').getAttribute('aria-pressed'), 'true');
  assert.equal(h.root.querySelector('[data-md-branches-select="quang-ninh"]').getAttribute('aria-pressed'), 'false');
  assert.equal(h.root.querySelector('iframe').src, embedB);
  assert.equal(h.root.querySelector('[data-md-branches-load]'), null);
  assert.equal(h.status, '正在加载地图：Bắc Ninh');
  assert.equal(h.field.value, 'Unsent native contact draft');
  assert.equal(h.listeners.get('click').length, 1);
});

test('hidden or deleted selection recovers to the first available branch with an announced status', () => {
  for (const action of ['hidden', 'deleted']) {
    const h = domScope(); h.click(h.root.querySelector('[data-md-branches-select="bac-ninh"]'));
    const data = fixture();
    if (action === 'hidden') data.branches[1].visible = false;
    else data.branches.splice(1, 1);
    h.render(data, 'en');
    assert.equal(h.root.querySelector('[data-md-branches-select="voi"]').getAttribute('aria-pressed'), 'true');
    assert.equal(h.status, 'The previous branch is unavailable. Selected: Vôi');
    data.branches = []; h.render(data, 'en');
    assert.match(h.status, /No branches are listed yet/);
    assert.equal(h.root.querySelector('[data-md-branches-select]'), null);
    assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === 'tel:0364562868'));
  }
});

test('runtime revalidates destinations and visible records rather than trusting DOM attributes', () => {
  const h = domScope(), button = h.root.querySelector('[data-md-branches-select="bac-ninh"]');
  const data = fixture(); data.branches[1].embedUrl = 'https://evil.example/maps/embed?pb=x'; h.setData(data);
  h.click(button); assert.equal(h.root.querySelector('iframe'), null);
  data.branches[1].visible = false; h.setData(data); h.click(button);
  assert.equal(h.root.querySelector('iframe').src, embedA);
  assert.equal(h.root.querySelector('[data-md-branches-select="voi"]').getAttribute('aria-pressed'), 'true');
});

test('an embed-only record retains an explicitly validated external fallback without inventing coordinates', () => {
  const h = domScope({ ...fixture(), branches: [{ ...fixture().branches[0], mapsUrl: '' }] });
  assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === embedA));
  assert.equal(h.root.querySelector('iframe').src, embedA);
  assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === embedA));
});

test('the real profile helper seed integrates with exact source shortlinks and runtime map loading', () => {
  const { window } = scope({ helpers: 'actual' });
  const data = window.MDCompanyProfile.seed(); data.social = fixture().social;
  const h = domScope(data, 'en', 'actual');
  assert.equal(h.root.querySelectorAll('[data-md-branches-select]').length, 3);
  assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === 'https://maps.app.goo.gl/2hj5gqjuaLS4t6hk8'));
  h.click(h.root.querySelector('[data-md-branches-select="bac-ninh"]'));
  assert.ok(h.root.querySelectorAll('a').some(link => link.getAttribute('href') === 'https://maps.app.goo.gl/VjV1DbkajBXDqGUE7?g_st=iz'));
  assert.equal(h.root.querySelector('iframe').src, data.branches[1].embedUrl);
  assert.equal(h.root.querySelector('iframe').title, 'Branch map: Chi nhánh Bắc Ninh');
  h.click(h.root.querySelector('[data-md-branches-select="quang-ninh"]'));
  assert.equal(h.root.querySelector('iframe'), null);
  assert.equal(h.root.querySelector('[data-md-branches-load]'), null);
  assert.equal(h.root.querySelector('[data-md-branches-panel]').querySelector('a'), null);
});

test('malformed or duplicate branch IDs cannot create inaccessible duplicate selectors', () => {
  const data = fixture();
  data.branches.push(...[
    { ...data.branches[0] },
    { ...data.branches[0], id: null },
    { ...data.branches[0], id: '--' },
    { ...data.branches[0], id: 'x'.repeat(81) },
    { ...data.branches[0], id: 'hidden', visible: 'true' },
  ]);
  const { api } = scope();
  assert.equal((api.html(data).match(/data-md-branches-select=/g) || []).length, 3);
});
