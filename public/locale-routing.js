/* Shared locale routing for the static prototype. No DOM dependency. */
(function (root) {
  'use strict';
  const supported = Object.freeze(['vi', 'en', 'zh', 'ko']);
  const storageKey = 'md_language';
  const fallbackBase = 'https://minh-duc.invalid/';

  function normalize(value) {
    const locale = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (locale === 'zh-cn') return 'zh';
    return supported.includes(locale) ? locale : '';
  }

  function readUrl(value, base = fallbackBase) {
    try {
      const source = typeof value === 'string' ? value : value?.href || value?.search || '';
      return new URL(source, base);
    } catch {
      return null;
    }
  }

  // An explicit URL choice, including Vietnamese, always wins over the session.
  function resolve(url, stored) {
    return normalize(readUrl(url)?.searchParams.get('lang')) || normalize(stored) || 'vi';
  }

  // The explicit base makes link rewriting deterministic in the browser and prerenderer.
  function withLocale(href, locale, base = fallbackBase) {
    if (typeof href !== 'string' || !href.trim() || href.trim().startsWith('#')) return href;
    const current = readUrl(base);
    const target = current && readUrl(href, current.href);
    if (!target || !/^https?:$/.test(target.protocol) || target.origin !== current.origin) return href;
    if (target.username || target.password) return href;
    const path = target.pathname;
    // Never attach navigation state to downloads, images, scripts or service endpoints.
    if (/(?:^|\/)(?:api|assets|_next)(?:\/|$)/i.test(path)) return href;
    const lastSegment = path.split('/').pop();
    if (lastSegment.includes('.') && !/\.html?$/i.test(lastSegment)) return href;
    target.searchParams.set('lang', normalize(locale) || 'vi');
    const original = href.trim();
    const pathPart = original.split(/[?#]/, 1)[0];
    return pathPart + target.search + target.hash;
  }

  function browserEnvironment() {
    let storage;
    try { storage = root.sessionStorage; } catch { /* Private mode may deny storage. */ }
    return { storage, history: root.history, location: root.location };
  }

  // Persistence is the only effectful helper; dependencies can be injected for tests.
  function persist(locale, environment) {
    const chosen = normalize(locale) || 'vi';
    const env = environment || browserEnvironment();
    try { env.storage?.setItem(storageKey, chosen); } catch { /* URL remains authoritative. */ }
    try {
      const current = readUrl(env.location);
      if (current && env.history?.replaceState) {
        const next = withLocale(current.href, chosen, current.href);
        if (next !== current.href) env.history.replaceState(env.history.state ?? null, '', next);
      }
    } catch { /* The page can still render if history updates are restricted. */ }
    return chosen;
  }

  // Carry the knowledge-library context as bounded URL state, never a redirect URL.
  function newsState(value) {
    const url = readUrl(value);
    const kind = url?.searchParams.get('kind');
    return { kind: ['article', 'video'].includes(kind) ? kind : 'all', query: (url?.searchParams.get('q') || '').slice(0, 200) };
  }
  function newsHref(state = {}, locale = 'vi', id) {
    const url = new URL(id ? 'bai-viet.html' : 'tin-tuc.html', fallbackBase);
    if (id) url.searchParams.set('id', id);
    if (['article', 'video'].includes(state.kind)) url.searchParams.set('kind', state.kind);
    if (state.query) url.searchParams.set('q', String(state.query).slice(0, 200));
    url.searchParams.set('lang', normalize(locale) || 'vi');
    return url.pathname.slice(1) + url.search;
  }

  // Read a jobs URL or normalize a partial state using the same defaults.
  function jobsState(input) {
    const isUrl = typeof input === 'string' || typeof input?.href === 'string' || typeof input?.search === 'string';
    const url = isUrl ? readUrl(input) : null;
    const get = key => url ? url.searchParams.get(key) : input?.[key];
    const filter = key => {
      const value = get(key);
      return typeof value === 'string' ? value : '';
    };
    const enabled = key => {
      const value = get(key);
      return value === true || value === '1';
    };
    const legacy = /\/tuyen-dung-noi-bo(?:\.html)?$/i.test(url?.pathname ?? '');
    const sort = get('sort');
    const pageValue = get('page');
    const page = typeof pageValue === 'string' && /^\d+$/.test(pageValue) ? Number(pageValue) : pageValue;
    const hash = url?.hash ?? input?.hash;
    return {
      tab: legacy || get('tab') === 'internal' ? 'internal' : 'worker',
      q: filter('q'),
      area: filter('area'),
      park: filter('park'),
      salary: filter('salary'),
      saved: enabled('saved'),
      sort: ['newest', 'high', 'low', 'urgent'].includes(sort) ? sort : 'newest',
      page: Number.isSafeInteger(page) && page > 0 ? page : 1,
      preview: enabled('preview'),
      hash: typeof hash === 'string' && hash.startsWith('#') ? hash : ''
    };
  }

  // URL input supplies the locale when no valid override is provided.
  function jobsHref(input, lang) {
    const state = jobsState(input);
    const url = new URL('viec-lam.html', fallbackBase);
    if (state.tab === 'internal') url.searchParams.set('tab', state.tab);
    for (const key of ['q', 'area', 'park', 'salary']) {
      if (state[key]) url.searchParams.set(key, state[key]);
    }
    if (state.saved) url.searchParams.set('saved', '1');
    if (state.sort !== 'newest') url.searchParams.set('sort', state.sort);
    if (state.page > 1) url.searchParams.set('page', state.page);
    if (state.preview) url.searchParams.set('preview', '1');
    url.searchParams.set('lang', normalize(lang) || resolve(input));
    url.hash = state.hash;
    return url.pathname.slice(1) + url.search + url.hash;
  }

  function contactContext(value, services = []) {
    const url = readUrl(value), service = services.find(item => item.id === url?.searchParams.get('service'));
    const supplied = (url?.searchParams.get('staffing') || '').slice(0, 1500);
    // Previous releases placed a translated service name inside the message itself.
    // Recognize only those exact generated labels; free text belongs to the visitor.
    const message = service?.name?.includes(supplied) ? '' : supplied;
    return { service, message };
  }

  root.MDLocale = Object.freeze({ supported, storageKey, normalize, resolve, withLocale, internalHref: withLocale, persist, newsState, newsHref, jobsState, jobsHref, contactContext });
})(typeof window === 'undefined' ? globalThis : window);
