/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.ruyisdk.cn';
const API_LATEST_PM = '/releases/latest-pm';
const API_LATEST_VSCODE = '/releases/latest-ide/vscode';
const API_LATEST_ECLIPSE = '/releases/latest-ide/eclipse';
const API_DASHBOARD = '/fe/dashboard';
const OUT_FILE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'releases_latest_pm.json');
const OUT_FILE_VSCODE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'releases_latest_vscode.json');
const OUT_FILE_ECLIPSE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'releases_latest_eclipse.json');
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

function withGeneratedInfo(json, source) {
  return {
    ...json,

    // auto generate info
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source,
    },
  };
}

async function generateApiSnapshot({ name, endpoint, outputFile }) {
  const api = `${API_URL}${endpoint}`;
  const json = await apiFetch(api);
  if (!json || typeof json !== 'object') {
    console.error(`[generate-api-ruyisdk-cn] ${name} API return invalid JSON payload`);
    return false;
  }

  const data = withGeneratedInfo(json, api);
  fs.writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[generate-api-ruyisdk-cn] Updated ${outputFile}`);
  return true;
}

async function main() {
  try {
    const snapshots = [
      { name: 'releases/latest-pm', endpoint: API_LATEST_PM, outputFile: OUT_FILE },
      { name: 'releases/latest-ide/vscode', endpoint: API_LATEST_VSCODE, outputFile: OUT_FILE_VSCODE },
      { name: 'releases/latest-ide/eclipse', endpoint: API_LATEST_ECLIPSE, outputFile: OUT_FILE_ECLIPSE },
      { name: 'fe/dashboard', endpoint: API_DASHBOARD, outputFile: OUT_FILE_DASHBOARD },
    ];

    for (const snapshot of snapshots) {
      await generateApiSnapshot(snapshot);
    }
  } catch (err) {
    // why error?
    throw err;
  }
}

main().catch((e) => {
  console.error('[generate-api-ruyisdk-cn] Uncaught Fatal:', e);
  process.exitCode = 1;
});
