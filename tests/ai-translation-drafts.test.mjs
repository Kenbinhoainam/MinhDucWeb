import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL('../public/' + file, import.meta.url), 'utf8');
const seed = JSON.parse(fs.readFileSync(new URL('../lib/content-seed.json', import.meta.url), 'utf8'));
const context = vm.createContext({
  window: {}, document: { readyState: 'loading', body: { dataset: { page: 'admin' } }, addEventListener() {} },
  localStorage: { getItem: () => null }, sessionStorage: { getItem: () => null }, structuredClone,
  location: { href: 'https://example.test/cms-demo.html' }, URL, URLSearchParams
});
for (const file of ['demo-translations.js', 'v13-copy.js', 'v14-copy.js', 'locale-routing.js', 'flagship-content.js', 'flagship-editorial.js']) {
  vm.runInContext(read(file), context);
}
vm.runInContext(read('app.js').replace('wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();', ''), context);
vm.runInContext(read('ai-translation-drafts.js'), context);
const { findSample, readContext, applyDraft } = context.window.MDTranslationDrafts;

test('suggestions use the matching source fixtures for home, jobs and posts in EN/ZH/KO', () => {
  const fixtures = [
    { kind: 'home', id: 'main', key: 'heroLine1', source: seed.home.heroLine1 },
    { kind: 'job', id: 'cn-dien-tu', key: 'description', source: seed.jobs.find(job => job.id === 'cn-dien-tu').description },
    { kind: 'post', id: 'xu-huong-kcn', key: 'title', source: seed.posts.find(post => post.id === 'xu-huong-kcn').title }
  ];
  for (const fixture of fixtures) {
    const translations = ['en', 'zh', 'ko'].map(lang => findSample({ ...fixture, lang }));
    assert.equal(new Set(translations).size, 3);
    for (const value of translations) {
      assert.ok(value);
      assert.notEqual(value, fixture.source);
    }
    assert.equal(findSample({ ...fixture, lang: 'vi' }), '');
    assert.equal(findSample({ ...fixture, lang: 'en', source: fixture.source + ' Nội dung đã chỉnh.' }), '');
    assert.equal(findSample({ ...fixture, lang: 'en', id: 'new-record' }), '');
  }
});

function editor(targetValue = 'Human-edited target') {
  const source = { value: 'Nội dung tự viết', matches: () => true };
  const form = { id: 'jobEditForm', elements: { namedItem: () => source } };
  const select = { value: 'en' };
  const target = { value: targetValue, form, dataset: { l10nKey: 'title' }, matches: () => false };
  const targets = [target];
  const panel = {
    isConnected: true, dataset: { l10nKind: 'job', l10nId: 'record-a', l10nFields: 'title' },
    closest: () => form, querySelector: () => select, querySelectorAll: () => targets
  };
  return { panel, source, select, target, targets };
}

test('manual drafts only fill the selected target after consent to replace a human edit', () => {
  const { panel, target, source } = editor();
  const draft = readContext(panel, 'title');
  assert.equal(applyDraft(panel, draft, '', true), 'invalid');
  assert.equal(applyDraft(panel, draft, source.value, true), 'invalid');
  assert.equal(applyDraft(panel, draft, target.value, false), 'unchanged');
  assert.equal(applyDraft(panel, draft, 'Edited draft', false), 'replace');
  assert.equal(target.value, 'Human-edited target');
  assert.equal(applyDraft(panel, draft, 'Edited draft', true), 'applied');
  assert.equal(target.value, 'Edited draft');
  assert.equal(source.value, 'Nội dung tự viết');

  const empty = editor('');
  assert.equal(applyDraft(empty.panel, readContext(empty.panel, 'title'), 'First translation', false), 'applied');
  assert.equal(empty.target.value, 'First translation');
});

test('changed source, target, language or record invalidates the draft before writing', () => {
  for (const change of [
    ({ source }) => { source.value += ' đã sửa'; },
    ({ target }) => { target.value = 'New human edit'; },
    ({ target }) => { target.readOnly = true; },
    ({ target, targets }) => { targets[0] = { ...target }; },
    ({ target, targets }) => { targets.push({ ...target }); },
    ({ select }) => { select.value = 'ko'; },
    ({ panel }) => { panel.dataset.l10nId = 'record-b'; },
    ({ panel }) => { panel.isConnected = false; }
  ]) {
    const fixture = editor();
    const draft = readContext(fixture.panel, 'title');
    change(fixture);
    const before = fixture.target.value;
    assert.equal(applyDraft(fixture.panel, draft, 'Stale draft', true), 'stale');
    assert.equal(fixture.target.value, before);
  }
});
