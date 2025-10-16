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
  'ruyi-package-ci',
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
  // Helper: fetch and retry on 202 (GitHub stats endpoint may return 202 while computing)
  // Helper: fetch and retry on 202 (GitHub stats endpoint may return 202 while computing)
  async function fetchWith202Retry(url, headers, maxAttempts = 12) {
    let attempt = 0;
    let backoff = 1000; // start with 1s
    function jitter(ms) {
      return Math.floor(ms * (0.75 + Math.random() * 0.5));
    }
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const res = await fetchFn(url, { headers });
        if (res && res.status === 202) {
          // GitHub is computing the stats; wait and retry with jitter
          const wait = jitter(backoff);
          // console.log(`Stats for ${url} returning 202 (attempt ${attempt}), retrying in ${wait}ms`);
          await new Promise((resT) => setTimeout(resT, wait));
          backoff = Math.min(20000, backoff * 1.8);
          continue;
        }
        return res;
      } catch (err) {
        // network error, retry a few times
        if (attempt >= maxAttempts) throw err;
        const wait = jitter(backoff);
        await new Promise((resT) => setTimeout(resT, wait));
        backoff = Math.min(20000, backoff * 1.8);
      }
    }
    // exhausted attempts
    return null;
  }

  // Fallback: fetch contributors via the classic /contributors endpoint with pagination
  async function fetchContributorsFallback(repo, headers) {
    const items = [];
    let page = 1;
    try {
      while (page <= 10) { // safety cap to avoid infinite loops
        const url = `${GITHUB_API_BASE}/${repo}/contributors?per_page=100&page=${page}`;
        const res = await fetchFn(url, { headers });
        if (!res || !res.ok) break;
        const json = await res.json();
        if (!Array.isArray(json) || json.length === 0) break;
        items.push(...json);
        if (json.length < 100) break; // last page
        page += 1;
      }
    } catch (err) {
      // ignore and return what we have
    }
    return items;
  }

  // Helper to get PR count: prefer search API when token available, else try Link header on pulls endpoint
  async function getPRCount(repo, headers) {
    // If we have a token, search API is the most reliable
    if (process.env.GITHUB_TOKEN) {
      try {
        const searchUrl = `https://api.github.com/search/issues?q=repo:ruyisdk/${repo}+type:pr`;
        const prRes = await fetchFn(searchUrl, { headers });
        if (prRes && prRes.ok) {
          const prJson = await prRes.json();
          if (typeof prJson.total_count === 'number') return prJson.total_count;
        }
      } catch (err) {
        // fall through to the other method
      }
    }

    // Fallback: request pulls with per_page=1 and parse Link header for last page
    try {
      const pullsUrl = `https://api.github.com/repos/ruyisdk/${repo}/pulls?state=all&per_page=1`;
      const pRes = await fetchFn(pullsUrl, { headers });
      if (!pRes) return 0;
      if (!pRes.ok) return 0;
      const link = pRes.headers && (pRes.headers.get ? pRes.headers.get('link') : pRes.headers.Link || null);
      if (link) {
        // find last page number
        const m = link.match(/&?page=(\d+)>;\s*rel="last"/i);
        if (m && m[1]) return Number(m[1]);
      }
      // no link header - check body length
      const arr = await pRes.json();
      if (Array.isArray(arr)) return arr.length;
    } catch (err) {
      // ignore
    }
    return 0;
  }

  for (const r of repos) {
    // Use the repository statistics contributors endpoint which includes per-author totals
    const url = `${GITHUB_API_BASE}/${r}/stats/contributors`;
    try {
      const headers = {};
      if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
      }
      // Request JSON explicitly
      headers['User-Agent'] = 'ruyisdk-website-generator';
      headers.Accept = 'application/vnd.github.v3+json';

      let usedFallback = false;
      let json = null;
      const res = await fetchWith202Retry(url, headers);
      if (res && res.ok) {
        try {
          json = await res.json();
        } catch (err) {
          json = null;
        }
      }

      // If stats endpoint returned nothing useful, fall back to classic contributors endpoint
      if (!Array.isArray(json) || json.length === 0) {
        usedFallback = true;
        console.warn(`Stats endpoint empty or unavailable for ${r}, falling back to /contributors`);
        const fallback = await fetchContributorsFallback(r, headers);
        json = fallback;
      }

      if (!Array.isArray(json)) {
        // still nothing
        console.warn(`No contributor data available for ${r}`);
        continue;
      }

      // Two shapes possible:
      // - stats: [{ total, weeks:[], author: { ... } }, ...]
      // - contributors fallback: [{ login, contributions, avatar_url, html_url }, ...]
      let repoSum = 0;
      json.forEach((entry, idx) => {
        if (entry == null) return;
        if (!usedFallback) {
          const commits = Number(entry.total || 0);
          repoSum += commits;
          const author = entry.author || {};
          const login = author.login || author.name || `unknown-${r}-${idx}`;
          results.push({
            id: author.id || author.node_id || login,
            login,
            contributions: commits,
            avatar_url: author.avatar_url || null,
            html_url: author.html_url || null,
          });
        } else {
          // fallback shape from /contributors
          const commits = Number(entry.contributions || 0);
          repoSum += commits;
          const login = entry.login || entry.name || `unknown-${r}-${idx}`;
          results.push({
            id: entry.id || entry.node_id || login,
            login,
            contributions: commits,
            avatar_url: entry.avatar_url || null,
            html_url: entry.html_url || null,
          });
        }
      });

      totalCommits += repoSum;

      // PR count try
      try {
        const count = await getPRCount(r, headers);
        if (typeof count === 'number') totalPRs += count;
      } catch (err) {
        // ignore
      }
    } catch (e) {
      console.warn(`Error fetching stats contributors for ${r}:`, e.message || e);
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
