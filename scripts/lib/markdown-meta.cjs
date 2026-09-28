const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');

function extractTitle(content, filename = '') {
  if (!content) return path.basename(filename, '.md');
  // First H1
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  // Final fallback: filename sans extension
  return path.basename(filename, '.md');
}

function extractSummary(content, maxLen = 200) {
  if (!content) return '';
  // Remove frontmatter
  let text = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');

  // Remove code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`...`)
  text = text.replace(/`[^`]+`/g, '');

  // Remove images (![...](...))
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Remove links but keep link text ([text](url) -> text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove headings
  text = text.replace(/^#+\s+.+$/gm, '');

  // Remove bold/italic markdown
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // Remove extra whitespace and normalize
  const normalized = text
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const summary = normalized.slice(0, maxLen);
  return summary + (normalized.length > maxLen ? '...' : '');
}

function extractFirstImage(content) {
  if (!content) return null;
  // Try to find markdown image format: ![alt](src)
  const markdownImageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (markdownImageMatch) return markdownImageMatch[1].trim();

  // Try to find HTML img tag: <img src="..." />
  const htmlImageMatch = content.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
  if (htmlImageMatch) return htmlImageMatch[1].trim();

  return null;
}

/**
 * @param {string} [filename]
 * @param {string|number|Date|null} [frontmatterDate]
 * @returns {number}
 */
function extractDate(filename = '', frontmatterDate = null) {
  if (frontmatterDate) {
    const mm = String(frontmatterDate).match(/(\d{4})-?(\d{2})-?(\d{2})/);
    if (mm) {
      const [, y, mo, d] = mm;
      return Date.UTC(Number(y), Number(mo) - 1, Number(d));
    }
    const dt = new Date(frontmatterDate);
    if (!Number.isNaN(dt.getTime())) return dt.getTime();
  }

  if (filename) {
    const m = filename.match(/(\d{4})-?(\d{2})-?(\d{2})/);
    if (m) {
      const [, y, mo, d] = m;
      return Date.UTC(Number(y), Number(mo) - 1, Number(d));
    }
  }

  return Date.now();
}

function isPathInside(childAbs, parentAbs) {
  const rel = path.relative(parentAbs, childAbs);
  return rel === '' || (!rel.startsWith('..') && !rel.includes('..' + path.sep));
}

function scanFiles(pattern, preferredLocale = null, customCwd = null) {
  if (!pattern || typeof pattern !== 'string') {
    throw new Error('Invalid pattern: must be a non-empty string');
  }
  if (
    pattern.includes('..') ||
    pattern.startsWith('/') ||
    pattern.startsWith('\\') ||
    pattern.includes('~') ||
    (path.sep === '\\' && pattern.includes('\\\\'))
  ) {
    throw new Error(`Unsafe pattern detected: ${pattern}`);
  }
  if (path.isAbsolute(pattern)) {
    throw new Error(`Pattern must be relative: ${pattern}`);
  }

  const CWD = customCwd || process.cwd();
  const files = glob.sync(pattern, { cwd: CWD, dot: false, nodir: true });

  const segments = pattern.split('/');
  const baseSegs = [];
  for (const seg of segments) {
    if (/[*?[\]]/.test(seg)) break;
    if (seg) baseSegs.push(seg);
  }
  const baseRel = baseSegs.length ? baseSegs.join('/') : '.';
  const baseDirFromPattern = path.resolve(CWD, baseRel);

  let realBaseDir;
  try {
    realBaseDir = fs.realpathSync(baseDirFromPattern);
  } catch {
    realBaseDir = baseDirFromPattern;
  }

  const groups = new Map();

  for (const file of files) {
    try {
      const relPath = String(file).replace(/\\/g, '/');
      if (
        [...relPath].some(
          (ch) => {
            const code = ch.charCodeAt(0);
            return (code >= 0 && code <= 31) || code === 127;
          }
        )
      ) {
        console.warn(`Skipping file with control characters: ${file}`);
        continue;
      }
      if (!/^[\p{L}\p{N}\p{M}\p{P}\p{Zs}._\-/]+$/u.test(relPath)) {
        console.warn(`Skipping file with invalid characters: ${file}`);
        continue;
      }
      if (!/\.md$/i.test(relPath)) {
        console.warn(`Skipping non-markdown file: ${file}`);
        continue;
      }

      const absPath = path.resolve(CWD, relPath);
      let safePath;
      try {
        const realAbsPath = fs.realpathSync(absPath);
        if (!isPathInside(realAbsPath, realBaseDir)) {
          console.warn(`Skipping out-of-scope file: ${file}`);
          continue;
        }
        safePath = realAbsPath;
      } catch {
        console.warn(`Skipping out-of-scope file: ${file}`);
        continue;
      }

      const raw = fs.readFileSync(safePath, 'utf-8');
      const parsed = matter(raw);
      const content = parsed.content || raw;
      const fm = parsed.data || {};
      const fname = path.basename(file);

      const m = fname.match(/^(.+?)(?:\.([a-z]{2,5}))?\.md$/i);
      const baseKey = m ? m[1] : fname.replace(/\.md$/i, '');
      const localeTag = m && m[2] ? m[2].toLowerCase() : 'default';

      const computedDate = extractDate(fname, fm.date);
      const title = fm.title || extractTitle(content, fname);
      const summary = extractSummary(content);
      const image = fm.image || extractFirstImage(content);
      const linkFromFrontmatter = fm.link || fm.permalink || fm.url || null;

      const entry = {
        title,
        summary,
        date: computedDate,
        image,
        filename: fname,
        link: linkFromFrontmatter,
        _locale: localeTag,
        _baseKey: baseKey,
      };

      if (!groups.has(baseKey)) groups.set(baseKey, []);
      groups.get(baseKey).push(entry);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  const items = [];
  const preferred = (function (p) {
    if (!p) return null;
    if (p.toLowerCase().startsWith('zh')) return 'zh';
    if (p.toLowerCase().startsWith('en')) return 'en';
    if (p.toLowerCase().startsWith('de')) return 'de';
    return p.toLowerCase();
  })(preferredLocale);

  for (const [, variants] of groups.entries()) {
    let chosen = null;
    if (preferred) {
      chosen = variants.find((v) => v._locale === preferred);
    }
    if (!chosen) chosen = variants.find((v) => v._locale === 'default');
    if (!chosen) chosen = variants[0];

    if (chosen) {
      const { _locale: _l, _baseKey: _b, ...out } = chosen;
      items.push(out);
    }
  }

  return items.sort((a, b) => b.date - a.date);
}

module.exports = {
  extractTitle,
  extractSummary,
  extractFirstImage,
  extractDate,
  scanFiles,
  isPathInside,
};
