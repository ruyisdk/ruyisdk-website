/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.ruyisdk.cn';
const API_LATEST_PM = "/releases/latest-pm";
const API_DASHBOARD = "/fe/dashboard";
const OUT_FILE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'releases_latest_pm.json');
const OUT_FILE_DASHBOARD = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'fe_dashboard.json');

async function apiFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`[generate-api-ruyisdk-cn] API return HTTP ${res.status} ${res.statusText}`);
      return
    }

    return await res.json()

  } catch (err) {
    // why error?
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {

  try {
    // release/latest_pm
    let api = API_URL+API_LATEST_PM
    let json = await apiFetch(api);
    if (!json || typeof json !== 'object') {
      console.error('[generate-api-latest-pm] API return invalid JSON payload');
      return;
    }

    let data = {
      ...json,

      // auto generate info
      ruyisdk_org_data: {
        generatedAt: new Date().toISOString(),
        source: api,
      },
    };

    fs.writeFileSync(OUT_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

    console.log(`[generate-api-latest-pm] Updated ${OUT_FILE}`);

    // fe/dashboard
    api = API_URL+API_DASHBOARD
    json = await apiFetch(api);
    if (!json || typeof json !== 'object') {
      console.error('[generate-api-latest-pm] API return invalid JSON payload');
      return;
    }

    data = {
      ...json,

      // auto generate info
      ruyisdk_org_data: {
        generatedAt: new Date().toISOString(),
        source: api,
      },
    };

    fs.writeFileSync(OUT_FILE_DASHBOARD, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

    console.log(`[generate-api-latest-pm] Updated ${OUT_FILE_DASHBOARD}`);
  } catch (err) {
    // why error?
    throw err;
  }
}

main().catch((e) => {
  console.error('[generate-api-ruyisdk-cn] Uncaught Fatal:', e);
  process.exitCode = 1;
});
