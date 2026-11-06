import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const scope = vm.createContext({ window: { MD14: { services: [] } }, URLSearchParams });
vm.runInContext(fs.readFileSync(new URL('../public/flagship-content.js', import.meta.url), 'utf8'), scope);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const empty = () => '';
const jobs = [
  { open: true, type: 'worker', location: 'Bắc Ninh & vùng lân cận' },
  { open: true, type: 'worker', location: 'Bắc Ninh & vùng lân cận' },
  { open: true, type: 'worker', location: '<Hà Nội>' },
  { open: false, type: 'worker', location: 'Closed area' },
  { open: true, type: 'internal', location: 'Internal area' },
];

function render(lang) {
  return scope.window.MDFlagship.render('home', {
    getData: () => ({ home: { sections: {} }, jobs }), getLang: () => lang,
    C: value => value, V: empty, T: value => value, E: escape, I: empty,
    localize: () => '', sectionHead: empty, cardJob: empty, cardPost: empty,
    galleryHTML: empty, videoBlock: empty, emptyJobs: empty, partnerSection: empty,
    serviceExplorer: empty, staffingCalculator: empty, crumb: empty, imgSrc: value => value,
  });
}

test('location discovery includes only unique open worker areas and preserves every locale', () => {
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    const html = render(lang);
    const navigation = html.match(/<nav class="md-area-links"[^>]*>(.*?)<\/nav>/s)?.[1];
    assert.ok(navigation);
    const links = [...navigation.matchAll(/href="([^"]+)"/g)];
    assert.equal(links.length, 2);
    const destinations = links.map(match => new URL(match[1].replaceAll('&amp;', '&'), 'https://example.test'));
    assert.deepEqual(destinations.map(url => url.searchParams.get('area')), [jobs[0].location, jobs[2].location]);
    for (const url of destinations) {
      assert.equal(url.pathname, '/viec-lam.html');
      assert.equal(url.searchParams.get('lang'), lang);
    }
    assert.ok(navigation.includes('&lt;Hà Nội>'));
    assert.ok(!navigation.includes('<Hà Nội>'));
    assert.ok(!navigation.includes('Closed area'));
    assert.ok(!navigation.includes('Internal area'));
  }
});
