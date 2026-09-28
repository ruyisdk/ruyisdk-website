import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import About from "@site/src/components/About";
import { getLocaleMessage } from "@site/src/utils/locale";

const PAGE_TITLES = {
  "zh-Hans": "关于我们",
  de: "Über uns",
  en: "About",
};

const PAGE_DESCRIPTIONS = {
  "zh-Hans": "RuyiSDK 项目介绍与联系方式",
  de: "RuyiSDK Projektvorstellung und Kontaktinformationen",
  en: "RuyiSDK Project Introduction and Contact Information",
};

export default function AboutPage() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n?.currentLocale;
  const title = getLocaleMessage(PAGE_TITLES, currentLocale);
  const description = getLocaleMessage(PAGE_DESCRIPTIONS, currentLocale);

  return (
    <Layout
      title={title}
      description={description}
    >
      <About />
    </Layout>
  );
}
