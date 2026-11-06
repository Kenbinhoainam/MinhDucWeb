import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { Script } from 'node:vm';

const publicDir = new URL('../public/', import.meta.url);
const read = file => readFileSync(new URL(file, publicDir), 'utf8');
const html = read('tv.html');
const css = read('tv.css');
const js = read('tv.js');

const screenNames = ['welcome', 'worker', 'business', 'display'];
const screenSelector = '[data-tv-screen]';
const slideSelector = '[data-tv-slide]';
const screen = (root, name) => root.querySelector('[data-tv-screen="' + name + '"]');
const action = (root, name) => root.querySelector('[data-tv-action="' + name + '"]');
const visible = nodes => nodes.filter(node => !node.hasAttribute('hidden'));
const attributeValues = (nodes, name) => nodes.map(node => node.getAttribute(name));

class Element {
  constructor(tag, attributes = {}, parent = null) {
    this.tag = tag;
    this.attributes = attributes;
    this.parent = parent;
    this.children = [];
    this.parts = [];
  }

  get childElementCount() { return this.children.length; }
  get textContent() {
    return this.parts.map(part => typeof part === 'string' ? part : part.textContent).join('');
  }
  set textContent(value) {
    this.children = [];
    this.parts = [value];
  }
  get id() { return this.getAttribute('id') ?? ''; }
  get target() { return this.getAttribute('target') ?? ''; }
  get tabIndex() {
    if (this.hasAttribute('tabindex')) return Number(this.getAttribute('tabindex'));
    return this.matches('a[href], button') ? 0 : -1;
  }
  hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
  getAttribute(name) { return this.hasAttribute(name) ? this.attributes[name] : null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  toggleAttribute(name, force) {
    if (force && !this.hasAttribute(name)) this.setAttribute(name, '');
    if (!force) delete this.attributes[name];
    return force;
  }
  matches(selector) {
    return selector.split(',').some(part => {
      const simple = part.trim();
      if (simple === ':disabled') return this.hasAttribute('disabled');
      const match = /^([a-z][\w-]*)?((?:\[[\w-]+(?:="[^"]*")?\])*)$/i.exec(simple);
      assert.ok(match && simple, 'Unsupported VM selector: ' + simple);
      const [, tag, attributes] = match;
      return (!tag || this.tag === tag) &&
        [...attributes.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)].every(([, name, value]) =>
          value === undefined ? this.hasAttribute(name) : this.getAttribute(name) === value);
    });
  }
  closest(selector) {
    if (this.matches(selector)) return this;
    return this.parent?.closest(selector) ?? null;
  }
  contains(node) {
    for (let current = node; current; current = current.parent) {
      if (current === this) return true;
    }
    return false;
  }
  *descendants() {
    for (const child of this.children) {
      yield child;
      yield* child.descendants();
    }
  }
  querySelectorAll(selector) {
    return [...this.descendants()].filter(node => node.matches(selector));
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  getClientRects() { return this.closest('[hidden]') ? [] : [{}]; }
}

const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));

// Handles the explicitly nested markup in tv.html and fails on unexpected closing tags.
// Browser layout, the accessibility tree and native default actions are outside this harness.
function parsePage(markup = html) {
  const page = new Element('#document');
  let parent = page;
  const tokens = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(script|style)\b((?:"[^"]*"|'[^']*'|[^"'<>])*)>([\s\S]*?)<\/\1\s*>|<(\/?)([a-z][\w:-]*)((?:"[^"]*"|'[^']*'|[^"'<>])*)>|[^<]+|</gi;
  const attribute = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+)))?/g;

  for (const [token, rawTag, rawAttrs, rawText, closing, tagName, attrs] of markup.matchAll(tokens)) {
    if (/^<!/i.test(token)) continue;
    if (!rawTag && !tagName) {
      parent.parts.push(token);
      continue;
    }
    const tag = (rawTag ?? tagName).toLowerCase();
    if (closing) {
      assert.equal(parent.tag, tag, 'Unexpected closing tag ' + token);
      parent = parent.parent;
      continue;
    }

    const attributes = Object.create(null);
    for (const [, name, double, single, unquoted] of (rawAttrs ?? attrs).matchAll(attribute)) {
      const key = name.toLowerCase();
      assert.ok(!Object.hasOwn(attributes, key), 'Duplicate ' + key + ' attribute on <' + tag + '>');
      attributes[key] = double ?? single ?? unquoted ?? '';
    }
    const node = new Element(tag, attributes, parent);
    parent.children.push(node);
    parent.parts.push(node);
    if (rawTag) node.parts.push(rawText);
    else if (!voidTags.has(tag)) parent = node;
  }
  assert.equal(parent, page, 'Unclosed element');
  return page;
}

const page = parsePage();
const root = page.querySelector('[data-tv-root]');

test('TV uses named Vietnamese landmarks and the initial markup shows only the welcome screen', () => {
  assert.match(html, /^<!doctype html>/i);
  assert.equal(page.querySelector('html')?.getAttribute('lang'), 'vi');
  assert.ok(page.querySelector('title')?.textContent.trim());
  const robots = page.querySelector('meta[name="robots"]')?.getAttribute('content');
  assert.ok(robots?.split(/[,\s]+/).includes('noindex'));
  assert.deepEqual(page.querySelectorAll('[data-tv-root]'), [root]);
  assert.deepEqual(page.querySelectorAll('main'), [root]);
  assert.equal(root?.tag, 'main');

  const panels = root.querySelectorAll(screenSelector);
  assert.deepEqual(attributeValues(panels, 'data-tv-screen').sort(), [...screenNames].sort());
  assert.deepEqual(attributeValues(visible(panels), 'data-tv-screen'), ['welcome']);
  assert.equal(root.querySelectorAll('h1').length, 1);
  assert.ok(screen(root, 'welcome').querySelector('h1'));
  for (const panel of panels) {
    assert.equal(panel.tag, 'section');
    assert.ok(!panel.getAttribute('role'), 'Retain native section semantics');
    assert.equal(panel.id, panel.getAttribute('data-tv-screen'));
    assert.match(panel.textContent, /bản\s+demo/iu, panel.id + ' must disclose demo content');
  }
  for (const nav of root.querySelectorAll('nav')) {
    assert.ok(nav.getAttribute('aria-label')?.trim() || nav.getAttribute('aria-labelledby'));
  }
  const status = root.querySelectorAll('[data-tv-status]');
  assert.equal(status.length, 1);
  assert.equal(status[0].getAttribute('role'), 'status');
  assert.ok(screen(root, 'display').contains(status[0]));
});

test('TV ID references resolve uniquely, and four named slides share native progress and controls', () => {
  const ids = new Map();
  for (const node of page.querySelectorAll('[id]')) {
    assert.match(node.id, /^\S+$/);
    assert.ok(!ids.has(node.id), 'Duplicate ID: ' + node.id);
    ids.set(node.id, node);
  }
  const idrefs = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-details',
    'aria-owns', 'aria-flowto', 'aria-activedescendant', 'aria-errormessage', 'for', 'headers'];
  for (const node of page.descendants()) {
    for (const name of idrefs.filter(name => node.hasAttribute(name))) {
      const values = node.getAttribute(name).trim().split(/\s+/);
      assert.equal(new Set(values).size, values.length, 'Repeated ID in ' + name);
      for (const id of values) assert.ok(ids.has(id), name + ' references missing ID: ' + id);
    }
    const href = node.getAttribute('href');
    if (href?.startsWith('#')) assert.ok(ids.has(href.slice(1)), 'Broken fragment: ' + href);
  }

  const display = screen(root, 'display');
  const slides = root.querySelectorAll(slideSelector);
  assert.deepEqual(slides, display.querySelectorAll(slideSelector));
  assert.deepEqual(attributeValues(slides, 'data-tv-slide'), ['1', '2', '3', '4']);
  assert.deepEqual(visible(slides), [slides[0]]);
  for (const node of [...root.querySelectorAll(screenSelector), ...slides]) {
    const heading = ids.get(node.getAttribute('aria-labelledby'));
    assert.ok(heading?.matches('h1, h2, h3') && node.contains(heading) &&
      heading.textContent.trim(), 'Missing local heading for ' + (node.id || node.getAttribute('data-tv-slide')));
  }

  const indicators = root.querySelectorAll('[data-tv-progress]');
  assert.equal(indicators.length, 1);
  const [progress] = indicators;
  assert.ok(display.contains(progress));
  assert.equal(progress.tag, 'progress');
  assert.equal(Number(progress.getAttribute('value')), 1);
  assert.equal(Number(progress.getAttribute('max')), slides.length);
  assert.ok(progress.getAttribute('aria-label')?.trim() || progress.getAttribute('aria-labelledby'));

  for (const [name, panel] of [['worker', 'welcome'], ['business', 'welcome'],
    ['display', 'welcome'], ['prev', 'display'], ['next', 'display'], ['toggle', 'display']]) {
    const controls = root.querySelectorAll('[data-tv-action="' + name + '"]');
    assert.equal(controls.length, 1, 'Expected one control for ' + name);
    const [control] = controls;
    assert.ok(screen(root, panel).contains(control));
    const target = ids.get(control.getAttribute('aria-controls'));
    if (screenNames.includes(name)) assert.equal(target, screen(root, name));
    else assert.ok(target && slides.every(slide => target.contains(slide)), name + ' must control the slides');
  }
  for (const control of root.querySelectorAll('[data-tv-action]')) {
    assert.ok(control.matches('a[href], button[type="button"]'), 'Use native interactive controls');
    assert.ok(control.getAttribute('aria-label')?.trim() || control.getAttribute('aria-labelledby') ||
      control.textContent.trim(), 'Every action needs an accessible name');
  }
});

test('native links retain worker, business, home and return destinations without the controller', () => {
  const welcome = screen(root, 'welcome');
  for (const [name, href] of [['worker', 'viec-lam.html'], ['business', 'dich-vu.html']]) {
    const choice = action(welcome, name);
    assert.ok(choice?.matches('a[href]'));
    assert.equal(choice.getAttribute('href'), href);
    assert.ok(screen(root, name).querySelector('a[href="' + href + '"]'));
  }
  assert.ok(welcome.querySelector('a[href="index.html"]'));
  for (const name of ['worker', 'business', 'display']) {
    const back = action(screen(root, name), 'welcome');
    assert.ok(back?.matches('a[href]'));
    assert.equal(back.getAttribute('aria-controls'), 'welcome');
    assert.match(back.getAttribute('href'), /^(?:tv\.html(?:#welcome)?|#welcome)$/);
  }
  assert.ok(action(welcome, 'display').hasAttribute('hidden'));
  assert.match(page.querySelectorAll('noscript').map(node => node.textContent).join('\n'), /Bật JavaScript/);
});

function assertLocalFile(reference, source) {
  const origin = new URL('https://tv.example.test/tv.html');
  const url = new URL(reference, origin);
  assert.equal(url.origin, origin.origin, source + ' must stay local: ' + reference);
  assert.match(reference, /^(?!\/\/)[./\w-]/, source + ' must use a local path or fragment');
  assert.ok(statSync(new URL('.' + url.pathname, publicDir), { throwIfNoEntry: false })?.isFile(),
    source + ' points to a missing file: ' + reference);
}

test('TV references only packaged files and exposes no forms or external request markup', () => {
  const scripts = page.querySelectorAll('script');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].getAttribute('src'), 'tv.js');
  assert.ok(scripts[0].hasAttribute('defer'));
  assert.equal(scripts[0].textContent.trim(), '');
  assert.ok(page.querySelector('link[rel="stylesheet"][href="tv.css"]'));

  const inlineStyles = [];
  for (const node of page.descendants()) {
    assert.doesNotMatch(node.tag, /^(?:form|input|select|textarea|iframe|frame|object|embed|base)$/);
    if (node.tag === 'meta') assert.doesNotMatch(node.getAttribute('http-equiv') ?? '', /^refresh$/i);
    if (node.tag === 'link') assert.doesNotMatch(node.getAttribute('rel') ?? '', /\b(?:preconnect|dns-prefetch|prefetch|prerender)\b/i);
    if (node.tag === 'img') assert.ok(node.hasAttribute('alt'), 'Image must have alternative text or be decorative');
    if (node.tag === 'style') inlineStyles.push(node.textContent);
    for (const [name, value] of Object.entries(node.attributes)) {
      assert.doesNotMatch(name, /^(?:on\w+|action|formaction|ping|srcdoc)$/i, 'Unsafe attribute on <' + node.tag + '>');
      if (name === 'style') inlineStyles.push(value);
      if (/^(?:href|xlink:href|src|poster|background|data|cite)$/.test(name) && !value.startsWith('#')) {
        assert.ok(value.trim(), 'Empty ' + name + ' on <' + node.tag + '>');
        assertLocalFile(value, node.tag + '[' + name + ']');
      }
      if (name === 'srcset' || name === 'imagesrcset') {
        for (const candidate of value.split(',')) assertLocalFile(candidate.trim().split(/\s+/)[0], name);
      }
    }
  }

  const styles = [css, ...inlineStyles].join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(styles, /@import\b|(?:-webkit-)?image-set\s*\(/i);
  for (const [, double, single, bare] of styles.matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi)) {
    assertLocalFile(double ?? single ?? bare, 'CSS url()');
  }
  assert.match(styles, /\[hidden\][^{]*\{[^}]*\bdisplay\s*:\s*none\s*!important\b/i,
    'The stylesheet must preserve native hidden state when panels are styled as grids');
});

test('demo copy avoids quantified claims, guarantees and unsupported endorsements', () => {
  const copy = [page.querySelector('title').textContent, root.textContent,
    ...[...page.descendants()].flatMap(node =>
      ['alt', 'aria-label', 'title', 'content'].map(name => node.getAttribute(name) ?? ''))]
    .join(' ').normalize('NFC').replace(/\s+/g, ' ');

  assert.doesNotMatch(copy, /\d[\d.,]*\s*(?:%|₫|vnd|vnđ|đồng|triệu|nghìn|ngàn|tỷ|doanh nghiệp|khách hàng|đối tác|nhà máy|lao động|năm kinh nghiệm)(?!\p{L})/iu);
  assert.doesNotMatch(copy, /cam kết (?:có việc|việc làm|thu nhập|tuyển đủ)|đảm bảo (?:có việc|đậu|trúng tuyển|thu nhập)|uy tín số\s*1|hàng đầu|đối tác chính thức|(?:được|đã được) chứng nhận/iu);
});

test('controller parses as a classic script and avoids network, storage and HTML injection APIs', () => {
  assert.doesNotThrow(() => new Script(js, { filename: 'tv.js' }));
  const source = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|WebTransport|EventSource|sendBeacon|RTCPeerConnection|importScripts|Worker|SharedWorker|serviceWorker)\b|\bimport\s*\(/);
  assert.doesNotMatch(source, /\b(?:localStorage|sessionStorage|indexedDB|cookie|caches)\b/);
  assert.doesNotMatch(source, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|eval|Function|write|writeln)\b|\bset(?:Timeout|Interval)\s*\(\s*["'\x60]/);
});

function boot({ hash = '', reducedMotion = false } = {}) {
  const document = parsePage();
  const html = document.querySelector('html');
  const body = document.querySelector('body');
  const root = document.querySelector('[data-tv-root]');
  Object.assign(html, { clientHeight: 568, scrollHeight: 568, scrollTop: 0 });
  Object.assign(document, {
    documentElement: html, scrollingElement: html, body, activeElement: body, hidden: false, readyState: 'complete',
  });

  const listeners = new WeakMap();
  function makeEventTarget(target) {
    const events = new Map();
    listeners.set(target, events);
    target.addEventListener = (type, callback) => {
      if (!events.has(type)) events.set(type, new Set());
      events.get(type).add(callback);
    };
    return target;
  }

  function dispatch(target, type, details = {}) {
    const event = {
      type, target, defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; },
      ...details,
    };
    for (let node = target; node; node = node.parent) {
      for (const callback of listeners.get(node)?.get(type) ?? []) callback(event);
    }
    return event;
  }

  makeEventTarget(document);
  for (const node of document.descendants()) {
    makeEventTarget(node);
    node.focus = () => {
      if (node.closest('[hidden], [inert]') || document.activeElement === node) return;
      document.activeElement = node;
      dispatch(node, 'focusin');
    };
  }

  const timers = new Map();
  const timerDelays = new Map();
  const replacedLocations = [];
  let nextTimerId = 0;
  const window = makeEventTarget({
    document,
    location: { hash, pathname: '/tv.html', search: '' },
    history: { replaceState(_state, _title, url) { replacedLocations.push(url); } },
    matchMedia: query => ({ matches: reducedMotion && query === '(prefers-reduced-motion: reduce)' }),
    getComputedStyle: () => ({ visibility: 'visible' }),
    scrollTo(_x, y) { html.scrollTop = y; },
    setTimeout(callback, delay) {
      assert.ok(Number.isFinite(delay) && delay > 0, 'Slideshow needs a positive interval');
      timers.set(++nextTimerId, callback);
      timerDelays.set(nextTimerId, delay);
      return nextTimerId;
    },
    clearTimeout: id => timers.delete(id),
  });
  window.window = window;
  new Script(js, { filename: 'tv.js' }).runInNewContext(window, { timeout: 1000 });

  return {
    api: window.MDTV,
    document,
    root,
    click(target, details) {
      target.focus();
      return dispatch(target, 'click', details);
    },
    key: key => dispatch(document.activeElement, 'keydown', { key }),
    pendingTimers: () => timers.size,
    pendingTimerDelays: () => [...timers.keys()].map(id => timerDelays.get(id)),
    replacedLocations,
    fireTimer() {
      const [id, callback] = timers.entries().next().value ?? [];
      assert.ok(callback, 'Expected a scheduled slide advance');
      timers.delete(id);
      timerDelays.delete(id);
      callback();
    },
    setHidden(hidden) {
      document.hidden = hidden;
      dispatch(document, 'visibilitychange');
    },
  };
}

function assertView(tv, name, mode, slide) {
  assert.equal(tv.api.getState().screen, name);
  assert.equal(tv.api.getState().mode, mode);
  assert.equal(tv.api.getState().playing, mode === 'playing');
  assert.equal(tv.api.getState().total, 4);
  assert.equal(tv.root.getAttribute('data-tv-mode'), mode);

  const panels = tv.root.querySelectorAll(screenSelector);
  assert.deepEqual(attributeValues(visible(panels), 'data-tv-screen'), [name]);
  assert.deepEqual(attributeValues(panels.filter(node => !node.hasAttribute('inert')), 'data-tv-screen'), [name]);
  if (slide !== undefined) {
    const display = screen(tv.root, 'display');
    assert.equal(tv.api.getState().slide, slide);
    assert.deepEqual(attributeValues(visible(display.querySelectorAll(slideSelector)), 'data-tv-slide'), [String(slide)]);
    assert.equal(display.querySelector('[data-tv-progress]').value, slide);
    assert.match(tv.root.querySelector('[data-tv-status]').textContent, new RegExp(slide + '\\s*/\\s*4'));
  }
}

test('MDTV exposes the controller API and enhances ordinary audience clicks while preserving native navigation', () => {
  const tv = boot();
  for (const name of ['init', 'getState', 'show', 'advance', 'toggle']) {
    assert.equal(typeof tv.api[name], 'function', 'Missing MDTV.' + name);
  }
  assertView(tv, 'welcome', 'manual');
  assert.equal(tv.pendingTimers(), 0);

  const welcome = screen(tv.root, 'welcome');
  const worker = action(welcome, 'worker');
  assert.equal(tv.click(worker, { ctrlKey: true }).defaultPrevented, false);
  assertView(tv, 'welcome', 'manual');
  assert.equal(tv.click(worker).defaultPrevented, true);
  assertView(tv, 'worker', 'manual');
  const workerPanel = screen(tv.root, 'worker');
  assert.ok(workerPanel.contains(tv.document.activeElement));
  assert.equal(tv.click(workerPanel.querySelector('a[href="viec-lam.html"]')).defaultPrevented, false);
  tv.api.init();
  assertView(tv, 'worker', 'manual');

  assert.equal(tv.click(action(workerPanel, 'welcome')).defaultPrevented, true);
  assertView(tv, 'welcome', 'manual');
  assert.equal(tv.document.activeElement, worker);
  assert.equal(tv.click(action(welcome, 'business')).defaultPrevented, true);
  assertView(tv, 'business', 'manual');
});

test('only an explicit play action starts timed advancement, including when opening the display directly', () => {
  const direct = boot({ hash: '#display' });
  assertView(direct, 'display', 'paused', 1);
  assert.equal(direct.document.activeElement, screen(direct.root, 'display').querySelector('h2'));
  assert.equal(direct.pendingTimers(), 0);
  direct.api.show('display');
  assertView(direct, 'display', 'paused', 1);
  assert.equal(direct.pendingTimers(), 0);

  const tv = boot();
  assert.equal(tv.pendingTimers(), 0);
  assert.equal(tv.click(action(tv.root, 'display')).defaultPrevented, true);
  assertView(tv, 'display', 'playing', 1);
  assert.deepEqual(tv.pendingTimerDelays(), [20_000]);
  assert.equal(tv.replacedLocations.at(-1), '#display');
  assert.match(tv.root.querySelector('[data-tv-visible-status]').textContent, /Trang 1 \/ 4 · Đang phát/);
  assert.match(tv.root.querySelector('[data-tv-status]').textContent, /Chọn nơi làm và ca làm/);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 2);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 3);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 4);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 1);
});

test('returning to welcome restores its choice, while reentering an audience screen starts at its heading', () => {
  const tv = boot();
  const viewport = tv.document.scrollingElement;
  viewport.scrollHeight = 960;

  for (const name of ['worker', 'business']) {
    const choice = action(screen(tv.root, 'welcome'), name);
    const panel = screen(tv.root, name);
    const heading = panel.querySelector('h2');
    const back = action(panel, 'welcome');

    tv.click(choice);
    assert.equal(tv.document.activeElement, heading);
    assert.equal(heading.tabIndex, -1);

    viewport.scrollTop = 392;
    tv.click(back);
    assert.equal(tv.document.activeElement, choice);
    tv.click(choice);
    assert.equal(tv.document.activeElement, heading);
    assert.equal(viewport.scrollTop, 0);
    tv.key('Escape');
  }
});

test('vertical arrows leave scrolling to the browser on overflowing screens and cycle controls when content fits', () => {
  const tv = boot();
  const viewport = tv.document.scrollingElement;
  tv.click(action(tv.root, 'worker'));
  const panel = screen(tv.root, 'worker');
  const heading = panel.querySelector('h2');
  const first = panel.querySelector('a[href="viec-lam.html"]');
  const back = action(panel, 'welcome');
  viewport.scrollHeight = 960;

  assert.equal(tv.key('ArrowDown').defaultPrevented, false);
  assert.equal(tv.document.activeElement, heading);
  assert.equal(tv.key('ArrowRight').defaultPrevented, true);
  assert.equal(tv.document.activeElement, first);
  assert.equal(tv.key('ArrowRight').defaultPrevented, true);
  assert.equal(tv.document.activeElement, back);
  for (const key of ['ArrowUp', 'ArrowDown']) {
    assert.equal(tv.key(key).defaultPrevented, false);
    assert.equal(tv.document.activeElement, back);
  }
  assert.equal(tv.key('ArrowLeft').defaultPrevented, true);
  assert.equal(tv.document.activeElement, first);

  viewport.scrollHeight = viewport.clientHeight;
  assert.equal(tv.key('ArrowDown').defaultPrevented, true);
  assert.equal(tv.document.activeElement, back);
  assert.equal(tv.key('ArrowUp').defaultPrevented, true);
  assert.equal(tv.document.activeElement, first);
});

test('remote arrows pause and move focus, while manual slide controls pause and wrap', () => {
  const tv = boot();
  tv.click(action(tv.root, 'display'));
  const display = screen(tv.root, 'display');
  const prev = action(display, 'prev');
  const next = action(display, 'next');
  assert.ok(display.contains(tv.document.activeElement));
  assert.equal(tv.key('ArrowRight').defaultPrevented, true);
  assert.equal(tv.document.activeElement, prev);
  assertView(tv, 'display', 'paused', 1);
  assert.equal(tv.pendingTimers(), 0);

  tv.click(action(display, 'toggle'));
  assertView(tv, 'display', 'playing', 1);
  tv.click(prev);
  assertView(tv, 'display', 'paused', 4);
  assert.equal(tv.pendingTimers(), 0);
  tv.click(next);
  assertView(tv, 'display', 'paused', 1);
  tv.api.advance();
  assertView(tv, 'display', 'paused', 2);
  assert.equal(tv.pendingTimers(), 0);
});

test('Tab pauses without swallowing native navigation, and Escape stops playback and restores welcome focus', () => {
  const tv = boot();
  const start = action(tv.root, 'display');
  tv.click(start);
  assert.equal(tv.key('Tab').defaultPrevented, false);
  assertView(tv, 'display', 'paused', 1);
  assert.equal(tv.pendingTimers(), 0);

  tv.api.toggle();
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 2);
  assert.equal(tv.key('Escape').defaultPrevented, true);
  assertView(tv, 'welcome', 'manual');
  assert.equal(tv.replacedLocations.at(-1), '/tv.html');
  assert.equal(tv.pendingTimers(), 0);
  assert.equal(tv.document.activeElement, start);
  tv.click(start);
  assertView(tv, 'display', 'playing', 1);
});

test('reduced motion opens the presentation in manual mode and permits an explicit Play override', () => {
  const tv = boot({ reducedMotion: true });
  tv.click(action(tv.root, 'display'));
  assertView(tv, 'display', 'paused', 1);
  assert.equal(tv.pendingTimers(), 0);
  tv.click(action(tv.root, 'next'));
  assertView(tv, 'display', 'paused', 2);
  assert.equal(tv.pendingTimers(), 0);

  const toggle = action(tv.root, 'toggle');
  tv.click(toggle);
  assertView(tv, 'display', 'playing', 2);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 3);
  tv.click(toggle);
  assertView(tv, 'display', 'paused', 3);
  assert.equal(tv.pendingTimers(), 0);
});

test('hiding the document suspends timed advances and visibility does not restart a paused show', () => {
  const tv = boot();
  tv.click(action(tv.root, 'display'));
  tv.setHidden(true);
  assertView(tv, 'display', 'suspended', 1);
  assert.equal(tv.pendingTimers(), 0);
  tv.setHidden(false);
  assertView(tv, 'display', 'playing', 1);
  tv.fireTimer();
  assertView(tv, 'display', 'playing', 2);
  tv.click(action(tv.root, 'toggle'));
  tv.setHidden(true);
  tv.setHidden(false);
  assertView(tv, 'display', 'paused', 2);
  assert.equal(tv.pendingTimers(), 0);
});
