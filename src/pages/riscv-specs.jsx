import React from "react";
import Layout from "@theme/Layout";

import RiscvSpecPage from "@site/src/components/RiscvSpecPage";

export default function RiscvSpecsPage() {
  return (
    <Layout
      title="RISC-V Ratified Specs"
      description="RISC-V Ratified Specs 导览与下载入口"
    >
      <RiscvSpecPage />
    </Layout>
  );
}
