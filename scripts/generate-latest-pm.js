/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = process.env.RUYI_LATEST_PM_API || 'https://api.ruyisdk.cn/releases/latest-pm';
const OUT_FILE = path.join(__dirname, '..', 'static', 'data', 'latest_pm.json');

function minimalStub() {
  return {
    channels: {
      stable: {
        version: 'latest',
        download_urls: {},
      },
    },
    generatedAt: new Date().toISOString(),
    source: API_URL,
    stub: true,
  };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(API_URL, {
      headers: {
        accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid JSON payload');
    }

    // Basic shape guard: keep build stable even if API changes
    const safe = {
      ...minimalStub(),
      ...json,
      generatedAt: new Date().toISOString(),
      source: API_URL,
      stub: false,
    };

    fs.writeFileSync(OUT_FILE, `${JSON.stringify(safe, null, 2)}\n`, 'utf8');
    console.log(`[generate-latest-pm] Wrote ${OUT_FILE}`);
  } catch (err) {
    // If an old file exists, keep it to avoid breaking builds.
    if (fs.existsSync(OUT_FILE)) {
      console.warn(`[generate-latest-pm] Failed (${err?.message || err}); keeping existing ${OUT_FILE}`);
      return;
    }

    const stub = minimalStub();
    fs.writeFileSync(OUT_FILE, `${JSON.stringify(stub, null, 2)}\n`, 'utf8');
    console.warn(`[generate-latest-pm] Failed (${err?.message || err}); wrote stub ${OUT_FILE}`);
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((e) => {
  console.error('[generate-latest-pm] Fatal:', e);
  process.exitCode = 1;
});
