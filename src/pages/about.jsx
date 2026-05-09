import React from "react";
import Layout from "@theme/Layout";
import About from "@site/src/components/About";

export default function AboutPage() {
  return (
    // TODO: const pageTitle = i18n?.currentLocale === "zh-Hans" ? "关于我们" : i18n?.currentLocale === "de" ? "Über uns" : "About";
    <Layout
      title="About"
      description="RuyiSDK 项目介绍与联系方式"
    >
      <About />
    </Layout>
  );
}
