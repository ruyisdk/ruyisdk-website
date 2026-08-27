import { describe, it, expect } from 'vitest';
import markdownMeta from '../../scripts/lib/markdown-meta.cjs';

const { extractTitle, extractSummary, extractFirstImage, extractDate, isPathInside } = markdownMeta;

describe('markdownMeta', () => {
  describe('extractTitle', () => {
    it('extracts H1 title if present', () => {
      const content = '# My Awesome Title\n\nSome content here.';
      expect(extractTitle(content, 'test.md')).toBe('My Awesome Title');
    });

    it('falls back to filename if no H1 is found', () => {
      const content = '## Subheading\n\nSome content.';
      expect(extractTitle(content, '2024-05-01-ruyi-news.md')).toBe('2024-05-01-ruyi-news');
    });
  });

  describe('extractSummary', () => {
    it('strips frontmatter, markdown formatting, headings and code blocks', () => {
      const raw = `---
title: Test
---
# Heading

This is **bold** text and [a link](https://example.com).
\`\`\`js
console.log('secret');
\`\`\`
More text.`;
      const summary = extractSummary(raw);
      expect(summary).not.toContain('title: Test');
      expect(summary).not.toContain('console.log');
      expect(summary).not.toContain('**');
      expect(summary).toContain('This is bold text and a link. More text.');
    });
  });

  describe('extractFirstImage', () => {
    it('extracts markdown image syntax', () => {
      const content = 'Text before ![Alt text](/img/pic.png) text after';
      expect(extractFirstImage(content)).toBe('/img/pic.png');
    });

    it('extracts HTML img tag syntax', () => {
      const content = 'Text before <img src="/img/html-pic.webp" alt="test" /> text after';
      expect(extractFirstImage(content)).toBe('/img/html-pic.webp');
    });

    it('returns null when no image exists', () => {
      expect(extractFirstImage('Plain text without image')).toBeNull();
    });
  });

  describe('extractDate', () => {
    it('extracts date from filename YYYY-MM-DD', () => {
      const timestamp = extractDate('2024-07-30-k230d.md');
      const d = new Date(timestamp);
      expect(d.getUTCFullYear()).toBe(2024);
      expect(d.getUTCMonth()).toBe(6); // 0-indexed July is 6
      expect(d.getUTCDate()).toBe(30);
    });

    it('prefers frontmatter date over filename', () => {
      const timestamp = extractDate('2024-01-01-test.md', '2025-12-31');
      const d = new Date(timestamp);
      expect(d.getUTCFullYear()).toBe(2025);
      expect(d.getUTCMonth()).toBe(11); // December
      expect(d.getUTCDate()).toBe(31);
    });
  });

  describe('isPathInside', () => {
    it('returns true for child paths inside parent', () => {
      expect(isPathInside('/home/user/project/file.md', '/home/user/project')).toBe(true);
    });

    it('returns false for path traversal attempts', () => {
      expect(isPathInside('/home/user/other/file.md', '/home/user/project')).toBe(false);
    });
  });
});
