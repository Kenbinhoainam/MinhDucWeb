import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { isPublicSitePageRequest, publicSiteRedirectPaths, redirectPublicSiteRequest } from '../lib/public-site-redirect.ts';

const oldOrigin = 'https://minh-duc-prototype.kenbinhoainam.chatgpt.site';
const newBase = 'https://kenbinhoainam.github.io/MinhDucWeb/';
const redirect = (path, method = 'GET', origin = oldOrigin) =>
  redirectPublicSiteRequest(new Request(origin + path, { method }));

test('root and every public HTML page move permanently for GET and HEAD', async () => {
  const pages = readdirSync(new URL('../public/', import.meta.url)).filter(name => name.endsWith('.html'));
  for (const [path, destination] of [['/', ''], ...pages.map(page => ['/' + page, page])]) {
    for (const method of ['GET', 'HEAD']) {
      const response = redirect(path, method);
      assert.equal(response?.status, 308, `${method} ${path}`);
      assert.equal(response.headers.get('location'), newBase + destination);
      assert.equal(await response.text(), '');
    }
  }
});

test('extensionless public aliases reach the canonical GitHub HTML file', () => {
  for (const path of publicSiteRedirectPaths.filter(path => path !== '/' && !path.endsWith('.html'))) {
    const stem = path.replace(/^\//, '').replace(/\/$/, '');
    assert.equal(redirect(path).headers.get('location'), `${newBase}${stem}.html`, path);
  }
});

test('public GET/HEAD requests on preview hosts use assets, while production redirects', () => {
  for (const path of publicSiteRedirectPaths) {
    for (const method of ['GET', 'HEAD']) {
      const request = new Request('https://preview.chatgpt.site' + path + '?lang=en', { method });
      assert.equal(isPublicSitePageRequest(request), true, method + ' ' + path);
      assert.equal(redirectPublicSiteRequest(request), null);
      assert.equal(isPublicSitePageRequest(new Request(oldOrigin + path, { method })), true);
      assert.equal(redirect(path, method)?.status, 308);
    }
  }
});

test('query strings retain languages, ids, repeated parameters, encoding, and hostile values', () => {
  const query = '?id=MD-01&lang=ko&q=k%E1%BB%B9+s%C6%B0&q=%2F&next=https%3A%2F%2Fevil.example%2F&redirect=%2F%2Fevil.example';
  assert.equal(redirect('/chi-tiet-viec-lam.html' + query).headers.get('location'),
    newBase + 'chi-tiet-viec-lam.html' + query);
});

test('APIs, auth, protected administration, assets, and unknown paths stay on Sites', () => {
  for (const path of ['/api/content', '/api/admin/session', '/signin-with-chatgpt', '/signout-with-chatgpt',
    '/callback-with-chatgpt', '/quan-tri', '/quan-tri.html', '/quan-tri.html/anything', '/app.js',
    '/site.css', '/robots.txt', '/images/logo.png', '/unknown.html', '/nested/viec-lam.html']) {
    assert.equal(redirect(path), null, path);
    assert.equal(isPublicSitePageRequest(new Request(oldOrigin + path)), false, path);
    assert.equal(publicSiteRedirectPaths.includes(path), false, path);
  }
});

test('POST and every other non-reading method retain the original handler', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    for (const path of ['/', '/viec-lam.html']) {
      assert.equal(redirect(path, method), null, method + ' ' + path);
      assert.equal(isPublicSitePageRequest(new Request(oldOrigin + path, { method })), false);
    }
  }
});

test('only the original production host redirects, preventing preview changes and loops', () => {
  for (const origin of ['https://kenbinhoainam.github.io', 'http://localhost:3000',
    'https://preview.chatgpt.site', 'https://minh-duc-prototype.kenbinhoainam.chatgpt.site.evil.example',
    'https://minh-duc-prototype.kenbinhoainam.chatgpt.site:8443']) {
    assert.equal(redirect('/', 'GET', origin), null, origin);
  }
  assert.equal(redirect('/MinhDucWeb/viec-lam.html', 'GET', 'https://kenbinhoainam.github.io'), null);
});

test('unknown, encoded, and project-prefixed paths cannot produce arbitrary destinations', () => {
  for (const path of ['//evil.example/viec-lam.html', '/%2F%2Fevil.example', '/%76iec-lam.html',
    '/viec-lam.html/evil', '/MinhDucWeb/', '/MinhDucWeb/index.html', '/index.html%3Fnext=evil']) {
    assert.equal(redirect(path), null, path);
  }
  for (const path of publicSiteRedirectPaths) {
    const destination = new URL(redirect(path).headers.get('location'));
    assert.equal(destination.origin, 'https://kenbinhoainam.github.io');
    assert.ok(destination.pathname.startsWith('/MinhDucWeb/'));
    assert.equal(destination.pathname.split('MinhDucWeb').length - 1, 1);
  }
});
