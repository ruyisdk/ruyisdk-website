/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.ruyisdk.cn/releases/latest-pm';
const OUT_FILE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'releases_latest_pm.json');

async function main() {

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
      console.error(`[generate-api-latest-pm] API return HTTP ${res.status} ${res.statusText}`);
      return
    }

    const json = await res.json();
    if (!json || typeof json !== 'object') {
      console.error('[generate-api-latest-pm] API return invalid JSON payload');
      return;
    }

    const data = {
      ...json,

      // auto generate info
      ruyisdk_org_data: {
        generatedAt: new Date().toISOString(),
        source: API_URL,
      },
    };

    fs.writeFileSync(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

    console.log(`[generate-api-latest-pm] Updated ${OUT_FILE}`);
  } catch (err) {
    // why error?
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((e) => {
  console.error('[generate-api-latest-pm] Uncaught Fatal:', e);
  process.exitCode = 1;
});
