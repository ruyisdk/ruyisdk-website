import { basename } from 'path';
import matter from 'gray-matter';

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

export function readNewsMetadata(raw, filename) {
  const { content, data } = matter(raw);
  const body = content || raw;
  const frontmatter = data || {};
  let dateVal = null;
  if (frontmatter.date) {
    const mm = String(frontmatter.date).match(/(\d{4})-?(\d{2})-?(\d{2})/);
    if (mm) {
      const [, y, mo, d] = mm;
      dateVal = Date.UTC(Number(y), Number(mo) - 1, Number(d));
    } else {
      const dt = new Date(frontmatter.date);
      if (!Number.isNaN(dt.getTime())) dateVal = dt.getTime();
    }
  }


  return {
    title: frontmatter.title || extractTitle(body, filename),
    summary: extractSummary(body),
    date: dateVal || extractDate(filename),
    image: frontmatter.image || extractFirstImage(body),
    filename,
    link: frontmatter.link || frontmatter.permalink || frontmatter.url || null,
  };
}
