import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { PageBackground } from "@site/src/components/Home/Background";
import MarkdownCard from "@site/src/components/About/MarkdownCard";

import MainDe from "./mdx/main.de.mdx";
import MainEn from "./mdx/main.en.mdx";
import MainZhHans from "./mdx/main.zh-Hans.mdx";
import QqDe from "./mdx/qq.de.mdx";
import QqEn from "./mdx/qq.en.mdx";
import QqZhHans from "./mdx/qq.zh-Hans.mdx";
import SignupDe from "./mdx/signup.de.mdx";
import SignupEn from "./mdx/signup.en.mdx";
import SignupZhHans from "./mdx/signup.zh-Hans.mdx";
import SurveyDe from "./mdx/survey.de.mdx";
import SurveyEn from "./mdx/survey.en.mdx";
import SurveyZhHans from "./mdx/survey.zh-Hans.mdx";

const CONTENT = {
  main: {
    "zh-Hans": MainZhHans,
    en: MainEn,
    de: MainDe,
  },
  signup: {
    "zh-Hans": SignupZhHans,
    en: SignupEn,
    de: SignupDe,
  },
  survey: {
    "zh-Hans": SurveyZhHans,
    en: SurveyEn,
    de: SurveyDe,
  },
  qq: {
    "zh-Hans": QqZhHans,
    en: QqEn,
    de: QqDe,
  },
};

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}

export default function Events() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const MainContent = resolveLocalizedContent(CONTENT.main, locale);
  const SignupContent = resolveLocalizedContent(CONTENT.signup, locale);
  const SurveyContent = resolveLocalizedContent(CONTENT.survey, locale);
  const QqContent = resolveLocalizedContent(CONTENT.qq, locale);

  return (
    <main className="relative overflow-hidden pt-(--ruyi-page-start) pb-(--ruyi-page-end) text-slate-900 dark:text-slate-100 font-inter">
      <PageBackground />
      <div className="mx-auto relative z-10 max-w-screen-xl px-4">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(16rem,1fr)] lg:items-start">
          <div className="min-w-0">
            <MarkdownCard className="overflow-hidden">
              <MainContent />
            </MarkdownCard>
          </div>

          <aside className="flex flex-col gap-8 lg:sticky lg:top-24">
            <MarkdownCard variant="soft" className="text-center">
              <SignupContent />
            </MarkdownCard>

            <MarkdownCard variant="soft" className="text-center">
              <SurveyContent />
            </MarkdownCard>

            <MarkdownCard variant="soft" className="text-center">
              <QqContent />
            </MarkdownCard>
          </aside>
        </div>
      </div>
    </main>
  );
}
