const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT_DIR = path.resolve(__dirname, '..');
const METADATA_FILE = path.join(ROOT_DIR, 'src/components/News/Blogs/metadata.js');
const BLOGS_DIR = path.join(ROOT_DIR, 'src/components/News/Blogs');
const BLOG_PAGES_DIR = path.join(ROOT_DIR, 'src/pages/news/blogs');

function parseMetadata() {
  const content = fs.readFileSync(METADATA_FILE, 'utf8');
  // Simple extractor for BLOG_ARTICLES array
  const match = content.match(/export const BLOG_ARTICLES = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('Failed to parse BLOG_ARTICLES in metadata.js');
  }

  // Evaluate JSON-like array safely
  const rawArrayStr = match[1];
  try {
    const fn = new Function(`return ${rawArrayStr}`);
    return fn();
  } catch (err) {
    throw new Error(`Failed to evaluate BLOG_ARTICLES: ${err.message}`);
  }
}

function checkBlogMetadata() {
  const problems = [];
  const articles = parseMetadata();
  const registeredSlugs = new Set(articles.map((a) => a.slug));

  console.log(`[check-blog-metadata] Checking ${articles.length} blog articles...`);

  // 1. Check registered articles have required files and matching titles
  for (const article of articles) {
    const { slug, title } = article;
    const blogComponentDir = path.join(BLOGS_DIR, slug);
    const blogComponentIndex = path.join(blogComponentDir, 'index.jsx');
    const blogPageFile = path.join(BLOG_PAGES_DIR, `${slug}.jsx`);

    if (!fs.existsSync(blogComponentIndex)) {
      problems.push(`Missing component index: ${path.relative(ROOT_DIR, blogComponentIndex)}`);
    }

    if (!fs.existsSync(blogPageFile)) {
      problems.push(`Missing page route: ${path.relative(ROOT_DIR, blogPageFile)}`);
    }

    // Check MDX files and titles
    const mdxZhHans = path.join(blogComponentDir, 'mdx/main.zh-Hans.mdx');
    const mdxEn = path.join(blogComponentDir, 'mdx/main.en.mdx');

    const normalizeTitle = (t) => (t || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

    if (fs.existsSync(mdxZhHans)) {
      const raw = fs.readFileSync(mdxZhHans, 'utf8');
      const fm = matter(raw);
      const mdxTitle = fm.data?.title;
      if (title['zh-Hans'] && mdxTitle && normalizeTitle(mdxTitle) !== normalizeTitle(title['zh-Hans'])) {
        problems.push(
          `Title mismatch in ${slug} (zh-Hans):\n  metadata: "${title['zh-Hans']}"\n  mdx:      "${mdxTitle}"`
        );
      }
    } else {
      problems.push(`Missing MDX file: ${path.relative(ROOT_DIR, mdxZhHans)}`);
    }

    if (fs.existsSync(mdxEn)) {
      const raw = fs.readFileSync(mdxEn, 'utf8');
      const fm = matter(raw);
      const mdxTitle = fm.data?.title;
      if (title.en && mdxTitle && normalizeTitle(mdxTitle) !== normalizeTitle(title.en)) {
        problems.push(
          `Title mismatch in ${slug} (en):\n  metadata: "${title.en}"\n  mdx:      "${mdxTitle}"`
        );
      }
    } else {
      problems.push(`Missing MDX file: ${path.relative(ROOT_DIR, mdxEn)}`);
    }
  }

  // 2. Check for un-registered blog components
  if (fs.existsSync(BLOGS_DIR)) {
    const blogDirs = fs.readdirSync(BLOGS_DIR, { withFileTypes: true });
    for (const d of blogDirs) {
      if (d.isDirectory() && /^\d{4}-\d{2}-\d{2}-/.test(d.name)) {
        if (!registeredSlugs.has(d.name)) {
          problems.push(`Unregistered blog directory in metadata.js: ${d.name}`);
        }
      }
    }
  }

  // 3. Check for un-registered blog pages
  if (fs.existsSync(BLOG_PAGES_DIR)) {
    const pageFiles = fs.readdirSync(BLOG_PAGES_DIR);
    for (const f of pageFiles) {
      if (f.endsWith('.jsx')) {
        const slug = f.slice(0, -4);
        if (!registeredSlugs.has(slug)) {
          problems.push(`Unregistered blog page in metadata.js: ${f}`);
        }
      }
    }
  }

  if (problems.length === 0) {
    console.log('[check-blog-metadata] OK - All blog registrations and metadata consistent.');
    return true;
  }

  console.error('[check-blog-metadata] Found discrepancies:');
  problems.forEach((p) => console.error(`- ${p}`));
  process.exitCode = 1;
  return false;
}

checkBlogMetadata();
