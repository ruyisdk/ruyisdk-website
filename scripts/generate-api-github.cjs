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


async function fetchGitHubApi(url) {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ruyisdk-website-generator',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(url, {
      headers: headers,
      signal: controller.signal,
    });

    if (res.status !== 200) {
      console.warn(`[generate-api-github] API ${url} return HTTP ${res.status} ${res.statusText}`);
      return {data: null, headers: res.headers, code: res.status};
    }

    const json = await res.json();
    if (!json || typeof json !== 'object') {
      console.error(`[generate-api-github] API ${url} return invalid JSON payload`);
      return null;
    }

    return {data: json, headers: res.headers, code: res.status};

  } catch (err) {
    console.error('[generate-api-github] Unexcepted error in fetchGitHubApi: ', err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}


async function fetchRepo(repo) {
  const url = `${GITHUB_API_BASE}/${repo}`;
  const raw = await fetchGitHubApi(url)

  if (!raw || typeof raw !== 'object' || raw.code !== 200) {
    console.info(`[generate-api-github] Skip ${repo}`);
    return;
  }

  const fn = path.resolve(DATA_BASE, `${repo}${DATA_REPO_SUF}`);
  const rd = raw.data

  if (typeof rd.visibility !== 'string' || rd.visibility !== 'public') {
    console.info(`[generate-api-github] Skip ${repo}`);
  }

  const opr = await fetchPRs(repo)
  if (!opr || typeof opr !== 'number') {
    console.warn(`[generate-api-github] Skip ${repo} due to fetchPRs ${opr}`)
  }

  const data = {
    data: {
      stargazers_count: rd.stargazers_count, // stars
      forks_count: rd.forks_count, // forks
      subscribers_count: rd.subscribers_count, // watches
      open_issues_count: rd.open_issues_count, // open issues+PRs
      prs_count: opr,  // all PRs
    },

    // auto generate info
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: url,
    },
  };

  fs.writeFileSync(fn, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(`[generate-api-github] Update ${repo}`);
}


async function fetchContributorsWait(repos) {
  const repos_wrote = new Set();
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  let try_time = 0;

  while (repos.length !== repos_wrote.length) {
    for (const repo of repos) {
      if (repos_wrote.has(repo)) {
        continue
      }

      const url = `${GITHUB_API_BASE}/${repo}/stats/contributors`;
      const raw = await fetchGitHubApi(url)

      if (!raw || typeof raw !== 'object') {
        console.info(`[generate-api-github] Skip ${repo}`);
        repos_wrote.add(repo);
        continue;
      }

      if (raw.code === 202) {
        // wait and retry
        console.info(`[generate-api-github] Will retry ${repo}`);
        continue;
      }

      repos_wrote.add(repo);
      await writeContributors(repo, url, raw);
    }

    try_time += 1;
    if (try_time >= 10) {
      console.warn(`[generate-api-github] Wait more than 10min`)
      break;
    }

    console.info(`[generate-api-github] Sleep wait 1min`)
    await sleep(1000 * 60); // 1 min
  }
}


async function writeContributors(repo, url, raw) {
  const fn = path.resolve(DATA_BASE, `${repo}${DATA_CONTR_SUF}`);
  const rd = raw.data
  const json = []
  // - stats: [{ total, weeks:[], author: { ... } }, ...]
  for (const c of rd) {
    if (!c.author || typeof c.author !== 'object') {
      console.warn('[generate-api-github] Skip contributor without author');
      continue
    }
    if (typeof c.author.type !== 'string' || c.author.type !== 'User') {
      console.warn(`[generate-api-github] Skip contributor by type ${c.author.type}`);
      continue
    }

    json.push({
      total: c.total,
      author: {
        login: c.author.login,
        id: c.author.id,
        avatar_url: c.author.avatar_url,
        html_url: c.author.html_url,
      }
    });
  }

  const data = {
    data: json,

    // auto generate info
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: url,
    },
  };

  fs.writeFileSync(fn, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(`[generate-api-github] Update ${repo}`);
}


async function fetchPRs(repo) {
  const url = `${GITHUB_API_BASE}/${repo}/pulls?state=all&per_page=1`;
  const raw = await fetchGitHubApi(url);

  if (!raw || typeof raw !== 'object' || raw.code !== 200) {
    console.warn(`[generate-api-github] Skip ${repo}`);
    return;
  }
  const rd = raw.data
  const rh = raw.headers
  if (!Array.isArray(rd)) {
    console.warn(`[generate-api-github] ${repo} API response not array`);
    return;
  }

  const link = rh.get('link');
  if (link) {
    // find last page number
    const m = link.match(/&?page=(\d+)>;\s*rel="last"/i);
    if (m && m[1]) return Number(m[1]);
  } else {
    return rd.length;
  }

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
  await fetchContributorsWait(GEN_REPOS);

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

fetchAll().catch((err) => {
  console.error('[generate-api-github] Uncaught Fatal:', err);
  process.exit(1);
});
