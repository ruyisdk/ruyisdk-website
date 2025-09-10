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
    async loadContent() {
      const { currentLocale } = context.i18n;
      const data = {};
      for (const [itemname, item] of Object.entries(PATTERNS[currentLocale])) {
        const { prefix, path } = item;

        console.log(`[${currentLocale}] Scanning ${itemname} with pattern: ${path}`);
        const scannedItems = scanFiles(path).map((it) => ({
          ...it,
          link: prefix + it.filename,
        }));
        data[itemname] = scannedItems;
        console.log(`[${currentLocale}] Found ${scannedItems.length} items for ${itemname}`);
      }

      const outputPath = join("static", `news.${currentLocale}.json`);
      writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`Generated news.${currentLocale}.json with:`);
      console.log(`- ${data.articles.length} articles`);
      console.log(`- ${data.ruyinews.length} ruyi news`);
      console.log(`- ${data.weeklies.length} weeklies`);
    },
  };
}
