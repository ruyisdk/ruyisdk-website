import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { PageBackground } from "@site/src/components/Home/Background";
import MarkdownCard from "@site/src/components/About/MarkdownCard";

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en || contentMap["zh-Hans"];
}

export default function ArticlePage({ contentMap }) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const MainContent = resolveLocalizedContent(contentMap, locale);

  return (
    <main className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
      <PageBackground />
      <div className="mx-auto relative z-10 max-w-screen-xl">
        <div className="min-w-0">
          <MarkdownCard className="overflow-hidden">
            <MainContent />
          </MarkdownCard>
        </div>
      </div>
    </main>
  );
}
