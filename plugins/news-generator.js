import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import { basename, resolve, join } from "path";

const PATTERNS = {
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
};

function extractTitle(content, filename) {
  // Prefer frontmatter title
  const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (fm) {
    const m = fm[1].match(/(?:^|\n)title:\s*(?:"([^"]+)"|'([^']+)'|(.+))/);
    if (m) return (m[1] || m[2] || m[3]).trim();
  }

  // Fallback: first H1
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  // Final fallback: filename sans extension
  return basename(filename, ".md");
}

function extractSummary(content) {
  const withoutFm = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const withoutHeadings = withoutFm.replace(/^#+\s+.+$/gm, "");
  const normalized = withoutHeadings
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const summary = normalized.slice(0, 150);
  return summary + (normalized.length > 150 ? "..." : "");
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
        filename,
        link: "", // set later
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }
  return items.sort((a, b) => b.date - a.date);
}

export default function newsGeneratorPlugin() {
  return {
    name: "docusaurus-news-generator",
    async loadContent() {
      const data = {};
      for (const key of Object.keys(PATTERNS)) {
        const { path: p, prefix } = PATTERNS[key];

        console.log(`Scanning ${key} with pattern: ${p}`);
        const items = scanFiles(p).map((it) => ({
          ...it,
          link: prefix + it.filename,
        }));
        data[key] = items;
        console.log(`Found ${items.length} items for ${key}`);
      }

      const outputPath = join("static", "news.json");
      writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`Generated news.json with:`);
      console.log(`- ${data.articles.length} articles`);
      console.log(`- ${data.ruyinews.length} ruyi news`);
      console.log(`- ${data.weeklies.length} weeklies`);
    },
  };
}
