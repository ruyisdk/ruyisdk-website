/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = process.env.RUYI_LATEST_PM_API || 'https://api.ruyisdk.cn/releases/latest-pm';
const FAST_MIRROR_RELEASES_URL = 'https://fast-mirror.isrc.ac.cn/ruyisdk/ruyi/releases/';
const GITHUB_RELEASES_BASE = 'https://github.com/ruyisdk/ruyi/releases/download/';
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
    source: FAST_MIRROR_RELEASES_URL,
    stub: true,
  };
}

function normalizeVersion(value) {
  if (!value) return '';
  return value.replace(/^v/i, '').trim();
}

function compareSemver(a, b) {
  const aNorm = normalizeVersion(a);
  const bNorm = normalizeVersion(b);

  const [aMain, aPre] = aNorm.split('-');
  const [bMain, bPre] = bNorm.split('-');

  const aParts = aMain.split('.').map((part) => parseInt(part, 10));
  const bParts = bMain.split('.').map((part) => parseInt(part, 10));

  const maxLen = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < maxLen; i += 1) {
    const left = Number.isFinite(aParts[i]) ? aParts[i] : 0;
    const right = Number.isFinite(bParts[i]) ? bParts[i] : 0;
    if (left !== right) return left - right;
  }

  if (!aPre && bPre) return 1;
  if (aPre && !bPre) return -1;
  if (aPre && bPre) return aPre.localeCompare(bPre);
  return 0;
}

function buildMirrorDownloadUrls(version) {
  const base = `${FAST_MIRROR_RELEASES_URL}${version}/`;
  return {
    'linux/x86_64': [
      `${GITHUB_RELEASES_BASE}${version}/ruyi-${version}.amd64`,
      `${base}ruyi-${version}.amd64`,
    ],
    'linux/aarch64': [
      `${GITHUB_RELEASES_BASE}${version}/ruyi-${version}.arm64`,
      `${base}ruyi-${version}.arm64`,
    ],
    'linux/riscv64': [
      `${GITHUB_RELEASES_BASE}${version}/ruyi-${version}.riscv64`,
      `${base}ruyi-${version}.riscv64`,
    ],
  };
}

async function fetchLatestFromFastMirror(signal) {
  const res = await fetch(FAST_MIRROR_RELEASES_URL, {
    headers: { accept: 'text/html' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Fast mirror HTTP ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const matches = Array.from(html.matchAll(/href="([0-9][^\/]*?)\/?"/g));
  const versions = matches
    .map((match) => match[1])
    .map((value) => value.replace(/\/$/, '').trim())
    .filter((value) => /^\d+(?:\.\d+){1,}(?:[-\w\.]+)?$/.test(value));

  if (!versions.length) {
    throw new Error('Fast mirror listing has no version entries');
  }

  versions.sort(compareSemver);
  const latest = versions[versions.length - 1];

  return {
    channels: {
      stable: {
        version: latest,
        channel: 'stable',
        release_date: new Date().toISOString(),
        download_urls: buildMirrorDownloadUrls(latest),
      },
    },
    generatedAt: new Date().toISOString(),
    source: FAST_MIRROR_RELEASES_URL,
    stub: false,
  };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    try {
      const mirrorPayload = await fetchLatestFromFastMirror(controller.signal);
      fs.writeFileSync(OUT_FILE, `${JSON.stringify(mirrorPayload, null, 2)}\n`, 'utf8');
      console.log(`[generate-latest-pm] Wrote ${OUT_FILE} (fast mirror)`);
    } catch (mirrorErr) {
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
        console.log(`[generate-latest-pm] Wrote ${OUT_FILE} (API fallback)`);
      } catch (err) {
        throw new Error(`Fast mirror failed (${mirrorErr?.message || mirrorErr}); API fallback failed (${err?.message || err})`);
      }
    }
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
