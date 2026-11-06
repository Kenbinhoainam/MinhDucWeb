import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/flagship-editorial.js', import.meta.url), 'utf8');
function load(script = source) {
  const scope = vm.createContext({ window: {} });
  vm.runInContext(script, scope);
  return scope.window.MDEditorial;
}
const renderer = load();
const fixtureScope = vm.createContext({ window: {} });
vm.runInContext(source.replace('  const articles = {', '  window.fixtures = { services, labels };\n  const articles = {'), fixtureScope);
const { services, labels } = fixtureScope.window.fixtures;
const serviceIds = ['supply', 'recruitment', 'factory', 'consulting'];
const locales = ['vi', 'en', 'zh', 'ko'];
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const titles = ['Sơ đồ phối hợp minh họa', 'Illustrative coordination blueprint', '协作流程示例', '협력 진행 예시'];
const notes = ['Ví dụ minh họa cách phối hợp; không phải kết quả thực tế của khách hàng.', 'Illustrative example of coordination; not real client results.', '协作方式示例，并非真实客户成果。', '협력 방식을 설명하는 예시이며 실제 고객 성과가 아닙니다.'];

for (const serviceId of serviceIds) {
  for (const [localeIndex, lang] of locales.entries()) {
    test(`${serviceId}/${lang}: visible, localized blueprint reuses each scenario once`, () => {
      const html = renderer.renderServiceDetail(serviceId, lang);
      const blueprints = [...html.matchAll(/<section class="md-service-blueprint">([\s\S]*?)<\/section>/g)];
      assert.equal(blueprints.length, 1);
      const blueprint = blueprints[0][1];
      assert.ok(blueprint.includes(`<h3 class="editorial-heading">${titles[localeIndex]}</h3>`));
      assert.ok(blueprint.includes(`<p class="editorial-note">${notes[localeIndex]}</p>`));
      assert.equal((blueprint.match(/class="md-blueprint-grid"/g) || []).length, 1);
      const stages = [...blueprint.matchAll(/<div class="md-blueprint-stage">([\s\S]*?)<\/div>/g)];
      assert.equal(stages.length, 3);
      for (const [i, key] of ['context', 'approach', 'decision'].entries()) {
        const content = escape(services[serviceId].scenario[i][localeIndex]);
        assert.equal(stages[i][1], `<span class="md-blueprint-step">${i + 1}</span><h4>${escape(labels[key][localeIndex])}</h4><p>${content}</p>`);
        assert.equal(html.split(content).length - 1, 1, 'scenario must not be repeated');
      }
      assert.doesNotMatch(blueprint, /<details|<summary|<button|<a\b|\bhidden\b|tabindex|role="button"/);
      assert.doesNotMatch(html, /editorial-scenario/);
      assert.equal((html.match(/<details\b/g) || []).length, 2);
      assert.ok(html.includes(`<summary>${escape(labels.outputs[localeIndex])}</summary>`));
      assert.ok(html.includes(`<summary>${escape(labels.coordination[localeIndex])}</summary>`));
      for (const key of ['client', 'team']) assert.ok(html.includes(escape(services[serviceId][key][localeIndex])));
      for (const check of services[serviceId].checks) assert.ok(html.includes(escape(check[localeIndex])));
    });
  }
}

test('blueprint data uses the fallback and caller-provided escaping paths', () => {
  const original = services.supply.scenario[0][1];
  const payload = `<img src=x onerror="alert('x')"> & example`;
  const altered = load(source.replace(`'${original}'`, JSON.stringify(payload)));
  const html = altered.renderServiceDetail('supply', 'en');
  assert.ok(html.includes(`<p>${escape(payload)}</p>`));
  assert.ok(!html.includes(payload));
  const calls = [];
  const custom = altered.renderServiceDetail('supply', 'en', value => {
    calls.push(value);
    return escape(value);
  });
  assert.ok(calls.includes(payload));
  assert.ok(calls.includes(titles[1]));
  assert.ok(calls.includes(notes[1]));
  assert.equal(custom, html);
});

test('locale variants, fallback and unknown services retain renderer behavior', () => {
  for (const id of serviceIds) {
    for (const lang of locales) {
      assert.equal(renderer.renderServiceDetail(id, `${lang.toUpperCase()}_XX`), renderer.renderServiceDetail(id, lang));
    }
    assert.equal(renderer.renderServiceDetail(id, 'unknown'), renderer.renderServiceDetail(id, 'vi'));
  }
  for (const id of ['unknown', '__proto__', 'constructor']) assert.equal(renderer.renderServiceDetail(id, 'en'), '');
});
