import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const project = fileURLToPath(new URL('../', import.meta.url));

test('Pages export regenerates portable public files without framework dependencies', () => {
  const base = 'https://kenbinhoainam.github.io/MinhDucWeb/';
  execFileSync(process.execPath, ['scripts/export-pages.mjs'], {
    cwd: project, env: { ...process.env, MD_PUBLIC_SITE_URL: base }, stdio: 'pipe',
  });
  const output = path.join(project, 'dist/pages');
  assert.ok(fs.existsSync(path.join(output, '.nojekyll')));
  for (const file of ['quan-tri.html', 'private-pages', 'worker', '.env', '.openai']) {
    assert.equal(fs.existsSync(path.join(output, file)), false, file);
  }
  const runtime = fs.readFileSync(path.join(output, 'site-runtime.js'), 'utf8');
  new Script(runtime);
  assert.ok(runtime.includes(fs.readFileSync(path.join(project, 'public/seo-preview.js'), 'utf8')));
  for (const file of fs.readdirSync(output).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(output, file), 'utf8');
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical) assert.ok(canonical.startsWith(base), `${file}: ${canonical}`);
    for (const [, reference] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      const url = new URL(reference.replaceAll('&amp;', '&'), base + file);
      if (url.origin !== new URL(base).origin || !['https:', 'http:'].includes(url.protocol)) continue;
      assert.ok(url.pathname.startsWith('/MinhDucWeb/'), `${file}: escaped deployment path: ${reference}`);
      const local = decodeURIComponent(url.pathname.slice('/MinhDucWeb/'.length)) || 'index.html';
      assert.ok(fs.statSync(path.join(output, local), { throwIfNoEntry: false })?.isFile(), `${file}: missing ${reference}`);
    }
  }
});
