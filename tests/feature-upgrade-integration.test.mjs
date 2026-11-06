import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const publicPages = [
  'index', 'viec-lam', 'chi-tiet-viec-lam', 've-minh-duc',
  'dich-vu', 'tin-tuc', 'bai-viet', 'lien-he',
];
const demoAssistants = ['ai-seo-drafts', 'ai-translation-drafts', 'ai-job-drafts'];

test('reopening a same-fragment portal moves keyboard focus from the footer to its summary', () => {
  const handlers={}, summary={focus(options){this.options=options;}}, portal={
    open:false, querySelector:selector=>selector==='summary'?summary:null,
    scrollIntoView(options){this.scroll=options;},
  };
  const app={querySelector:()=>null,addEventListener:(name,handler)=>{handlers[name]=handler;}};
  vm.runInNewContext(read('public/feature-navigation.js'),{
    document:{body:{dataset:{page:'jobs'}},getElementById:id=>id==='app'?app:portal},
    MutationObserver:class{observe(){}},location:{hash:'#md-candidate-portal'},
  });
  const event={button:0,target:{closest:()=>({getAttribute:()=>'#md-candidate-portal'})},preventDefault(){this.prevented=true;}};
  handlers.click(event);
  assert.equal(event.prevented,true);
  assert.equal(portal.open,true);
  assert.equal(summary.options.preventScroll,true);
  assert.equal(portal.scroll.block,'start');
});

function checkAsset(html, name, enabled, file, module = false) {
  const scriptTag = module ? '<script type="module" src="' : '<script src="';
  const scriptEnd = module ? '"></script>' : '" defer></script>';
  const script = html.match(new RegExp(scriptTag + name + '\\.js(?:\\?[^"]*)?' + scriptEnd));
  const style = html.match(new RegExp('<link rel="stylesheet" href="' + name + '\\.css(?:\\?[^"]*)?">'));
  assert.equal(Boolean(script), enabled, file + ' script ' + name);
  assert.equal(Boolean(style), enabled, file + ' style ' + name);
  if (script && html.includes('site-runtime.js')) {
    assert.ok(script.index > html.indexOf('site-runtime.js'), name + ' runs after the shared app');
  }
}

test('generated templates load feature assets only in their intended contexts', () => {
  for (const file of publicPages) {
    const html = read('public/' + file + '.html');
    checkAsset(html, 'comparison-shifts', true, file);
    checkAsset(html, 'candidate-portal-demo', file === 'viec-lam', file);
    checkAsset(html, 'business-portal-demo', file === 'dich-vu', file);
    checkAsset(html, 'natural-job-search', file === 'viec-lam', file);
    checkAsset(html, 'ai-business-brief', ['index', 'dich-vu', 'lien-he'].includes(file), file);
    checkAsset(html, 'feature-navigation', ['viec-lam', 'dich-vu'].includes(file), file);
    for (const asset of demoAssistants) checkAsset(html, asset, false, file);
  }

  const demo = read('public/cms-demo.html');
  const protectedCms = read('private-pages/quan-tri.html');
  for (const asset of demoAssistants) {
    checkAsset(demo, asset, true, 'cms-demo');
    checkAsset(protectedCms, asset, false, 'quan-tri');
  }
  checkAsset(protectedCms, 'feature-navigation', false, 'quan-tri');
  for (const name of ['sheets-sync-demo', 'conversion-reports-demo']) {
    assert.match(demo, new RegExp('<a href="' + name + '\\.html">[^<]+</a>'));
    assert.doesNotMatch(protectedCms, new RegExp(name));
    const page = read('public/' + name + '.html');
    assert.match(page, /name="robots" content="noindex, nofollow"/);
    assert.match(page, /<a [^>]+href="cms-demo\.html"/);
    checkAsset(page, name, true, name, true);
  }
});

function appScope(page, lang, { path = '/', documentOverrides } = {}) {
  const location = new URL(path, 'https://minh-duc.example');
  location.searchParams.set('lang', lang);
  const storage = new Map();
  const events = [], listeners = new Map();
  const documentListeners = new Map();
  const savedCount = {};
  const button = {
    dataset: {},
    attrs: {},
    label: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    querySelector() { return this.label; },
  };
  const scope = vm.createContext({
    window: { dispatchEvent: event => events.push(event), addEventListener:(type,fn)=>listeners.set(type,fn) },
    document: {
      body: { dataset: { page } },
      querySelector: () => null,
      querySelectorAll: selector => {
        if (selector === '[data-save-job]') return [button];
        if (selector === '[data-saved-count]') return [savedCount];
        return [];
      },
      addEventListener(type, listener) {
        const handlers = documentListeners.get(type) ?? [];
        handlers.push(listener);
        documentListeners.set(type, handlers);
      },
      ...documentOverrides,
    },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    sessionStorage: { getItem: () => null },
    CustomEvent: class {
      constructor(type, options) { this.type = type; this.detail = options.detail; }
    },
    location, URL, URLSearchParams, structuredClone, Intl, Date, console, clearTimeout,
  });
  for (const file of ['demo-translations', 'v13-copy', 'v14-copy', 'locale-routing', 'flagship-content', 'flagship-editorial']) {
    vm.runInContext(read('public/' + file + '.js'), scope);
  }
  const source = read('public/app.js').replace(
    'wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();',
    `Object.assign(window, {
      renderFooterForTest: footer,
      renderJobsForTest(jobs) { db.jobs = jobs; return listing(); },
      enhanceForTest: enhanceV14,
      renderDockForTest: mobileActionDock,
      jobHrefForTest: jobHref,
      wireJobsForTest: wireV14,
    });`,
  );
  vm.runInContext(source, scope);
  return { ...scope.window, storage, events, button, savedCount, listeners, documentListeners, localStorage:scope.localStorage };
}

test('jobs listing sorts visible cards within each tab using the selected ordering', () => {
  const jobs = ['worker', 'internal'].flatMap(type => [
    { id: `${type}-recent`, min: 8, max: 18, posted: '2026-10-26' },
    { id: `${type}-premium`, min: 11, max: 20, posted: '2026-10-25' },
    { id: `${type}-urgent`, min: 9, max: 15, posted: '2026-10-24', urgent: true },
    { id: `${type}-closed`, min: 7, max: 30, posted: '2026-10-27', open: false },
  ].map(job => ({ type, title: job.id, location: 'Hà Nội', park: 'KCN Thăng Long', open: true, urgent: false, tags: [], ...job })));
  const orders = {
    newest: ['recent', 'premium', 'urgent'],
    high: ['premium', 'recent', 'urgent'],
    low: ['recent', 'urgent', 'premium'],
    urgent: ['urgent', 'recent', 'premium'],
  };

  for (const tab of ['worker', 'internal']) {
    for (const [sort, order] of Object.entries(orders)) {
      const app = appScope('jobs', 'vi', { path: `/viec-lam.html?tab=${tab}&sort=${sort}` });
      const html = app.renderJobsForTest(jobs);
      const cardIds = [...html.matchAll(/data-save-job="([^"]+)"/g)].map(match => match[1]);
      assert.deepEqual(cardIds, order.map(suffix => `${tab}-${suffix}`), `${tab} / ${sort}`);
      const select = html.match(/<select\b[^>]*\bid="jobSort"[^>]*>([\s\S]*?)<\/select>/)?.[1];
      assert.ok(select, 'sorting is available as a native select');
      const selected = select.match(/<option\b[^>]*\sselected(?=[\s=>])[^>]*>/)?.[0];
      assert.equal(selected?.match(/\bvalue="([^"]+)"/)?.[1], sort);
    }
  }
});

test('detail return links retain valid list state and keep untrusted from values on the jobs route', () => {
  for (const from of [
    'viec-lam.html?tab=worker&sort=low&q=KCN&lang=ko#jobResults',
    'https://attacker.example/elsewhere?next=https://attacker.example/',
    '//attacker.example/viec-lam.html?lang=ko',
    'javascript:alert(1)',
    'https://[',
  ]) {
    const dock = { querySelector: () => null };
    const query = new URLSearchParams({ id: 'ky-su-co-dien', from });
    const app = appScope('detail', 'en', {
      path: '/chi-tiet-viec-lam.html?' + query,
      documentOverrides: { querySelector: selector => selector === '.mobile-action-dock' ? dock : null },
    });
    app.enhanceForTest();
    const returnLink = app.renderDockForTest().match(/<a\b[^>]*\bdata-action="job-list"[^>]*>/)?.[0];
    const href = returnLink?.match(/\bhref="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
    assert.match(href, /^viec-lam\.html\?/, from);
    const destination = new URL(href, 'https://minh-duc.example');
    assert.equal(destination.searchParams.get('tab'), 'internal');
    assert.equal(destination.searchParams.get('lang'), 'en');
    assert.equal(destination.searchParams.has('next'), false);
    if (from.startsWith('viec-lam.html')) {
      assert.equal(destination.searchParams.get('sort'), 'low');
      assert.equal(destination.searchParams.get('q'), 'KCN');
      assert.equal(destination.hash, '#jobResults');
    } else {
      assert.equal(destination.searchParams.has('sort'), false);
      assert.equal(destination.searchParams.has('q'), false);
      assert.equal(destination.searchParams.has('preview'), false);
    }
  }
});

test('detail return links retain filters within a repository subpath', () => {
  const from = 'viec-lam.html?sort=high&q=QC#jobResults';
  const app = appScope('detail', 'en', {
    path: '/MinhDucWeb/chi-tiet-viec-lam.html?' + new URLSearchParams({ id: 'cn-dien-tu', from }),
  });
  const markup = app.renderDockForTest().replaceAll('&amp;', '&');
  const link = markup.match(/<a\b[^>]*\bdata-action="job-list"[^>]*>/)?.[0];
  const href = link?.match(/href="([^"]+)"/)?.[1];
  assert.ok(href, markup);
  const destination = new URL(href, 'https://minh-duc.example/MinhDucWeb/chi-tiet-viec-lam.html');
  assert.equal(destination.pathname, '/MinhDucWeb/viec-lam.html');
  assert.equal(destination.searchParams.get('sort'), 'high');
  assert.equal(destination.searchParams.get('q'), 'QC');
  assert.equal(destination.hash, '#jobResults');
});

test('generated detail links bound nested return context and omit arbitrary fragments', () => {
  for (const path of ['/viec-lam.html#'+'a'.repeat(18000), '/viec-lam.html?q='+encodeURIComponent('việc '.repeat(5000))]) {
    const app=appScope('jobs','vi',{path});
    const href=app.jobHrefForTest({id:'cn-dien-tu',type:'worker'});
    assert.ok(href.length<2100);
    const context=new URL(href,'https://minh-duc.example').searchParams.get('from');
    assert.ok(encodeURIComponent(context).length<=1800);
    assert.equal(new URL(context,'https://minh-duc.example').hash,'');
  }
  const app=appScope('jobs','en',{path:'/viec-lam.html?sort=high#jobResults'});
  const url=new URL(app.jobHrefForTest({id:'cn-dien-tu',type:'worker'}),'https://minh-duc.example');
  assert.equal(new URL(url.searchParams.get('from'),'https://minh-duc.example').hash,'#jobResults');
});

test('delegated tab controls leave ordinary jobs-page clicks and keys alone', async () => {
  let focused;
  function element(tag, classes = [], attrs = {}, parent = null) {
    return {
      dataset: { jobTab: attrs['data-job-tab'] },
      matches(selector) {
        const parts = selector.match(/^([a-z]+)?(?:\.([\w-]+))?(?:\[([\w-]+)\])?$/);
        return Boolean(parts && (!parts[1] || parts[1] === tag) &&
          (!parts[2] || classes.includes(parts[2])) && (!parts[3] || Object.hasOwn(attrs, parts[3])));
      },
      closest(selector) { return this.matches(selector) ? this : parent?.closest(selector) ?? null; },
      focus() { focused = this; },
    };
  }
  const body = element('body', [], { 'data-job-tab': 'worker' });
  body.dataset.page = 'jobs';
  const unrelated = element('button', [], {}, body);
  const tabs = ['worker', 'internal'].map(tab => element('a', ['md-job-tab'], { 'data-job-tab': tab }, body));
  const { wireJobsForTest, documentListeners } = appScope('jobs', 'vi', {
    documentOverrides: { body, querySelectorAll: selector => tabs.filter(tab => tab.matches(selector)) },
  });
  wireJobsForTest();

  async function dispatch(type, target, details) {
    const event = { target, ...details, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const listener of documentListeners.get(type) ?? []) await listener(event);
    return event.defaultPrevented;
  }

  assert.equal(await dispatch('click', unrelated, { button: 0 }), false);
  assert.equal(await dispatch('keydown', unrelated, { key: 'ArrowRight' }), false);
  assert.equal(focused, undefined);
  assert.equal(await dispatch('keydown', tabs[0], { key: 'ArrowRight' }), true);
  assert.equal(focused, tabs[1]);
  assert.equal(tabs[1].tabIndex, 0);
  assert.equal(tabs[0].tabIndex, -1);
});

test('saved-job mutations retain newer bookmarks from other tabs and reconcile storage events', () => {
  const h=appScope('jobs','vi'), bridge=h.MDPrototypeBridge;
  const [a,b]=bridge.snapshot().jobs.filter(job=>job.open);
  h.button.dataset.saveJob=b.id;
  bridge.setJobSaved(a.id,true);
  h.storage.set('md_saved_jobs',JSON.stringify([a.id,b.id]));
  bridge.setJobSaved(a.id,false);
  assert.deepEqual(JSON.parse(h.storage.get('md_saved_jobs')),[b.id]);
  assert.equal(h.button.attrs['aria-pressed'],'true');
  h.storage.set('md_saved_jobs','[]');
  h.listeners.get('storage')({key:'md_saved_jobs'});
  assert.deepEqual(Array.from(bridge.getSavedJobIds()),[]);
  assert.equal(h.button.attrs['aria-pressed'],'false');
  assert.equal(h.savedCount.textContent,0);
});

test('a failed bookmark write retains session changes while merging a newer persisted set', () => {
  const h=appScope('jobs','vi'), bridge=h.MDPrototypeBridge;
  const [a,b,c]=bridge.snapshot().jobs.filter(job=>job.open);
  bridge.setJobSaved(a.id,true);
  const write=h.localStorage.setItem;
  h.localStorage.setItem=()=>{throw new Error('Storage unavailable');};
  assert.equal(bridge.setJobSaved(a.id,false),false);
  h.storage.set('md_saved_jobs',JSON.stringify([a.id,b.id]));
  assert.deepEqual(Array.from(bridge.getSavedJobIds()),[b.id]);
  h.localStorage.setItem=write;
  assert.equal(bridge.setJobSaved(c.id,true),true);
  assert.deepEqual(JSON.parse(h.storage.get('md_saved_jobs')),[b.id,c.id]);
});

test('footer portal links keep language across pages and use local fragments at the destination', () => {
  const labels = new Set();
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    const { renderFooterForTest } = appScope('home', lang);
    const footer = renderFooterForTest();
    for (const [page, id] of [['viec-lam', 'md-candidate-portal'], ['dich-vu', 'md-business-portal']]) {
      const match = footer.match(new RegExp('href="' + page + '\\.html\\?lang=' + lang + '#' + id + '" data-portal-target="' + id + '">([^<]+)'));
      assert.ok(match, lang + ' ' + id);
      labels.add(match[1]);
    }
  }
  assert.equal(labels.size, 8);
  for (const [file, id] of [['viec-lam', 'md-candidate-portal'], ['dich-vu', 'md-business-portal']]) {
    assert.match(read('public/' + file + '.html'), new RegExp('href="#' + id + '" data-portal-target="' + id + '"'));
  }
});

test('candidate and native job controls share the saved IDs, counts, storage and event', () => {
  const { MDPrototypeBridge: bridge, button, savedCount, storage, events } = appScope('jobs', 'vi');
  const { id } = bridge.snapshot().jobs.find(job => job.open);
  button.dataset.saveJob = id;

  for (const saved of [true, false]) {
    assert.equal(bridge.setJobSaved(id, saved), true);
    const ids = saved ? [id] : [];
    assert.deepEqual(Array.from(bridge.getSavedJobIds()), ids);
    assert.deepEqual(JSON.parse(storage.get('md_saved_jobs')), ids);
    assert.equal(savedCount.textContent, ids.length);
    assert.equal(button.attrs['aria-pressed'], String(saved));
    assert.ok(button.label.textContent);
    assert.equal(events.at(-1).type, 'md:saved-jobs-change');
    assert.equal(events.at(-1).detail.persisted, true);
  }
  assert.equal(bridge.setJobSaved('missing-id', true), false);
  assert.equal(events.length, 2);
});
