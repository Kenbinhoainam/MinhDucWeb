import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/comparison-shifts.js', import.meta.url), 'utf8');
const detailHref = id => `chi-tiet-viec-lam.html?id=${encodeURIComponent(id)}&lang=vi`;

function element(tagName) {
  const attributes = new Map();
  const classes = new Set();
  return {
    tagName, classes, children: [], textContent: '',
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); },
    append(...children) { this.children.push(...children); },
    insertBefore(child, before) { this.children.splice(before ? this.children.indexOf(before) : this.children.length, 0, child); },
    querySelector(selector) {
      return this.children.find(child => selector === '[data-comparison-shift]' && child.getAttribute('data-comparison-shift') === '');
    },
    classList: { toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    get firstElementChild() { return this.children[0]; },
    get lastElementChild() { return this.children.at(-1); }
  };
}

function fixture(jobs) {
  const columns = [];
  const data = { lang: 'vi', jobs };
  let observer;
  const document = {
    body: {}, documentElement: { lang: 'vi' }, readyState: 'complete',
    createElement: element, querySelectorAll: () => columns
  };
  const window = {
    location: { href: 'https://example.test/site/viec-lam.html?lang=vi' },
    MDPrototypeBridge: { snapshot: () => data }
  };
  runInNewContext(source, {
    window, document, URL,
    MutationObserver: class {
      constructor(callback) { observer = callback; }
      observe() {}
    }
  });

  return {
    open(...hrefs) {
      columns.length = 0;
      for (const href of hrefs) {
        const list = element('dl');
        list.append(...['income', 'location', 'benefits', 'cv'].map(element));
        const anchor = element('a');
        anchor.setAttribute('href', href);
        columns.push({ querySelector: selector => selector === ':scope > dl' ? list : anchor });
      }
      observer([{ type: 'childList', addedNodes: [{ querySelector: selector => selector === '.v14-compare-dialog' }] }]);
      return columns.map(column => column.querySelector(':scope > dl'));
    },
    changeLocale(locale) {
      data.lang = locale;
      document.documentElement.lang = locale;
      observer([{ type: 'attributes', target: document.documentElement }]);
    }
  };
}

function shiftRow(list) {
  assert.deepEqual(list.children.map(child => child.tagName), ['income', 'location', 'div', 'benefits', 'cv']);
  const row = list.querySelector('[data-comparison-shift]');
  assert.deepEqual(row.children.map(child => child.tagName), ['dt', 'dd']);
  return row;
}

test('shows the four exact shift codes from the job matched by its local detail link', () => {
  const encodedId = 'factory?line=<a>&name=đêm';
  const view = fixture([
    { id: encodedId, shift: 'day' }, { id: '2', shift: 'night' },
    { id: '3', shift: 'rotating' }, { id: '4', shift: 'flexible' }
  ]);
  const first = view.open(detailHref(encodedId), detailHref('2'), detailHref('3'));
  assert.deepEqual(first.map(list => shiftRow(list).lastElementChild.textContent), ['Ca ngày', 'Ca đêm', 'Ca luân phiên']);
  const second = view.open(detailHref('4'), detailHref('2'));
  assert.deepEqual(second.map(list => shiftRow(list).lastElementChild.textContent), ['Ca linh hoạt', 'Ca đêm']);
});

test('keeps the row in place across locale updates and ignores hints, unsafe values, and foreign links', () => {
  const view = fixture([
    { id: 'hint', description: 'Ca ngày', tags: ['Ca ngày'], preferences: { shift: 'day' }, min: 12 },
    { id: 'markup', shift: '<img src=x onerror=alert(1)>' },
    { id: 'exact', shift: 'day' }, { id: 'case', shift: 'DAY' }, { id: 'prototype', shift: 'constructor' }
  ]);
  const lists = view.open(detailHref('hint'), detailHref('markup'), 'https://foreign.test/site/chi-tiet-viec-lam.html?id=exact');
  const rows = lists.map(shiftRow);
  for (const [lang, label, fallback] of [
    ['vi', 'Ca làm', 'Chưa công bố · cần xác nhận'],
    ['en', 'Shift', 'Unpublished · confirm with recruiter'],
    ['zh', '班次', '尚未公布 · 请确认'],
    ['ko', '근무조', '미공개 · 확인 필요']
  ]) {
    view.changeLocale(lang);
    for (const [index, list] of lists.entries()) {
      const row = shiftRow(list);
      assert.equal(row, rows[index]);
      assert.equal(row.firstElementChild.textContent, label);
      assert.equal(row.lastElementChild.textContent, fallback);
      assert.equal(row.lastElementChild.classes.has('md-compare-shift-unknown'), true);
    }
  }
  const other = view.open(detailHref('case'), detailHref('prototype'), detailHref('exact')).map(shiftRow);
  assert.deepEqual(other.map(row => row.lastElementChild.textContent), ['미공개 · 확인 필요', '미공개 · 확인 필요', '주간 근무']);
  assert.equal(other[2].lastElementChild.classes.has('md-compare-shift-unknown'), false);
});
