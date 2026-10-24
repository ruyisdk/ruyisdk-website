# RuyiSDK News & Blog Publishing Guide

This guide details how news, weekly reports, and blog posts are managed, generated, and validated in the RuyiSDK website repository.

## 1. News Sources Overview

The site aggregates news from three distinct sources configured in `settings/news-sources.json`:

1. **WeChat Official Account Articles (`news/articles/*.md`)**:
   - Manually authored or synced markdown summaries.
   - Frontmatter includes `title`, `date`, `image`, and `link`.
2. **Ruyi Package News (`news/ruyinews/news/*.md`)**:
   - Synced via git submodule from `ruyisdk/packages-index`.
   - Localized versions follow `YYYY-MM-DD-*.zh_CN.md` and `YYYY-MM-DD-*.en_US.md`.
3. **Bi-weekly Reports (`news/weeklies/*.md`)**:
   - Synced via git submodule from `ruyisdk/wechat-articles`.
   - Titled following `YYYY-MM-DD-*.md`.

## 2. Adding a Blog Post

Blog posts are standalone MDX pages featured in the news feed. To add a new blog article:

### Step 1: Create Component Folder
Create `src/components/News/Blogs/<YYYY-MM-DD-slug>/`:
```
src/components/News/Blogs/2026-08-28-my-post/
├── index.jsx
└── mdx/
    ├── main.zh-Hans.mdx
    └── main.en.mdx
```

### Step 2: Register in `src/components/News/Blogs/metadata.js`
Add an entry to the `BLOG_ARTICLES` array:
```javascript
{
  slug: "2026-08-28-my-post",
  date: "2026-08-28",
  image: "/img/news/blogs/2026-08-28-cover.webp",
  title: {
    "zh-Hans": "中文标题",
    en: "English Title",
  },
  description: {
    "zh-Hans": "中文描述",
    en: "English Description",
  },
}
```

### Step 3: Create Page Route
Create `src/pages/news/blogs/2026-08-28-my-post.jsx`:
```javascript
import React from 'react';
import BlogPost from '@site/src/components/News/Blogs/2026-08-28-my-post';

export default function BlogPostPage() {
  return <BlogPost />;
}
```

### Step 4: Validate
Run the automated validator to ensure all files and frontmatter match:
```bash
pnpm run check:blog-metadata
pnpm run check:news-images
```
