import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import { basename, resolve, join } from "path";

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

function scanFiles(pattern) {
  const files = glob.sync(pattern, { cwd: process.cwd() });
  const items = [];
  for (const file of files) {
    try {
      const content = readFileSync(resolve(file), "utf-8");
      const filename = basename(file);
      items.push({
        title: extractTitle(content, filename),
        summary: extractSummary(content),
        date: extractDate(filename),
        image: extractFirstImage(content),
        filename,
        link: "", // set later
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
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
        const m = t.match(/第\s*(\d{1,4})\s*期/);
        return m ? Number(m[1]) : null;
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

        if (locale === "en") {
          if (num && y && mo && d) return `RuyiSDK Biweekly ${num}: ${y}-${mo}-${d}`;
          if (num) return `RuyiSDK Biweekly ${num}`;
          if (y && mo && d) return `RuyiSDK Biweekly: ${y}-${mo}-${d}`;
          return title;
        }
        if (locale === "de") {
          if (num && y && mo && d) return `RuyiSDK Zweiwochenbericht ${num}: ${d}.${mo}.${y}`;
          if (num) return `RuyiSDK Zweiwochenbericht ${num}`;
          if (y && mo && d) return `RuyiSDK Zweiwochenbericht: ${d}.${mo}.${y}`;
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
        if (locale === "zh-Hans") return title;
        if (itemname === "weeklies") return localizeBiweeklyTitle(title, locale);
        if (itemname === "ruyinews") return localizeRuyiNewsTitle(title, locale);
        return title;
      };
      const data = {};
      for (const [itemname, item] of Object.entries(PATTERNS[currentLocale])) {
        const { prefix, path } = item;
        const scannedItems = scanFiles(path).map((it) => ({
          ...it,
          title: localizeTitle(it.title, itemname, currentLocale),
          link: prefix + it.filename,
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
