/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'src', 'generated', 'latest_pm.json');

function minimalStub() {
  return {
    channels: {
      stable: {
        version: 'latest',
        download_urls: {},
      },
    },
    generatedAt: new Date().toISOString(),
    source: 'local-stub',
    stub: true,
  };
}

function main() {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  if (fs.existsSync(OUT_FILE)) {
    console.log(`[generate-latest-pm-local] Skipping: ${OUT_FILE} already exists`);
    return;
  }

  fs.writeFileSync(OUT_FILE, `${JSON.stringify(minimalStub(), null, 2)}\n`, 'utf8');
  console.log(`[generate-latest-pm-local] Wrote stub ${OUT_FILE}`);
}

main();
