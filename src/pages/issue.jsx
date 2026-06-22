import React from "react";
import Layout from "@theme/Layout";
import Issue from "@site/src/components/Issue";

export default function IssuePage() {
  return (
    <Layout
      title="Issue"
      description="RuyiSDK 问题反馈与 issue 提交流程"
    >
      <Issue />
    </Layout>
  );
}
