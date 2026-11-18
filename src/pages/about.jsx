import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import About from "@site/src/components/About";

export default function AboutPage() {
  return (
    <Layout
      title={translate({ id: "about.meta.title", message: "关于 RuyiSDK" })}
      description={translate({ id: "about.meta.description", message: "RuyiSDK 项目介绍与联系方式" })}
    >
      <About />
    </Layout>
  );
}
