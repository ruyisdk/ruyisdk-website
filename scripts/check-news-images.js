/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const glob = require('glob');
const matter = require('gray-matter');

function parseArgs() {
  const strict = process.argv.includes('--strict');
  return { strict };
}

function isAbsoluteUrl(url) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function resolveToStaticFile(imagePath) {
  if (!imagePath) return null;

  // allow external images
  if (isAbsoluteUrl(imagePath)) return null;

  // Normalize: strip query/hash
  const clean = String(imagePath).split(/[?#]/)[0];

  // Docusaurus: many places use "/img/..." which maps to "static/img/..."
  // Also allow "img/...".
  let rel = clean;
  if (rel.startsWith('/')) rel = rel.slice(1);

  // Only check files that live under static/
  if (!rel.startsWith('img/')) return null;

  return path.join(__dirname, '..', 'static', rel);
}

function readPngSize(filePath) {
  // Minimal PNG IHDR parser (no deps)
  const b = fs.readFileSync(filePath);
  // Signature: 89 50 4E 47 0D 0A 1A 0A
  if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') {
    return null;
  }
  const width = b.readUInt32BE(16);
  const height = b.readUInt32BE(20);
  return { width, height };
}

function main() {
  const { strict } = parseArgs();

  // One glob is enough: *.md matches *.en.md / *.de.md too.
  // Normalize to forward slashes for consistent Windows glob behavior.
  const pattern = path
    .join(__dirname, '..', 'news', 'articles', '*.md')
    .replace(/\\/g, '/');

  const files = glob.sync(pattern, { nodir: true });
  if (files.length === 0) {
    console.log('[check-news-images] No news article files found.');
    return;
  }

  const problems = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const fm = matter(raw);
    const image = fm?.data?.image;

    if (!image) continue;

    const staticFile = resolveToStaticFile(image);
    if (!staticFile) continue;

    if (!fs.existsSync(staticFile)) {
      problems.push({
        file,
        image,
        message: `Missing image file: ${path.relative(process.cwd(), staticFile)}`,
        severity: 'error',
      });
      continue;
    }

    const ext = path.extname(staticFile).toLowerCase();

    // Basic guardrails to avoid layout issues:
    // - extremely large images hurt perf and cause visible jank
    // - extreme aspect ratios tend to look broken in thumbnails
    if (ext === '.png') {
      const size = readPngSize(staticFile);
      if (!size) {
        problems.push({
          file,
          image,
          message: `Not a valid PNG: ${path.relative(process.cwd(), staticFile)}`,
          severity: 'warn',
        });
        continue;
      }

      const { width, height } = size;
      const ratio = width / height;

      if (width < 200 || height < 120) {
        problems.push({
          file,
          image,
          message: `Image too small (${width}x${height}): ${path.relative(process.cwd(), staticFile)}`,
          severity: 'warn',
        });
      }

      if (width > 4096 || height > 4096) {
        problems.push({
          file,
          image,
          message: `Image very large (${width}x${height}), consider resizing: ${path.relative(process.cwd(), staticFile)}`,
          severity: 'warn',
        });
      }

      if (ratio < 0.5 || ratio > 3) {
        problems.push({
          file,
          image,
          message: `Extreme aspect ratio (${ratio.toFixed(2)}) for thumbnail: ${path.relative(process.cwd(), staticFile)}`,
          severity: 'warn',
        });
      }
    }
  }

  if (problems.length === 0) {
    console.log('[check-news-images] OK');
    return;
  }

  console.log('[check-news-images] Found issues:');
  for (const p of problems) {
    const rel = path.relative(process.cwd(), p.file);
    console.log(`- [${p.severity}] ${rel}`);
    console.log(`  image: ${p.image}`);
    console.log(`  ${p.message}`);
  }

  if (strict && problems.some((p) => p.severity === 'error')) {
    process.exitCode = 1;
  }
}

main();
