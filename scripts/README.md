# RuyiSDK Build & Automation Scripts

This directory contains build plugins, synchronization utilities, and quality assurance scripts for the RuyiSDK website.

## Directory Layout

```
scripts/
├── lib/                        # Shared utility libraries
│   ├── contributor-filters.cjs # Regular expression filter loader for contributors
│   ├── fetch-with-timeout.cjs  # Safe HTTP fetch with timeout and error handling
│   ├── github-api.cjs          # GitHub API integration & data summarizer
│   └── markdown-meta.cjs       # Markdown frontmatter, title, summary & date extractor
├── plugins/                    # Docusaurus plugins
│   ├── news-generator.js       # Docusaurus plugin that generates news global data
│   └── news-localize.cjs       # Multi-locale title translation helper
├── check-blog-metadata.cjs     # Validates blog metadata registration and MDX files
├── check-deps-usage.cjs        # Audits declared dependencies in package.json
├── check-news-images.cjs       # Validates local cover images in news articles
├── generate-api-github.cjs     # Updates GitHub stats & contributors snapshots
├── generate-api-ruyisdk-cn.cjs # Updates RuyiSDK backend API snapshots
└── generate_packages_api.py    # Generates offline package index API data
```

## Running Scripts

| Command | Script | Description |
|---|---|---|
| `pnpm run check:news-images` | `check-news-images.cjs` | Validates that all article images exist and are properly sized |
| `pnpm run check:blog-metadata` | `check-blog-metadata.cjs` | Validates consistency between `metadata.js` and blog MDX files |
| `pnpm run check-deps-usage` | `check-deps-usage.cjs` | Scans codebase for unused npm packages |
| `pnpm run generate-github` | `generate-api-github.cjs` | Refreshes GitHub stars, PRs, and contributor data snapshots |
| `pnpm run generate-ruyisdk-api` | `generate-api-ruyisdk-cn.cjs` | Refreshes release and telemetry data snapshots |
