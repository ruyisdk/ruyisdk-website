const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const ROOT_DIR = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT_DIR, 'package.json');

// Dependencies that are used via CLI, configuration files, or Docusaurus runtime
const ALWAYS_USED = new Set([
  '@docusaurus/core',
  '@docusaurus/preset-classic',
  '@docusaurus/theme-common',
  '@docusaurus/theme-mermaid',
  '@mdx-js/react',
  'cross-env',
  'docusaurus-plugin-sass',
  'dotenv-cli',
  'prism-react-renderer',
  'react',
  'react-dom',
  'sass',
]);

function getSourceFiles() {
  const patterns = [
    'src/**/*.{js,jsx,ts,tsx,md,mdx}',
    'scripts/**/*.{js,cjs,mjs,ts}',
    'docusaurus.config.js',
  ];
  return patterns.flatMap((pat) =>
    glob.sync(pat, { cwd: ROOT_DIR, nodir: true }),
  );
}

function checkDepsUsage() {
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const deps = Object.keys(pkg.dependencies || {});
  const sourceFiles = getSourceFiles();
  const fileContents = sourceFiles.map((file) =>
    fs.readFileSync(path.join(ROOT_DIR, file), 'utf8'),
  );

  const unused = [];

  for (const dep of deps) {
    if (ALWAYS_USED.has(dep)) continue;

    const regex = new RegExp(
      `(['"\`])${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:/.*)?\\1`,
    );

    const isReferenced = fileContents.some((content) => regex.test(content));
    if (!isReferenced) {
      unused.push(dep);
    }
  }

  if (unused.length === 0) {
    console.log('[check-deps-usage] OK - All declared dependencies are in active use.');
    return true;
  }

  console.warn(`[check-deps-usage] Found ${unused.length} potentially unused dependencies:`);
  unused.forEach((d) => console.warn(`- ${d}`));
  return false;
}

checkDepsUsage();
