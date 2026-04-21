/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const API_URL = 'https://ruyisdk.cn/tags.json';
const OUT_FILE = path.join(__dirname, '..', 'static', 'data', 'api', 'api_ruyisdk_cn', 'tags_hot.json');
const MAX_TAGS = 64;

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
      console.error(`[generate-api-hot-tags] API return HTTP ${res.status} ${res.statusText}`);
      return;
    }

    const json = await res.json();
    const tags = Array.isArray(json?.tags) ? json.tags : [];

    const data = tags
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: item.id,
        name: item.name || item.text || '',
        slug: item.slug || item.name || item.text || '',
        count: Number(item.count) || 0,
      }))
      .filter((item) => item.id && item.name && item.slug)
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_TAGS)
      .map((item) => ({
        ...item,
        url: `https://ruyisdk.cn/tag/${item.slug}/${item.id}`,
      }));

    const output = {
      data,
      ruyisdk_org_data: {
        generatedAt: new Date().toISOString(),
        source: API_URL,
      },
    };

    fs.writeFileSync(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    console.log(`[generate-api-hot-tags] Updated ${OUT_FILE} (${data.length} tags)`);
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((e) => {
  console.error('[generate-api-hot-tags] Uncaught Fatal:', e);
  process.exitCode = 1;
});
