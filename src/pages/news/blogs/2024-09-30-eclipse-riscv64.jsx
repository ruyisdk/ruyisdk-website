import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Article from "@site/src/components/News/Blogs/2024-09-30-eclipse-riscv64";
import { BLOG_ARTICLES, getLocalizedArticleField } from "@site/src/components/News/Blogs/metadata";

const ARTICLE = BLOG_ARTICLES.find((item) => item.slug === "2024-09-30-eclipse-riscv64");

export default function EclipseRiscv64BlogPage() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;

  return (
    <Layout
      title={getLocalizedArticleField(ARTICLE, "title", locale)}
      description={getLocalizedArticleField(ARTICLE, "description", locale)}
    >
      <Article />
    </Layout>
  );
}
