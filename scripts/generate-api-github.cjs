const fs = require('fs');
const path = require('path');
const {
  DATA_CONTR_SUF,
  DATA_REPO_SUF,
  fetchRepo,
  fetchContributorsWait,
  summarizeData,
} = require('./lib/github-api.cjs');

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

const DATA_BASE = path.resolve(__dirname, '../static/data/api/api_github_com/');
const SUM_FILE = path.resolve(__dirname, '../static/data/generated_contributors.json');
const FILTER_FILE = path.resolve(__dirname, '../settings/community/contributor_filter.md');

async function fetchAll() {
  console.info('[generate-api-github] Generate repos');
  for (const r of GEN_REPOS) {
    await fetchRepo(r, DATA_BASE);
  }
  console.log();

  console.info('[generate-api-github] Generate contributors');
  await fetchContributorsWait(GEN_REPOS, DATA_BASE);

  console.info('[generate-api-github] Check generated data');
  for (const r of GEN_REPOS) {
    for (const gf of [
      path.resolve(DATA_BASE, `${r}${DATA_CONTR_SUF}`),
      path.resolve(DATA_BASE, `${r}${DATA_REPO_SUF}`),
    ]) {
      if (!fs.existsSync(gf)) {
        console.warn(`[generate-api-github] Missing data ${gf}`);
        console.info('[generate-api-github] Skip data summary');
        return;
      }
    }
  }

  await summarizeData(GEN_REPOS, DATA_BASE, SUM_FILE, FILTER_FILE);
  console.info('[generate-api-github] Generate finished');
}

fetchAll().catch((err) => {
  console.error('[generate-api-github] Uncaught Fatal:', err);
  process.exit(1);
});
