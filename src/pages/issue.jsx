import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Issue from "@site/src/components/Issue";

export default function IssuePage() {
  return (
    <Layout
      title={translate({ id: "issue.meta.title", message: "报告问题" })}
      description={translate({ id: "issue.meta.description", message: "RuyiSDK 问题反馈与 issue 提交流程" })}
    >
      <Issue />
    </Layout>
  );
}
