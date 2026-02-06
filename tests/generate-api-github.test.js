const fs = require('fs');
const path = require('path');

// require script after environment variables are set in beforeEach (see below)

const CACHE_DIR = path.resolve(__dirname, '../scripts/cache');
const DATA_BASE = path.resolve(__dirname, '../static/data/api/api_github_com/');

function rmIfExists(p) { try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (e) {} }

beforeAll(() => {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (!fs.existsSync(DATA_BASE)) fs.mkdirSync(DATA_BASE, { recursive: true });
});

beforeEach(() => {
  // make tests fast by minimizing retries/delay
  process.env.GITHUB_MAX_RETRY = '1';
  process.env.GITHUB_RETRY_BASE_MS = '1';
});

afterEach(() => {
  // clean test artifacts
  rmIfExists(path.resolve(CACHE_DIR, `test_repo_repo.cached.json`));
  rmIfExists(path.resolve(CACHE_DIR, `test_repo_contributors.cached.json`));
  rmIfExists(path.resolve(DATA_BASE, `test_repo_repo.json`));
  rmIfExists(path.resolve(DATA_BASE, `test_repo_stats_contributors.json`));
});

test('200 responses should write cache and output', async () => {
  process.env.GITHUB_MAX_RETRY = '1';
  process.env.GITHUB_RETRY_BASE_MS = '1';
  const { fetchRepo, fetchContributors } = require('../scripts/generate-api-github.cjs');

  const mockFetch = jest.spyOn(global, 'fetch');

  // repo endpoint
  mockFetch.mockImplementationOnce(async (url) => {
    return {
      status: 200,
      json: async () => ({ visibility: 'public', stargazers_count: 1, forks_count: 2, subscribers_count: 3, open_issues_count: 4 }),
      headers: { get: () => undefined },
    };
  });

  // pulls endpoint
  mockFetch.mockImplementationOnce(async (url) => {
    return {
      status: 200,
      json: async () => ([]),
      headers: { get: () => undefined },
    };
  });

  // contributors endpoint
  mockFetch.mockImplementationOnce(async (url) => {
    return {
      status: 200,
      json: async () => ([{ total: 5, author: { login: 'a', id: 1, type: 'User', avatar_url: 'x', html_url: 'y' } }]),
      headers: { get: () => undefined },
    };
  });

  await fetchRepo('test_repo');
  await fetchContributors('test_repo');

  const repoCache = path.resolve(CACHE_DIR, 'test_repo_repo.cached.json');
  const contribCache = path.resolve(CACHE_DIR, 'test_repo_contributors.cached.json');
  const repoOut = path.resolve(DATA_BASE, 'test_repo_repo.json');
  const contribOut = path.resolve(DATA_BASE, 'test_repo_stats_contributors.json');

  expect(fs.existsSync(repoCache)).toBe(true);
  expect(fs.existsSync(contribCache)).toBe(true);
  expect(fs.existsSync(repoOut)).toBe(true);
  expect(fs.existsSync(contribOut)).toBe(true);

  mockFetch.mockRestore();
});

test('202 with cache should use cache as output', async () => {
  process.env.GITHUB_MAX_RETRY = '1';
  process.env.GITHUB_RETRY_BASE_MS = '1';
  const { fetchRepo, fetchContributors } = require('../scripts/generate-api-github.cjs');

  const repoCache = path.resolve(CACHE_DIR, 'test_repo_repo.cached.json');
  const contribCache = path.resolve(CACHE_DIR, 'test_repo_contributors.cached.json');
  const repoData = { data: { stargazers_count: 10, forks_count: 20, subscribers_count: 30, open_issues_count: 40, prs_count: 7 }, ruyisdk_org_data: { generatedAt: '2020' } };
  const contribData = { data: [{ total: 8, author: { login: 'b', id: 2, type: 'User', avatar_url: 'x', html_url: 'y' } }], ruyisdk_org_data: { generatedAt: '2020' } };
  fs.writeFileSync(repoCache, JSON.stringify(repoData, null, 2));
  fs.writeFileSync(contribCache, JSON.stringify(contribData, null, 2));

  const mockFetch = jest.spyOn(global, 'fetch');
  // repo endpoint: always 202
  mockFetch.mockImplementation(async (url) => ({ status: 202 }));

  await fetchRepo('test_repo');
  await fetchContributors('test_repo');

  const repoOut = path.resolve(DATA_BASE, 'test_repo_repo.json');
  const contribOut = path.resolve(DATA_BASE, 'test_repo_stats_contributors.json');

  expect(fs.existsSync(repoOut)).toBe(true);
  expect(fs.existsSync(contribOut)).toBe(true);

  const repoOutData = JSON.parse(fs.readFileSync(repoOut, 'utf8'));
  const contribOutData = JSON.parse(fs.readFileSync(contribOut, 'utf8'));

  expect(repoOutData.data.stargazers_count).toBe(10);
  expect(contribOutData.data[0].total).toBe(8);

  mockFetch.mockRestore();
});

test('202 with no cache should use fallback', async () => {
  process.env.GITHUB_MAX_RETRY = '1';
  process.env.GITHUB_RETRY_BASE_MS = '1';
  const { fetchRepo, fetchContributors } = require('../scripts/generate-api-github.cjs');

  // ensure caches are absent
  const repoCache = path.resolve(CACHE_DIR, 'test_repo_repo.cached.json');
  const contribCache = path.resolve(CACHE_DIR, 'test_repo_contributors.cached.json');
  rmIfExists(repoCache); rmIfExists(contribCache);

  // ensure fallback exists
  const fallback = path.resolve(CACHE_DIR, 'github-stats.fallback.json');
  fs.writeFileSync(fallback, JSON.stringify({ data: [], ruyisdk_org_data: { generatedAt: '1970' } }, null, 2));

  const mockFetch = jest.spyOn(global, 'fetch');
  mockFetch.mockImplementation(async () => ({ status: 202 }));

  await fetchRepo('test_repo');
  await fetchContributors('test_repo');

  const repoOut = path.resolve(DATA_BASE, 'test_repo_repo.json');
  const contribOut = path.resolve(DATA_BASE, 'test_repo_stats_contributors.json');

  expect(fs.existsSync(repoOut)).toBe(true);
  expect(fs.existsSync(contribOut)).toBe(true);

  const repoOutData = JSON.parse(fs.readFileSync(repoOut, 'utf8'));
  expect(Array.isArray(repoOutData.data)).toBe(true) || expect(repoOutData.data).toEqual([]);

  mockFetch.mockRestore();
});
