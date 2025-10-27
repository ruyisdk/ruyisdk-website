import { readFileSync, writeFileSync, realpathSync } from "fs";
import { glob } from "glob";
import { basename, resolve, join, relative, sep } from "path";
import matter from 'gray-matter';

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

function extractTitle(content, filename) {
  // first H1
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  // Final fallback: filename sans extension
  return basename(filename, ".md");
}

function extractSummary(content) {
  // Remove frontmatter
  let text = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");

  // Remove code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, "");

  // Remove inline code (`...`)
  text = text.replace(/`[^`]+`/g, "");

  // Remove images (![...](...))
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove links but keep link text ([text](url) -> text)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove headings
  text = text.replace(/^#+\s+.+$/gm, "");

  // Remove bold/italic markdown
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");

  // Remove extra whitespace and normalize
  const normalized = text
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const summary = normalized.slice(0, 200);
  return summary + (normalized.length > 200 ? "..." : "");
}

function extractFirstImage(content) {
  // Try to find markdown image format: ![alt](src)
  const markdownImageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (markdownImageMatch) return markdownImageMatch[1].trim();

  // Try to find HTML img tag: <img src="..." />
  const htmlImageMatch = content.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
  if (htmlImageMatch) return htmlImageMatch[1].trim();

  return null;
}

function extractDate(filename) {
  const m = filename.match(/(\d{4})-?(\d{2})-?(\d{2})/);
  if (m) {
    const [, y, mo, d] = m;
    return Date.UTC(Number(y), Number(mo) - 1, Number(d));
  }
  return Date.now();
}

function scanFiles(pattern, preferredLocale = null) {
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
      const absPath = resolve(CWD, file);
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
      const raw = readFileSync(safePath, "utf-8");
      const parsed = matter(raw);
      const content = parsed.content || raw;
      const fm = parsed.data || {};
      const fname = basename(file);

      // Parse possible locale suffix
      const m = fname.match(/^(.+?)(?:\.(zh|en|de))?\.md$/i);
      const baseKey = m ? m[1] : fname.replace(/\.md$/i, "");
      const localeTag = m && m[2] ? m[2].toLowerCase() : "default";

      // Prefer frontmatter.date if provided, else filename-based date, else now
      let dateVal = null;
      if (fm.date) {
        const mm = String(fm.date).match(/(\d{4})-?(\d{2})-?(\d{2})/);
        if (mm) {
          const [, y, mo, d] = mm;
          dateVal = Date.UTC(Number(y), Number(mo) - 1, Number(d));
        } else {
          const dt = new Date(fm.date);
          if (!Number.isNaN(dt.getTime())) dateVal = dt.getTime();
        }
      }

      const computedDate = dateVal || extractDate(fname);

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
    async postBuild({siteConfig = {}, routesPaths = [], outDir}) {
      const { currentLocale } = context.i18n;
      const data = {};
      for (const [itemname, item] of Object.entries(PATTERNS[currentLocale])) {
          const { prefix, path } = item;
      const scannedItems = scanFiles(path, currentLocale).map((it) => ({
        ...it,
        // If the frontmatter provided a link, keep it; otherwise build from prefix+filename
        link: it.link || (prefix + it.filename),
          }));
          data[itemname] = scannedItems;
        }

      writeFileSync(join(outDir, "news.json"), JSON.stringify(data, null, 2));
      console.log(`[${currentLocale}] Generated news.json with:`);
      console.log(`- ${data.articles.length} articles`);
      console.log(`- ${data.ruyinews.length} ruyi news`);
      console.log(`- ${data.weeklies.length} weeklies`);
    },
  };
}
