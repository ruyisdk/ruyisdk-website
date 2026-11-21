const { execFileSync } = require('node:child_process');
const {
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} = require('node:fs');
const path = require('node:path');
const site = path.resolve(__dirname, '..');
const out = path.join(site, 'static/device-runtime');
mkdirSync(out, { recursive: true });
const goRoot = execFileSync('go', ['env', 'GOROOT'], {
  encoding: 'utf8',
}).trim();
execFileSync(
  'go',
  [
    'build',
    '-mod=readonly',
    '-trimpath',
    '-ldflags=-s -w',
    '-o',
    path.join(out, 'device.wasm'),
    '.',
  ],
  {
    cwd: path.join(site, 'tools/device-runtime'),
    env: { ...process.env, GOOS: 'js', GOARCH: 'wasm' },
    stdio: 'inherit',
  },
);
const bootstrap = path.join(goRoot, 'lib/wasm/wasm_exec.js');
copyFileSync(bootstrap, path.join(out, 'wasm_exec.js'));
writeFileSync(
  path.join(site, 'static/device-worker.js'),
  [bootstrap, path.join(site, 'tools/device-runtime/worker.js')]
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n'),
);
const messages = path.join(site, 'news/ruyinews/messages.toml');
copyFileSync(messages, path.join(out, 'messages.toml'));
