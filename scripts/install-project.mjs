import { spawnSync } from 'node:child_process';
import { readExecutionProfile } from './execution-profile.mjs';

// Retain the established pnpm lockfile on portable Windows and managed Linux.
const managed = readExecutionProfile() === 'managed-linux';
const cli = process.env.npm_execpath;
if (!managed && !cli) throw new Error('Run the project installer through pnpm run install:ci.');
const result = spawnSync(managed ? 'bash' : process.execPath,
  managed ? ['scripts/install-pnpm.sh'] : [cli, 'install', '--frozen-lockfile'],
  { stdio: 'inherit', env: { ...process.env, SHARP_IGNORE_GLOBAL_LIBVIPS: '1' } });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
