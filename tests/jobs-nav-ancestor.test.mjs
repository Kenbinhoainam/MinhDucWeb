import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/prototype-v17.js', import.meta.url), 'utf8');

test('job details and articles highlight their navigation ancestor at root and repository subpaths', () => {
  const jobs = [{ id: 'worker-job', type: 'worker' }, { id: 'internal-job', type: 'internal' }];

  for (const prefix of ['/', '/MinhDucWeb/']) for (const item of [...jobs.map(job => ({ ...job, page: 'detail', file: 'chi-tiet-viec-lam.html' })), { id: 'article', page: 'article', file: 'bai-viet.html' }]) {
    const location = new URL(`https://minh-duc.example${prefix}${item.file}?id=${item.id}&lang=en`);
    const links = ['viec-lam.html?lang=en', 'tin-tuc.html?lang=en'].map(path => ({
      href: new URL(path, location).href,
      attributes: new Map(),
      classList: {
        active: false,
        toggle(name, enabled) { if (name === 'active') this.active = enabled; }
      },
      setAttribute(name, value) { this.attributes.set(name, value); },
      removeAttribute(name) { this.attributes.delete(name); }
    }));
    const scope = vm.createContext({
      window: {}, location, URL, URLSearchParams, structuredClone,
      localStorage: { getItem: () => null },
      document: {
        documentElement: { lang: 'en', classList: { toggle() {} } },
        addEventListener() {},
        querySelector: () => null,
        querySelectorAll: selector => selector === '#mainNav a' ? links : []
      }
    });
    vm.runInContext(source, scope);
    const adapter = scope.window.MD15;
    adapter.boot({ page: item.page, getData: () => ({ jobs }), render: adapter.enhancePublic });

    const label = prefix + item.id;
    assert.deepEqual(links.map(link => link.attributes.get('aria-current')), item.page === 'detail' ? ['location', undefined] : [undefined, 'location'], label);
    if (item.page === 'detail') assert.deepEqual(links.map(link => link.classList.active), [true, false], label);
  }
});
