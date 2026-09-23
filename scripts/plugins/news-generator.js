import { readFileSync } from "fs";
import { resolve } from "path";
import newsLocalize from "./news-localize.cjs";
import markdownMeta from "../lib/markdown-meta.cjs";

const { localizeTitle } = newsLocalize;
const { scanFiles } = markdownMeta;

function loadPatterns() {
  try {
    const configPath = resolve(process.cwd(), "settings/news-sources.json");
    const raw = readFileSync(configPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load settings/news-sources.json, using fallback:", err);
    return {};
  }
}

export default function newsGeneratorPlugin(context) {
  return {
    name: "docusaurus-news-generator",
    async loadContent() {
      const { currentLocale } = context.i18n;
      const patterns = loadPatterns();
      const localePatterns = patterns[currentLocale] || patterns["zh-Hans"] || {};
      const data = {};

      for (const [itemname, item] of Object.entries(localePatterns)) {
        const { prefix, path: patternPath } = item;
        const scannedItems = scanFiles(patternPath, currentLocale).map((it) => ({
          ...it,
          title: localizeTitle(it.title, itemname, currentLocale),
          // If the frontmatter provided a link, keep it; otherwise build from prefix+filename
          link: it.link || prefix + it.filename,
        }));
        data[itemname] = scannedItems;
      }

      console.log(`[${currentLocale}] Prepared news data with:`);
      console.log(`- ${data.articles?.length || 0} articles`);
      console.log(`- ${data.ruyinews?.length || 0} ruyi news`);
      console.log(`- ${data.weeklies?.length || 0} weeklies`);

      return data;
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
