const { execFileSync } = require('node:child_process');
const path = require('node:path');
const site = path.resolve(__dirname, '..');
execFileSync(
  process.execPath,
  [
    path.join(site, 'tools/device-runtime/scripts/build-runtime.mjs'),
    '--static',
    path.join(site, 'static'),
    '--messages',
    path.join(site, 'news/ruyinews/messages.toml'),
  ],
  { stdio: 'inherit' },
);
