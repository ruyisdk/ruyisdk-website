const fs = require('fs');
const path = require('path');
// Prefer the global fetch available in Node 18+, otherwise fall back to node-fetch
let fetchFn;
if (typeof fetch !== 'undefined') {
  fetchFn = fetch;
} else {
  try {
    // node-fetch v2 supports require; if you use node-fetch v3 (ESM) prefer global fetch or install v2
    // eslint-disable-next-line global-require
    fetchFn = require('node-fetch');
  } catch (e) {
    console.error('No global fetch available and node-fetch is not installed.\n' +
      'Either run on Node 18+ (which provides global fetch), or install node-fetch: npm i node-fetch@2');
    process.exit(1);
  }
}

// Repos under ruyisdk org to aggregate contributors from
const repos = [
  'ruyi',
  'packages-index',
  'ruyi-backend',
  'ruyisdk-overlay',
  'ruyisdk-website',
  'support-matrix',
  'ruyi-packaging',
  'wechat-articles',
  'docs',
  'ruyisdk-eclipse-plugins',
];

const GITHUB_API_BASE = 'https://api.github.com/repos/ruyisdk';
const OUT_FILE = path.resolve(__dirname, '../src/pages/Community/generated_contributors.json');

async function fetchContributors() {
  const results = [];
  let totalCommits = 0;
  let totalPRs = 0;
  for (const r of repos) {
    const url = `${GITHUB_API_BASE}/${r}/contributors?per_page=100`;
    try {
      const headers = {};
      // allow optional token via env var
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
      }
      // include a user-agent for search API compatibility
      headers['User-Agent'] = 'ruyisdk-website-generator';
      const res = await fetchFn(url, { headers });
      if (!res.ok) {
        console.warn(`Failed to fetch ${url}: ${res.status}`);
        continue;
      }
      const json = await res.json();
      if (Array.isArray(json)) results.push(...json);
      // sum contributions from this repo to estimate commits
      if (Array.isArray(json)) {
        const repoSum = json.reduce((s, it) => s + (it.contributions || 0), 0);
        totalCommits += repoSum;
      }
      // Try to fetch pull request count via the search API (returns total_count)
      try {
        const searchUrl = `https://api.github.com/search/issues?q=repo:ruyisdk/${r}+type:pr`;
        const prRes = await fetchFn(searchUrl, { headers });
        if (prRes && prRes.ok) {
          const prJson = await prRes.json();
          if (typeof prJson.total_count === 'number') totalPRs += prJson.total_count;
        } else {
          // rate limited or blocked; just skip
        }
      } catch (err) {
        // ignore PR fetch errors per-repo
      }
    } catch (e) {
      console.warn(`Error fetching contributors for ${r}:`, e.message || e);
    }
  }

  // aggregate and dedupe by login
  const map = new Map();
  for (const c of results) {
    if (!c || !c.login) continue;
    const existing = map.get(c.login);
    if (existing) {
      existing.contributions = (existing.contributions || 0) + (c.contributions || 0);
    } else {
      map.set(c.login, {
        id: c.id || c.node_id || c.login,
        name: c.login,
        avatarUrl: c.avatar_url,
        github: c.html_url,
        contributions: c.contributions || 0,
      });
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => (b.contributions || 0) - (a.contributions || 0));

  // write minimal shape same as peoples_*.json expects
  const out = {
    coreTeam: [],
    interns: [],
    contributors: merged,
    totals: {
      contributors: map.size,
      commits: totalCommits,
      pullRequests: totalPRs,
    },
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${OUT_FILE} with ${merged.length} contributors`);
}

fetchContributors().catch((err) => {
  console.error('Failed to generate contributors:', err);
  process.exit(1);
});
