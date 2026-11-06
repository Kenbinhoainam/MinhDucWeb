import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('M&E experience remains a requirement in all sample translations', () => {
  const scope = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync('public/demo-translations.js', 'utf8'), scope);
  const translate = scope.window.MDTranslate.content;
  for (const [lang, required, preferred] of [
    ['en', '1–3 years of relevant experience required.', 'preferred'],
    ['zh', '须有1–3年相关工作经验。', '优先'],
    ['ko', '관련 경력 1~3년 필수.', '우대'],
  ]) {
    const result = translate(lang, 'job', 'ky-su-co-dien', 'requirements');
    assert.ok(result.includes(required), `${lang}: ${result}`);
    assert.ok(!result.includes(preferred), `${lang} changed requirement into preference`);
  }
});
