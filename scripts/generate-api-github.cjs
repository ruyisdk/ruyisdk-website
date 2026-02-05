const fs = require('fs');
const path = require('path');

// Repos under ruyisdk org to aggregate contributors from
const GEN_REPOS = [
  // ruyi pm
  'ruyi',
  'packages-index',
  'ruyi-backend',
  // ruyi pm packaging
  'ruyi-packaging',
  'ruyi-package-ci',
  'ruyisdk-overlay',
  // RuyiSDK community
  'wechat-articles',
  'docs',
  'ruyisdk-website',
  // RuyiSDK IDEs
  'ruyisdk-eclipse-plugins',
  'ruyisdk-vscode-extension',
  // misc
  'support-matrix',
];

const GITHUB_API_BASE = 'https://api.github.com/repos/ruyisdk';
const DATA_BASE = path.resolve(__dirname, '../static/data/api/api_github_com/');
const DATA_CONTR_SUF = '_stats_contributors.json';
const DATA_REPO_SUF = '_repo.json';
const SUM_FILE = path.resolve(__dirname, '../static/data/generated_contributors.json');
const FILTER_FILE = path.resolve(__dirname, '../settings/community/contributor_filter.md');

// Cache/fallback
const CACHE_DIR = path.resolve(__dirname, 'cache');
const FALLBACK_FILE = path.resolve(CACHE_DIR, 'github-stats.fallback.json');

const MAX_RETRY = Number(process.env.GITHUB_MAX_RETRY || 5);
const BASE_DELAY = Number(process.env.GITHUB_RETRY_BASE_MS || 1000);
const RETRY_FACTOR = Number(process.env.GITHUB_RETRY_FACTOR || 2);

const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_202 = process.argv.includes('--force-202-mock');

function ensureCacheDir() {
  try { if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true }); } catch (e) { /* ignore */ }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url) {
  if (FORCE_202) {
    console.warn('[generate-api-github] --force-202-mock active, simulating 202 response for', url);
    return { ok: false, status: 202 };
  }

  let attempt = 0;
  let lastErr = null;
  while (attempt < MAX_RETRY) {
    attempt++;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const headers = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'ruyisdk-website-generator',
      };
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      const res = await fetch(url, { headers, signal: controller.signal });
      clearTimeout(timeout);

      if (res.status === 202) {
        console.warn(`[generate-api-github] API ${url} returned 202 Accepted (background processing). attempt=${attempt}`);
        // retry after backoff
        const delay = BASE_DELAY * Math.pow(RETRY_FACTOR, attempt - 1);
        await sleep(delay);
        continue;
      }

      if (res.status >= 500) {
        console.warn(`[generate-api-github] API ${url} returned ${res.status} (server error). attempt=${attempt}`);
        const delay = BASE_DELAY * Math.pow(RETRY_FACTOR, attempt - 1);
        await sleep(delay);
        continue;
      }

      if (res.status !== 200) {
        // treat 4xx as non-retriable but do not write empty output
        console.error(`[generate-api-github] API ${url} returned HTTP ${res.status} ${res.statusText}`);
        return { ok: false, status: res.status };
      }

      const json = await res.json();
      if (!json || typeof json !== 'object') {
        console.error(`[generate-api-github] API ${url} returned invalid JSON payload`);
        return { ok: false, status: res.status };
      }

      return { ok: true, status: res.status, data: json, headers: res.headers };

    } catch (err) {
      clearTimeout(timeout);
      lastErr = err;
      console.warn(`[generate-api-github] Error fetching ${url} (attempt ${attempt}): ${err.message || err}`);
      const delay = BASE_DELAY * Math.pow(RETRY_FACTOR, attempt - 1);
      await sleep(delay);
      continue;
    }
  }

  console.error(`[generate-api-github] Exhausted retries for ${url}. last error: ${lastErr && (lastErr.message || lastErr)}`);
  return { ok: false, status: 0, error: lastErr };
}

function cachePathFor(repo, type) {
  // type: 'repo' | 'contributors'
  return path.resolve(CACHE_DIR, `${repo}_${type}.cached.json`);
}

function writeFileIfNotDryRun(filePath, content) {
  if (DRY_RUN) { console.info('[generate-api-github] DRY RUN - would write:', filePath); return; }
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
}

async function fetchRepo(repo) {
  const url = `${GITHUB_API_BASE}/${repo}`;
  const res = await fetchWithRetry(url);
  const fn = path.resolve(DATA_BASE, `${repo}${DATA_REPO_SUF}`);
  ensureCacheDir();
  const cpath = cachePathFor(repo, 'repo');

  if (res.ok) {
    const rd = res.data;
    if (typeof rd.visibility !== 'string' || rd.visibility !== 'public') {
      console.info(`[generate-api-github] Skip ${repo} (not public)`);
      return;
    }

    const opr = await fetchPRs(repo);

    const data = {
      data: {
        stargazers_count: rd.stargazers_count,
        forks_count: rd.forks_count,
        subscribers_count: rd.subscribers_count,
        open_issues_count: rd.open_issues_count,
        prs_count: opr,
      },
      ruyisdk_org_data: { generatedAt: new Date().toISOString(), source: url },
    };

    // update cache and final output
    try { writeFileIfNotDryRun(cpath, data); } catch (e) { console.warn('[generate-api-github] Failed to write cache', e); }
    try { writeFileIfNotDryRun(fn, data); } catch (e) { console.warn('[generate-api-github] Failed to write output', e); }

    console.log(`[generate-api-github] Update ${repo}`);
    return;
  }

  // fallback behavior
  if (fs.existsSync(cpath)) {
    const cached = JSON.parse(fs.readFileSync(cpath, 'utf8'));
    console.warn(`[generate-api-github] Using cached repo data for ${repo}`);
    try { writeFileIfNotDryRun(fn, cached); } catch (e) { console.warn('[generate-api-github] Failed to write output from cache', e); }
    return;
  }

  if (fs.existsSync(FALLBACK_FILE)) {
    const fallback = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
    console.warn(`[generate-api-github] Using fallback data for ${repo}`);
    try { writeFileIfNotDryRun(fn, fallback); } catch (e) { console.warn('[generate-api-github] Failed to write output from fallback', e); }
    return;
  }

  console.error(`[generate-api-github] No cache or fallback available for ${repo}; skipping. (status=${res.status})`);
}

async function fetchContributors(repo) {
  const url = `${GITHUB_API_BASE}/${repo}/stats/contributors`;
  const res = await fetchWithRetry(url);
  const fn = path.resolve(DATA_BASE, `${repo}${DATA_CONTR_SUF}`);
  ensureCacheDir();
  const cpath = cachePathFor(repo, 'contributors');

  if (res.ok) {
    const rd = res.data;
    if (!Array.isArray(rd)) {
      console.warn(`[generate-api-github] ${repo} contributors API returned non-array`);
      return;
    }

    const json = [];
    for (const c of rd) {
      if (!c.author || typeof c.author !== 'object') {
        console.warn('[generate-api-github] Skip contributor without author');
        continue;
      }
      if (typeof c.author.type !== 'string' || c.author.type !== 'User') {
        console.warn(`[generate-api-github] Skip contributor by type ${c.author.type}`);
        continue;
      }

      json.push({
        total: c.total,
        author: { login: c.author.login, id: c.author.id, avatar_url: c.author.avatar_url, html_url: c.author.html_url },
      });
    }

    const data = { data: json, ruyisdk_org_data: { generatedAt: new Date().toISOString(), source: url } };
    try { writeFileIfNotDryRun(cpath, data); } catch (e) { console.warn('[generate-api-github] Failed to write cache', e); }
    try { writeFileIfNotDryRun(fn, data); } catch (e) { console.warn('[generate-api-github] Failed to write output', e); }

    console.log(`[generate-api-github] Update ${repo}`);
    return;
  }

  // fallback path
  if (fs.existsSync(cpath)) {
    const cached = JSON.parse(fs.readFileSync(cpath, 'utf8'));
    console.warn(`[generate-api-github] Using cached contributors for ${repo}`);
    try { writeFileIfNotDryRun(fn, cached); } catch (e) { console.warn('[generate-api-github] Failed to write output from cache', e); }
    return;
  }

  if (fs.existsSync(FALLBACK_FILE)) {
    const fallback = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
    console.warn(`[generate-api-github] Using fallback contributors for ${repo}`);
    try { writeFileIfNotDryRun(fn, fallback); } catch (e) { console.warn('[generate-api-github] Failed to write output from fallback', e); }
    return;
  }

  console.error(`[generate-api-github] No cache or fallback available for ${repo}; skipping contributors. (status=${res.status})`);
}

async function fetchPRs(repo) {
  const url = `${GITHUB_API_BASE}/${repo}/pulls?state=all&per_page=1`;
  const res = await fetchWithRetry(url);

  if (res.ok) {
    const rd = res.data;
    const rh = res.headers;
    if (!Array.isArray(rd)) {
      console.warn(`[generate-api-github] ${repo} API response not array`);
      return;
    }

    const link = rh.get && rh.get('link');
    if (link) {
      const m = link.match(/&?page=(\d+)>;\s*rel="last"/i);
      if (m && m[1]) return Number(m[1]);
    } else {
      return rd.length;
    }
  }

  // not OK - try cached PR count from repo cache
  const cpath = cachePathFor(repo, 'repo');
  if (fs.existsSync(cpath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cpath, 'utf8'));
      return cached.data && cached.data.prs_count;
    } catch (e) { /* ignore */ }
  }

  return undefined;
}

async function summarizeData() {
  let commits = 0;        // total contributor commits
  let pull_requests = 0;  // total pull requests (status=all)
  let issues = 0;         // total open issues (issue+pr)
  let stars = 0;          // total stars
  let forks = 0;          // total forks
  let watches = 0;        // total watches
  const contributors = new Map();

  for (const r of GEN_REPOS) {
    const contrib = path.resolve(DATA_BASE, `${r}${DATA_CONTR_SUF}`);
    const stats = path.resolve(DATA_BASE, `${r}${DATA_REPO_SUF}`);

    const con_json = JSON.parse(fs.readFileSync(contrib, 'utf8'));
    const stat_json = JSON.parse(fs.readFileSync(stats, 'utf8'));

    for (const c of con_json.data) {
      const cobj = contributors.get(c.author.id);
      if (cobj) {
        cobj.contributions += c.total;
      } else {
        contributors.set(c.author.id, {
          id: c.author.id,
          name: c.author.login,
          avatarUrl: c.author.avatar_url,
          github: c.author.html_url,
          contributions: c.total,
        });
      }

      commits += c.total;
    }

    stars += stat_json.data.stargazers_count;
    forks += stat_json.data.forks_count;
    watches += stat_json.data.subscribers_count;
    issues += stat_json.data.open_issues_count;
    pull_requests += stat_json.data.prs_count;
  }

  const contributor_merged = Array.from(contributors.values()).sort((a, b) => b.contributions - a.contributions);

  // Apply filters from settings/community/contributor_filter.md
  const filters = loadFilters();
  let contributor_filtered = contributor_merged;
  if (filters.length) {
    const before = contributor_merged.length;
    const removed = [];
    contributor_filtered = contributor_merged.filter((c) => {
      const hit = isFiltered(c.name || '', filters);
      if (hit) removed.push(c.name);
      return !hit;
    });
    if (removed.length) {
      console.log(`[contributors] Excluded by filter (${removed.length}): ${removed.join(', ')}`);
    }
    console.log(`[contributors] ${before} -> ${contributor_filtered.length} after filtering`);
  }

  const out = {
    coreTeam: [],
    interns: [],
    contributors: contributor_filtered,
    totals: {
      contributors: contributor_filtered.length,
      commits: commits,
      pullRequests: pull_requests,
      issues: issues,
      stars: stars,
      forks: forks,
      watches: watches,
    },
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: 'https://ruyisdk.org/contributors',
    },
  };

  fs.writeFileSync(SUM_FILE, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${SUM_FILE} with ${contributor_filtered.length} contributors`);
}


function loadFilters() {
  const patterns = [];
  try {
    if (!fs.existsSync(FILTER_FILE)) return patterns;
    const raw = fs.readFileSync(FILTER_FILE, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const s = (line || '').trim();
      if (!s || s.startsWith('#')) return;
      try {
        patterns.push(new RegExp(s, 'i'));
      } catch (e) {
        console.warn(`[contributors] Invalid regex in filter file skipped: ${s}`);
      }
    });
  } catch (e) {
    console.warn('[contributors] Failed to read filter file:', e.message || e);
  }
  return patterns;
}


function isFiltered(name, patterns) {
  if (!name || !patterns || patterns.length === 0) return false;
  return patterns.some((re) => {
    try { return re.test(name); } catch { return false; }
  });
}


async function fetchAll() {

  console.info('[generate-api-github] Generate repos');
  for (const r of GEN_REPOS) {
    await fetchRepo(r);
  }
  console.log()

  console.info('[generate-api-github] Generate contributors');
  for (const r of GEN_REPOS) {
    await fetchContributors(r);
  }

  console.info('[generate-api-github] Check generated data');
  for (const r of GEN_REPOS) {
    for (const gf of [path.resolve(DATA_BASE, `${r}${DATA_CONTR_SUF}`),
      path.resolve(DATA_BASE, `${r}${DATA_REPO_SUF}`), ])
      if (!fs.existsSync(gf)) {
        console.warn(`[generate-api-github] Missing data ${gf}`);
        console.info(`[generate-api-github] Skip data summary`);
        return;
      }
  }

  await summarizeData();

  console.info('[generate-api-github] Generate finished');
}

module.exports = { fetchWithRetry, fetchRepo, fetchContributors, fetchPRs, fetchAll };

if (require.main === module) {
  fetchAll().then(() => process.exit(0)).catch((err) => {
    console.error('[generate-api-github] Uncaught Fatal:', err);
    // Prefer non-failing builds on transient GitHub issues; exit 1 only on unexpected errors
    process.exit(0);
  });
}
