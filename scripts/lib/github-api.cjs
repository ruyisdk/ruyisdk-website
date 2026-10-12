const fs = require('fs');
const path = require('path');
const { fetchJsonWithTimeout } = require('./fetch-with-timeout.cjs');
const { loadFilters, isFiltered } = require('./contributor-filters.cjs');

const GITHUB_API_BASE = 'https://api.github.com/repos/ruyisdk';
const DATA_CONTR_SUF = '_stats_contributors.json';
const DATA_REPO_SUF = '_repo.json';

async function fetchGitHubApi(url) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ruyisdk-website-generator',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return await fetchJsonWithTimeout(url, {
    headers,
    logPrefix: '[generate-api-github]',
  });
}

async function fetchPRs(repo) {
  const url = `${GITHUB_API_BASE}/${repo}/pulls?state=all&per_page=1`;
  const raw = await fetchGitHubApi(url);

  if (!raw || typeof raw !== 'object' || raw.code !== 200) {
    console.warn(`[generate-api-github] Skip ${repo}`);
    return;
  }
  const rd = raw.data;
  const rh = raw.headers;
  if (!Array.isArray(rd)) {
    console.warn(`[generate-api-github] ${repo} API response not array`);
    return;
  }

  const link = rh?.get ? rh.get('link') : null;
  if (link) {
    const m = link.match(/&?page=(\d+)>;\s*rel="last"/i);
    if (m && m[1]) return Number(m[1]);
  }
  return rd.length;
}

async function fetchRepo(repo, dataBase) {
  const url = `${GITHUB_API_BASE}/${repo}`;
  const raw = await fetchGitHubApi(url);

  if (!raw || typeof raw !== 'object' || raw.code !== 200) {
    console.info(`[generate-api-github] Skip ${repo}`);
    return;
  }

  const fn = path.resolve(dataBase, `${repo}${DATA_REPO_SUF}`);
  const rd = raw.data;

  if (typeof rd.visibility !== 'string' || rd.visibility !== 'public') {
    console.info(`[generate-api-github] Skip ${repo}`);
  }

  const opr = await fetchPRs(repo);
  if (!opr || typeof opr !== 'number') {
    console.warn(`[generate-api-github] Skip ${repo} due to fetchPRs ${opr}`);
  }

  const data = {
    data: {
      stargazers_count: rd.stargazers_count,
      forks_count: rd.forks_count,
      subscribers_count: rd.subscribers_count,
      open_issues_count: rd.open_issues_count,
      prs_count: opr,
    },
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: url,
    },
  };

  fs.writeFileSync(fn, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[generate-api-github] Update ${repo}`);
}

async function writeContributors(repo, url, raw, dataBase) {
  const fn = path.resolve(dataBase, `${repo}${DATA_CONTR_SUF}`);
  const rd = raw.data || [];
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
      author: {
        login: c.author.login,
        id: c.author.id,
        avatar_url: c.author.avatar_url,
        html_url: c.author.html_url,
      },
    });
  }

  const data = {
    data: json,
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: url,
    },
  };

  fs.writeFileSync(fn, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[generate-api-github] Update ${repo}`);
}

async function fetchContributorsWait(repos, dataBase) {
  const reposWrote = new Set();
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  let tryTime = 0;

  while (repos.length !== reposWrote.length) {
    for (const repo of repos) {
      if (reposWrote.has(repo)) {
        continue;
      }

      const url = `${GITHUB_API_BASE}/${repo}/stats/contributors`;
      const raw = await fetchGitHubApi(url);

      if (!raw || typeof raw !== 'object') {
        console.info(`[generate-api-github] Skip ${repo}`);
        reposWrote.add(repo);
        continue;
      }

      if (raw.code === 403) {
        console.info(`[generate-api-github] Skip ${repo} due to 403 ${JSON.stringify(raw)}`);
        continue;
      }

      if (raw.code === 202) {
        console.info(`[generate-api-github] Will retry ${repo}`);
        continue;
      }

      reposWrote.add(repo);
      await writeContributors(repo, url, raw, dataBase);
    }

    tryTime += 1;
    if (tryTime > 5) {
      console.warn('[generate-api-github] Wait more than 20min');
      break;
    }

    console.info('[generate-api-github] Sleep wait 4.2min');
    await sleep(4200 * 60);
  }
}

async function summarizeData(repos, dataBase, sumFile, filterFile) {
  let commits = 0;
  let pullRequests = 0;
  let issues = 0;
  let stars = 0;
  let forks = 0;
  let watches = 0;
  const contributors = new Map();

  for (const r of repos) {
    const contrib = path.resolve(dataBase, `${r}${DATA_CONTR_SUF}`);
    const stats = path.resolve(dataBase, `${r}${DATA_REPO_SUF}`);

    const conJson = JSON.parse(fs.readFileSync(contrib, 'utf8'));
    const statJson = JSON.parse(fs.readFileSync(stats, 'utf8'));

    for (const c of conJson.data || []) {
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

    stars += statJson.data.stargazers_count;
    forks += statJson.data.forks_count;
    watches += statJson.data.subscribers_count;
    issues += statJson.data.open_issues_count;
    pullRequests += statJson.data.prs_count;
  }

  const contributorMerged = Array.from(contributors.values()).sort(
    (a, b) => b.contributions - a.contributions,
  );

  const filters = loadFilters(filterFile);
  let contributorFiltered = contributorMerged;
  if (filters.length) {
    const before = contributorMerged.length;
    const removed = [];
    contributorFiltered = contributorMerged.filter((c) => {
      const hit = isFiltered(c.name || '', filters);
      if (hit) removed.push(c.name);
      return !hit;
    });
    if (removed.length) {
      console.log(
        `[contributors] Excluded by filter (${removed.length}): ${removed.join(', ')}`,
      );
    }
    console.log(`[contributors] ${before} -> ${contributorFiltered.length} after filtering`);
  }

  const out = {
    coreTeam: [],
    interns: [],
    contributors: contributorFiltered,
    totals: {
      contributors: contributorFiltered.length,
      commits,
      pullRequests,
      issues,
      stars,
      forks,
      watches,
    },
    ruyisdk_org_data: {
      generatedAt: new Date().toISOString(),
      source: 'https://ruyisdk.org/contributors',
    },
  };

  fs.writeFileSync(sumFile, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${sumFile} with ${contributorFiltered.length} contributors`);
}

module.exports = {
  GITHUB_API_BASE,
  DATA_CONTR_SUF,
  DATA_REPO_SUF,
  fetchGitHubApi,
  fetchPRs,
  fetchRepo,
  writeContributors,
  fetchContributorsWait,
  summarizeData,
};
