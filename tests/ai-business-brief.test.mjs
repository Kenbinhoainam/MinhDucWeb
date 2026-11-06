import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../public/ai-business-brief.js', import.meta.url), 'utf8');
const window = {};
runInNewContext(source, {window});
const parse = value => ({...window.MDAIBusinessBrief.parse(value)});
const empty = {count:'', area:'', industry:'', shift:'', start:''};

test('staffing demo reads five allowlisted fields from Vietnamese sample descriptions', () => {
  assert.deepEqual(parse('Cần 120 công nhân điện tử ở Bắc Ninh, làm ca luân phiên, bắt đầu trong 2 tuần tới.'), {
    count:'120', area:'bn', industry:'electronic', shift:'rotating', start:'two-weeks',
  });
  assert.deepEqual(parse('Can 35 nhan vien kho tai Ha Noi, lam ca dem, du kien bat dau trong thang toi.'), {
    count:'35', area:'hn', industry:'warehouse', shift:'night', start:'month',
  });
  assert.deepEqual(parse('Cần 1.200 lao động cơ khí tại Bắc Giang, giờ hành chính, bắt đầu sau 2 tháng.'), {
    count:'1200', area:'bg', industry:'mechanical', shift:'day', start:'later',
  });
});

test('ambiguous, negated or unsupported details stay unknown while clear fields remain', () => {
  assert.deepEqual(parse('Bắc Ninh hoặc Bắc Giang, khoảng 50 đến 80 công nhân điện tử, không làm ca đêm. Bắt đầu ngày 17/12.'), {
    ...empty, industry:'electronic',
  });
  assert.deepEqual(parse('Cần 40 người, ca ngày hoặc ca đêm, khu vực Hải Dương, chưa chốt lịch.'), {
    ...empty, count:'40',
  });
  assert.deepEqual(parse('Cần lao động dệt may, chưa rõ Bắc Ninh, bắt đầu ngày mai.'), {
    ...empty, industry:'other', start:'two-weeks',
  });
});

test('multiword negation is scoped to its clause and affirmative corrections remain usable', () => {
  assert.deepEqual(parse('Cần 50 người tại Hà Nội, không làm việc ca đêm.'), {
    ...empty, count:'50', area:'hn',
  });
  assert.deepEqual(parse('Không cần tuyển 50 người tại Hà Nội.'), empty);
  assert.deepEqual(parse('Không cần tuyển: 50 người.'), empty);
  assert.deepEqual(parse('Cần 50 người ở Bắc Ninh, chưa thể bắt đầu trong 2 tuần tới.'), {
    ...empty, count:'50', area:'bn',
  });
  assert.deepEqual(parse('Không cần tuyển 50 người nhưng cần 60 người ở Bắc Giang, không làm ca đêm mà làm ca ngày.'), {
    ...empty, count:'60', area:'bg', shift:'day',
  });
  assert.deepEqual(parse('Ca đêm không phù hợp. Cần 50 người, bắt đầu trong tháng tới.'), {
    ...empty, count:'50', start:'month',
  });
});

test('per-shift, approximate and out-of-range counts are not promoted to exact totals', () => {
  for (const description of [
    'Mỗi ca cần 60 người.',
    'Cần 50 người mỗi ca.',
    'Cần 50 người/ca.',
    'Cần 50 - 70 người.',
    'Cần 50 / 70 người.',
    'Cần xấp xỉ 50 người.',
    'Cần ít nhất 50 người.',
    'Cần 40 người ca ngày, 25 người ca đêm.',
    'Cần 1.5 người.',
    'Cần 1.000.000 người.',
    'Liên hệ 0901234567 người.',
  ]) assert.equal(parse(description).count, '', description);
  assert.equal(parse('Tổng cộng 120 người, mỗi ca cần 60 người.').count, '120');
  assert.equal(parse('Cần 999.999 người.').count, '999999');
});

test('fresh parsing does not reuse old fields or return raw description text', () => {
  assert.equal(parse('Cần 120 công nhân điện tử ở Bắc Ninh.').count, '120');
  assert.deepEqual(parse(''), empty);
  assert.deepEqual(parse('Liên hệ TEST-PRIVATE <img src=x onerror=alert(1)>'), empty);
  assert.deepEqual(parse('x'.repeat(500) + ' Cần 40 người Bắc Ninh.'), empty);
  assert.deepEqual(parse('Kho vận'), {...empty, industry:'warehouse'});
});

// Model the runtime replacing the form before the assistant's mutation callback.
class TestElement {
  children = [];
  listeners = {};
  attrs = {};
  dataset = {};
  value = '';
  className = '';
  textContent = '';
  open = false;
  constructor(tagName) { this.tagName = tagName; }
  append(...nodes) { this.children.push(...nodes); }
  prepend(node) { this.children.unshift(node); }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() {}
  addEventListener(type, handler) { this.listeners[type] = handler; }
  emit(type) { this.listeners[type]?.(); }
  matches(selector) {
    return selector.split(',').some(rule => {
      if (rule[0] === '#') return this.id === rule.slice(1);
      if (rule[0] === '.') return this.className.split(' ').includes(rule.slice(1));
      if (rule === '[data-wb-extension]') return Object.hasOwn(this.dataset, 'wbExtension');
      if (rule === '[data-ai-business-brief]') return Object.hasOwn(this.dataset, 'aiBusinessBrief');
      return this.tagName === rule;
    });
  }
  querySelector(selector) {
    for (const child of this.children) {
      if (child.matches(selector)) return child;
      const nested = child.querySelector(selector);
      if (nested) return nested;
    }
    return null;
  }
}

function localeHarness() {
  const browser = {};
  const workforceSource = readFileSync(new URL('../public/workforce-brief.js', import.meta.url), 'utf8');
  runInNewContext(workforceSource, {window:browser});
  function createForm() {
    const form = new TestElement('form'), extension = new TestElement('div');
    form.id = 'staffingCalculator';
    extension.dataset.wbExtension = '';
    form.append(extension);
    return form;
  }
  let form = createForm(), reconcile;
  browser.document = {
    documentElement:{lang:'vi'}, readyState:'complete',
    createElement:tag => new TestElement(tag),
    querySelector:selector => form.matches(selector) ? form : null,
  };
  browser.MutationObserver = class {
    constructor(callback) { reconcile = callback; }
    observe() {}
  };
  runInNewContext(source, {window:browser});
  return {
    current:() => form.querySelector('[data-ai-business-brief]'),
    switchTo(language) {
      const oldForm = form;
      form = createForm();
      browser.document.documentElement.lang = language;
      reconcile([{type:'childList', addedNodes:[form], removedNodes:[oldForm]}]);
    },
  };
}

test('locale remount retains an edited draft and prevents copying a stale one', () => {
  const app = localeHarness();
  const control = (panel, key) => panel.querySelector('#md-ai-business-brief-' + key);
  const generate = panel => panel.querySelector('.md-ai-brief-primary');
  let panel = app.current();
  panel.open = true;
  control(panel, 'description').value = 'Cần 50 người ở Bắc Ninh.';
  generate(panel).emit('click');
  control(panel, 'count').value = '62';

  app.switchTo('en');
  panel = app.current();
  let preview = panel.querySelector('.md-ai-brief-preview');
  assert.equal(panel.dataset.aiBusinessBrief, 'en');
  assert.equal(panel.open, true);
  assert.equal(control(panel, 'description').value, 'Cần 50 người ở Bắc Ninh.');
  assert.equal(control(panel, 'count').value, '62');
  assert.equal(preview.hidden, false);
  assert.equal(preview.querySelector('button').disabled, false);

  control(panel, 'description').value = 'Cần 25 người ở Hà Nội.';
  control(panel, 'description').emit('input');
  app.switchTo('zh-CN');
  panel = app.current();
  preview = panel.querySelector('.md-ai-brief-preview');
  assert.equal(panel.dataset.aiBusinessBrief, 'zh');
  assert.equal(control(panel, 'description').value, 'Cần 25 người ở Hà Nội.');
  assert.equal(preview.hidden, true);
  assert.equal(preview.querySelector('button').disabled, true);
  generate(panel).emit('click');
  assert.equal(control(panel, 'count').value, '25');
  assert.equal(control(panel, 'area').value, 'hn');
  assert.equal(preview.querySelector('button').disabled, false);
});
