# RuyiSDK Code & Style Guide

## 1. Code Standards

- **Language & Runtime**: Node.js >= 22.4.1, TypeScript 5.x, React 18.x.
- **Package Manager**: `pnpm` (Corepack managed).
- **Linter & Formatter**: ESLint 9 (Flat Config), Prettier.
- **Typecheck**: `pnpm run typecheck` (`tsc --noEmit`) must pass with 0 errors.
- **Testing**: Vitest (`pnpm test`) for all pure functions and utility modules.

## 2. Component Design Principles

1. **Single Responsibility**: Deconstruct complex components when lines of code exceed 250 lines. Keep aggregator/container components concise (~100-150 lines).
2. **Never Delete Legacy Files**: When refactoring, convert existing component entries into backward-compatible wrappers or re-export layers.
3. **Client vs SSR Safety**:
   - For components relying on `window`, `localStorage`, or browser navigator APIs, wrap with `useIsClient()` or `@docusaurus/BrowserOnly`.
   - Never access browser globals unconditionally in component initialization.
4. **Style Scoping**:
   - Prefer Tailwind CSS utility classes and scoped CSS Modules (`styles.module.css`).
   - Page-specific styles should be imported inside the page component rather than polluting global `custom.scss`.

## 3. Scripts & Shared Code

- Place shared Node.js logic under `scripts/lib/` using `.cjs` extension.
- Always enforce timeouts and graceful fallback when making external network requests using `fetchJsonWithTimeout()`.
- Externalize environment and file patterns into `settings/` JSON files instead of hardcoding paths across multiple scripts.

## 4. Verification Checklist

Before submitting a PR, ensure all the following commands pass cleanly:

```bash
pnpm run lint             # ESLint check
pnpm run typecheck        # TypeScript check
pnpm run test             # Vitest unit test runner
pnpm run check:news-images # Static image validator
pnpm run check:blog-metadata # Blog registration validator
pnpm run check-deps-usage # Dependency audit
pnpm run build            # Full multi-locale Docusaurus build
```
