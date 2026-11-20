import { readFileSync, realpathSync } from "fs";
import { glob } from "glob";
import { basename, resolve, relative, sep, isAbsolute } from "path";
import { readNewsMetadata } from './news-metadata.js';
import { localizeTitle } from './news-localize.cjs';

const PATTERNS = {
  "zh-Hans": {
    articles: {
      prefix: "https://mp.weixin.qq.com/s/",
      path: "news/articles/*",
    },
    ruyinews: {
      prefix: "https://github.com/ruyisdk/packages-index/blob/main/news/",
      path: "news/ruyinews/news/20??*zh_CN.md",
    },
    weeklies: {
      prefix: "https://github.com/ruyisdk/wechat-articles/blob/main/",
      path: "news/weeklies/20??*.md",
    },
  },
  en: {
    articles: {
      prefix: "https://mp.weixin.qq.com/s/",
      path: "news/articles/*",
    },
    ruyinews: {
      prefix: "https://github.com/ruyisdk/packages-index/blob/main/news/",
      path: "news/ruyinews/news/20??*en_US.md",
    },
    weeklies: {
      prefix: "https://github.com/ruyisdk/wechat-articles/blob/main/",
      path: "news/weeklies/20??*.md",
    },
  },
  de: {
    articles: {
      prefix: "https://mp.weixin.qq.com/s/",
      path: "news/articles/*",
    },
    ruyinews: {
      prefix: "https://github.com/ruyisdk/packages-index/blob/main/news/",
      path: "news/ruyinews/news/20??*en_US.md",
    },
    weeklies: {
      prefix: "https://github.com/ruyisdk/wechat-articles/blob/main/",
      path: "news/weeklies/20??*.md",
    },
  },
};

function scanFiles(pattern, preferredLocale = null) {
  // Validate pattern for security: prevent path traversal and ensure it's a relative path
  if (!pattern || typeof pattern !== 'string') {
    throw new Error('Invalid pattern: must be a non-empty string');
  }
  if (pattern.includes('..') || pattern.startsWith('/') || pattern.startsWith('\\') || pattern.includes('~') || sep === '\\' && pattern.includes('\\\\')) {
    throw new Error(`Unsafe pattern detected: ${pattern}`);
  }
  // Ensure pattern is relative (not absolute)
  if (isAbsolute(pattern)) {
    throw new Error(`Pattern must be relative: ${pattern}`);
  }

  const CWD = process.cwd();
  const files = glob.sync(pattern, { cwd: CWD, dot: false, nodir: true });

  // Derive a base directory from the glob pattern (up to the first segment containing wildcard)
  const baseDirFromPattern = (() => {
    const segments = pattern.split("/");
    const baseSegs = [];
    for (const seg of segments) {
      if (/[\\*?\[]/.test(seg)) break; // stop at the first segment containing a glob char
      if (seg) baseSegs.push(seg);
    }
    const baseRel = baseSegs.length ? baseSegs.join("/") : ".";
    return resolve(CWD, baseRel);
  })();

  // Canonical base directory (resolves symlinks)
  let realBaseDir;
  try {
    realBaseDir = realpathSync(baseDirFromPattern);
  } catch {
    realBaseDir = baseDirFromPattern;
  }

  // Ensure child path stays within base dir
  const isPathInside = (childAbs, parentAbs) => {
    const rel = relative(parentAbs, childAbs);
    // rel === '' when same dir/file; must also ensure not traversing upwards
    return rel === "" || (!rel.startsWith("..") && !rel.includes(".." + sep));
  };

  // Group files by base key (filename without locale suffix)
  // filename format supported: <base>.md or <base>.<locale>.md (e.g., 2025-10-24-1.en.md)
  const groups = new Map();

  for (const file of files) {
    try {
      // Basic sanity checks on the relative path returned by glob
      const relPath = String(file).replace(/\\/g, "/");
      // Disallow control characters outright
      if ([...relPath].some((ch) => /[\u0000-\u001F\u007F]/.test(ch))) {
        console.warn(`Skipping file with control characters: ${file}`);
        continue;
      }
      // Allow Unicode letters/numbers/marks/punctuation/space separator and common filename chars, keep slashes as separators
      // Prevent path traversal and control characters (validated above); additional baseDir checks are below.
      if (!/^[\p{L}\p{N}\p{M}\p{P}\p{Zs}._\-\/]+$/u.test(relPath)) {
        console.warn(`Skipping file with invalid characters: ${file}`);
        continue;
      }
      // Only accept markdown files
      if (!/\.md$/i.test(relPath)) {
        console.warn(`Skipping non-markdown file: ${file}`);
        continue;
      }

      const absPath = resolve(CWD, relPath);
      // Canonicalize the absolute path and validate it stays within the expected base directory
      let safePath;
      try {
        const realAbsPath = realpathSync(absPath);
        if (!isPathInside(realAbsPath, realBaseDir)) {
          console.warn(`Skipping out-of-scope file: ${file}`);
          continue;
        }
        safePath = realAbsPath;
      } catch {
        console.warn(`Skipping out-of-scope file: ${file}`);
        continue;
      }
      // Safe read: path is canonicalized, whitelisted by base dir, extension is .md, and characters are validated.
      const raw = readFileSync(safePath, "utf-8");
      const fname = basename(file);
      const m = fname.match(/^(.+?)(?:\.([a-z]{2,5}))?\.md$/i);
      const baseKey = m ? m[1] : fname.replace(/\.md$/i, "");
      const localeTag = m && m[2] ? m[2].toLowerCase() : "default";

      const entry = { ...readNewsMetadata(raw, fname), _locale: localeTag, _baseKey: baseKey };

      if (!groups.has(baseKey)) groups.set(baseKey, []);
      groups.get(baseKey).push(entry);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  const items = [];

  // Helper to normalize preferredLocale (context values like 'zh-Hans' -> 'zh')
  const preferred = (function (p) {
    if (!p) return null;
    if (p.toLowerCase().startsWith("zh")) return "zh";
    if (p.toLowerCase().startsWith("en")) return "en";
    if (p.toLowerCase().startsWith("de")) return "de";
    return p.toLowerCase();
  })(preferredLocale);

  for (const [baseKey, variants] of groups.entries()) {
    // Try to find best variant: exact locale match, then default, then first available
    let chosen = null;
    if (preferred) {
      chosen = variants.find((v) => v._locale === preferred);
    }
    if (!chosen) chosen = variants.find((v) => v._locale === "default");
    if (!chosen) chosen = variants[0];

    if (chosen) {
      // Remove internal helper props
      const { _locale, _baseKey, ...out } = chosen;
      items.push(out);
    }
  }

  return items.sort((a, b) => b.date - a.date);
}

export default function newsGeneratorPlugin(context, options) {
  return {
    name: "docusaurus-news-generator",
    async loadContent() {
      const { currentLocale } = context.i18n;
      const data = {};
      for (const [itemname, item] of Object.entries(PATTERNS[currentLocale])) {
        const { prefix, path } = item;
        const scannedItems = scanFiles(path, currentLocale).map((it) => ({
        ...it,
        title: localizeTitle(it.title, itemname, currentLocale),
        // If the frontmatter provided a link, keep it; otherwise build from prefix+filename
        link: it.link || (prefix + it.filename),
          }));
          data[itemname] = scannedItems;
        }

      console.log(`[${currentLocale}] Prepared news data with:`);
      console.log(`- ${data.articles.length} articles`);
      console.log(`- ${data.ruyinews.length} ruyi news`);
      console.log(`- ${data.weeklies.length} weeklies`);

      return data;
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
