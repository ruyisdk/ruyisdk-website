import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import ArticlePage from './ArticlePage';
import { BLOG_ARTICLES, getLocalizedArticleField } from './metadata';

import * as Box64MainEn from './2024-07-08-box64-wps-office-poc/mdx/main.en.mdx';
import * as Box64MainZhHans from './2024-07-08-box64-wps-office-poc/mdx/main.zh-Hans.mdx';
import * as K230dMainEn from './2024-07-30-k230d/mdx/main.en.mdx';
import * as K230dMainZhHans from './2024-07-30-k230d/mdx/main.zh-Hans.mdx';
import * as EclipseMainEn from './2024-09-30-eclipse-riscv64/mdx/main.en.mdx';
import * as EclipseMainZhHans from './2024-09-30-eclipse-riscv64/mdx/main.zh-Hans.mdx';
import * as Th1520MainEn from './2024-12-31-th1520/mdx/main.en.mdx';
import * as Th1520MainZhHans from './2024-12-31-th1520/mdx/main.zh-Hans.mdx';

const CONTENT_MAP = {
  '2024-07-08-box64-wps-office-poc': { 'zh-Hans': Box64MainZhHans, en: Box64MainEn },
  '2024-07-30-k230d': { 'zh-Hans': K230dMainZhHans, en: K230dMainEn },
  '2024-09-30-eclipse-riscv64': { 'zh-Hans': EclipseMainZhHans, en: EclipseMainEn },
  '2024-12-31-th1520': { 'zh-Hans': Th1520MainZhHans, en: Th1520MainEn },
};

export default function BlogArticlePage({ slug }) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const article = BLOG_ARTICLES.find((item) => item.slug === slug);
  const contentMap = CONTENT_MAP[slug];

  if (!article || !contentMap) {
    return null;
  }

  return (
    <Layout
      title={getLocalizedArticleField(article, 'title', locale)}
      description={getLocalizedArticleField(article, 'description', locale)}
    >
      <ArticlePage contentMap={contentMap} />
    </Layout>
  );
}
