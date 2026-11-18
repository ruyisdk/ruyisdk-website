import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageBackground } from "@site/src/components/Home/Background";
import MarkdownCard from "@site/src/components/About/MarkdownCard";

import IssueDe from "./mdx/issue.de.mdx";
import IssueEn from "./mdx/issue.en.mdx";
import IssueZhHans from "./mdx/issue.zh-Hans.mdx";

const ISSUE_CONTENT = {
  "zh-Hans": IssueZhHans,
  en: IssueEn,
  de: IssueDe,
};

export default function Issue() {
  const { i18n } = useDocusaurusContext();
  const IssueContent = ISSUE_CONTENT[i18n?.currentLocale] || ISSUE_CONTENT.en;

  return (
    <div className="relative overflow-hidden pt-(--ruyi-page-start) pb-(--ruyi-page-end) text-slate-900 dark:text-slate-100 font-inter">
      <PageBackground />
      <div className="mx-auto relative z-10 max-w-screen-xl px-4">
        <MarkdownCard className="w-full">
          <IssueContent />
        </MarkdownCard>
      </div>
    </div>
  );
}
