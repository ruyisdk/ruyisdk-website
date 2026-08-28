/// <reference types="@docusaurus/module-type-aliases" />

declare global {
  namespace React {
    type ReactNode =
      | ReactElement<any, any>
      | string
      | number
      | Iterable<ReactNode>
      | ReactPortal
      | boolean
      | null
      | undefined
      | bigint;
  }
}

declare module '@theme/Layout' {
  import React from 'react';
  export interface LayoutProps {
    children?: React.ReactNode;
    title?: string;
    description?: string;
    [key: string]: any;
  }
  export default function Layout(props: LayoutProps): JSX.Element;
}

declare module '@docusaurus/useDocusaurusContext' {
  import { DocusaurusContext } from '@docusaurus/types';
  export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/BrowserOnly' {
  import React from 'react';
  export interface BrowserOnlyProps {
    children?: () => React.ReactNode;
    fallback?: React.ReactNode;
  }
  export default function BrowserOnly(props: BrowserOnlyProps): JSX.Element;
}

declare module '@docusaurus/useGlobalData' {
  export function usePluginData(pluginName: string, pluginId?: string): any;
  export function useGlobalData(): any;
}

declare module '@docusaurus/Translate' {
  import React from 'react';
  export interface TranslateProps {
    id?: string;
    message?: string;
    description?: string;
    values?: Record<string, any>;
    children?: React.ReactNode;
  }
  export function translate(
    params: { id?: string; message?: string; description?: string },
    values?: Record<string, any>,
  ): string;
  export default function Translate(props: TranslateProps): JSX.Element;
}

declare module '*.svg' {
  import React from 'react';
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.md' {
  import React from 'react';
  const Component: React.ComponentType<Record<string, any>>;
  export default Component;
}

declare module '*.mdx' {
  import React from 'react';
  const Component: React.ComponentType<Record<string, any>>;
  export default Component;
}

declare module '*scripts/lib/fetch-with-timeout.cjs' {
  export function fetchJsonWithTimeout(
    url: string,
    options?: any,
  ): Promise<{ ok: boolean; code: number; data: any; headers?: any } | null>;
}

declare module '*scripts/lib/markdown-meta.cjs' {
  export function extractTitle(content: string, filename?: string): string;
  export function extractSummary(content: string, maxLen?: number): string;
  export function extractFirstImage(content: string): string | null;
  export function extractDate(filename?: string, frontmatterDate?: any): number;
  export function scanFiles(pattern: string, preferredLocale?: string | null, customCwd?: string | null): any[];
  export function isPathInside(childAbs: string, parentAbs: string): boolean;
  const _default: {
    extractTitle: typeof extractTitle;
    extractSummary: typeof extractSummary;
    extractFirstImage: typeof extractFirstImage;
    extractDate: typeof extractDate;
    scanFiles: typeof scanFiles;
    isPathInside: typeof isPathInside;
  };
  export default _default;
}

declare module '*scripts/lib/contributor-filters.cjs' {
  export function loadFilters(filterFilePath: string): RegExp[];
  export function isFiltered(name: string | null | undefined, patterns: RegExp[]): boolean;
}

declare module '*scripts/plugins/news-localize.cjs' {
  export function localizeTitle(title: string, itemname: string, locale: string): string;
  const _default: {
    localizeTitle: typeof localizeTitle;
  };
  export default _default;
}
