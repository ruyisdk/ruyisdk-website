import { readFileSync, writeFileSync, realpathSync } from "fs";
import { glob } from "glob";
import { basename, resolve, join, relative, sep, isAbsolute } from "path";
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
      const parsed = matter(raw);
      const content = parsed.content || raw;
  const fm = parsed.data || {};
  const fname = basename(file);

  // Parse possible locale suffix (generic: 2-5 letters, case-insensitive)
  const m = fname.match(/^(.+?)(?:\.([a-z]{2,5}))?\.md$/i);
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
      // Helpers to produce localized titles for the news sidebar
      const toArabicDigits = (str = "") =>
        str.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));

      const zeroPad = (n, w = 2) => String(n).padStart(w, "0");

      const extractIssueNumber = (title = "") => {
        const t = toArabicDigits(title);
        // Chinese: 第 N 期
        let m = t.match(/第\s*(\d{1,4})\s*期/);
        if (m) return Number(m[1]);
        // English: Biweekly N or Biweekly N:
        m = t.match(/biweekly\s*(?:no\.?\s*)?(\d{1,4})/i);
        if (m) return Number(m[1]);
        // German: Zweiwochenbericht N or Zweiwochenbericht N:
        m = t.match(/zweiwochenbericht\s*(?:nr\.?\s*)?(\d{1,4})/i);
        if (m) return Number(m[1]);
        return null;
      };

      const extractDateFromText = (title = "") => {
        const t = toArabicDigits(title);
        // Chinese date: YYYY 年 MM 月 DD 日
        let m = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
        if (m) {
          const [, y, mo, d] = m.map((x) => Number(x));
          return { y, mo, d };
        }
        // ISO-like date: YYYY-MM-DD
        m = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) {
          const [, y, mo, d] = m.map((x) => Number(x));
          return { y, mo, d };
        }
        return null;
      };

      const localizeBiweeklyTitle = (title, locale) => {
        // If not Chinese-styled title, keep as-is
        const issue = extractIssueNumber(title);
        const date = extractDateFromText(title);
        if (!issue && !date) return title;

        const num = issue != null ? zeroPad(issue, 3) : null;
        const y = date?.y, mo = date ? zeroPad(date.mo) : null, d = date ? zeroPad(date.d) : null;

        // Always strip the brand 'RuyiSDK' from the display title where present
        title = title.replace(/^(?:RuyiSDK|RUYISDK|Ruyi SDK)\s*/i, "");

        // Also strip the Chinese phrase '双周进展汇报' when it appears after the brand
        // or at the beginning of the title in Chinese locales.
        if (/^\s*双周进展汇报\s*/u.test(title) || /^(?:RuyiSDK|RUYISDK)\s*双周进展汇报\s*/i.test(title)) {
          title = title.replace(/^(?:RuyiSDK|RUYISDK)?\s*双周进展汇报\s*/iu, "");
        }

        if (locale === "en") {
          // English: keep 'Biweekly' but remove the brand
          if (num && y && mo && d) return `Biweekly ${num}: ${y}-${mo}-${d}`;
          if (num) return `Biweekly ${num}`;
          if (y && mo && d) return `Biweekly: ${y}-${mo}-${d}`;
          return title;
        }
        if (locale === "de") {
          // German: keep 'Zweiwochenbericht' but remove the brand
          if (num && y && mo && d) return `Zweiwochenbericht ${num}: ${d}.${mo}.${y}`;
          if (num) return `Zweiwochenbericht ${num}`;
          if (y && mo && d) return `Zweiwochenbericht: ${d}.${mo}.${y}`;
          return title;
        }

        if (locale === "zh-Hans") {
          // Chinese: remove brand and the phrase '双周进展汇报' and format as '第NN期 YYYY年MM月DD日'
          if (num && y && mo && d) return `第${Number(num)}期 ${y}年${mo}月${d}日`;
          if (num) return `第${Number(num)}期`;
          if (y && mo && d) return `${y}年${mo}月${d}日`;
          return title;
        }

        return title;
      };

      const localizeRuyiNewsTitle = (title, locale) => {
        // Attempt to translate common pattern: "RuyiSDK 0.39 版本更新说明"
        const t = toArabicDigits(title);
        const m = t.match(/RuyiSDK\s+([0-9.]+)\s*版本?更新说明/);
        if (m) {
          const version = m[1];
          if (locale === "en") return `RuyiSDK ${version} Release Notes`;
          if (locale === "de") return `RuyiSDK ${version} Versionshinweise`;
        }
        return title;
      };

      const localizeTitle = (title, itemname, locale) => {
        if (itemname === "weeklies") return localizeBiweeklyTitle(title, locale);
        if (itemname === "ruyinews") return localizeRuyiNewsTitle(title, locale);
        return title;
      };
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

      writeFileSync(join(outDir, "news.json"), JSON.stringify(data, null, 2));
      console.log(`[${currentLocale}] Generated news.json with:`);
      console.log(`- ${data.articles.length} articles`);
      console.log(`- ${data.ruyinews.length} ruyi news`);
      console.log(`- ${data.weeklies.length} weeklies`);
    },
  };
}
