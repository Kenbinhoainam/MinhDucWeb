import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const reviewOrigin = 'https://minh-duc-prototype.kenbinhoainam.chatgpt.site';
const legacyPage = '/tuyen-dung-noi-bo.html';
const html = readFileSync(new URL('../public' + legacyPage, import.meta.url), 'utf8');

test('the legacy jobs page has a canonical and a fallback link to the internal tab', () => {
  const robots = html.match(/<meta\b[^>]*\bname="robots"[^>]*\bcontent="([^"]+)"/)?.[1];
  assert.ok(robots?.split(/[,\s]+/).includes('noindex'));
  assert.match(html, /<a\b[^>]*\bhref="\/?viec-lam\.html\?tab=internal"/);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel="stylesheet"/i);
  const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/)?.[0];
  assert.equal(canonical?.match(/\bhref="([^"]+)"/)?.[1], reviewOrigin + '/viec-lam.html?tab=internal');
});

test('the legacy redirect keeps jobs state and replaces the URL with the same-origin internal tab', () => {
  const script = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'compatibility page contains a redirect script');
  const preserved = { q: 'kỹ sư & QC', lang: 'ko', preview: '1', sort: 'high', page: '2', saved: '1' };
  const query = new URLSearchParams({
    ...preserved, tab: 'worker', next: '//attacker.example', from: 'https://attacker.example/',
  });
  query.append('tab', 'worker');
  const location = new URL(legacyPage + '?' + query + '#jobResults', reviewOrigin);
  const navigations = [];
  location.replace = href => navigations.push(new URL(href, location));
  vm.runInNewContext(script, { location, URL, URLSearchParams });

  assert.equal(navigations.length, 1);
  const [destination] = navigations;
  assert.equal(destination.origin, location.origin);
  assert.equal(destination.pathname, '/viec-lam.html');
  assert.deepEqual(destination.searchParams.getAll('tab'), ['internal']);
  for (const [key, value] of Object.entries(preserved)) {
    assert.equal(destination.searchParams.get(key), value, key);
  }
  assert.equal(destination.hash, '#jobResults');
});
