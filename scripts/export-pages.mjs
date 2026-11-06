import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(project, 'dist', 'pages');
const siteUrl = new URL(process.env.MD_PUBLIC_SITE_URL || 'https://kenbinhoainam.github.io/MinhDucWeb/');
if (!['https:', 'http:'].includes(siteUrl.protocol) || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash) {
  throw new Error('MD_PUBLIC_SITE_URL must be an HTTP(S) site URL without credentials, query or fragment.');
}
siteUrl.pathname = siteUrl.pathname.replace(/\/+$/, '') + '/';

await fs.rm(output, { recursive: true, force: true });
// Server code, private-pages, credentials and repository files are never exported.
await fs.cp(path.join(project, 'public'), output, { recursive: true });
await fs.rm(path.join(output, 'quan-tri.html'), { force: true });
execFileSync(process.execPath, ['scripts/build-static.mjs', '--unminified'], {
  cwd: project,
  stdio: 'inherit',
  env: { ...process.env, MD_STATIC_OUTPUT_DIR: output, MD_PUBLIC_SITE_URL: siteUrl.href },
});
await fs.writeFile(path.join(output, '.nojekyll'), '');
console.log(`GitHub Pages export: ${output}\nPublic URL: ${siteUrl.href}`);
