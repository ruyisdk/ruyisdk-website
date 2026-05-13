import React from "react";
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";

import RiscvSpecPage from "@site/src/components/RiscvSpecPage";

export default function RiscvSpecsPage() {
  return (
    <Layout
      title={translate({
        id: "riscvSpecs.page.title",
        message: "RISC-V Ratified Specs",
      })}
      description={translate({
        id: "riscvSpecs.page.description",
        message: "RISC-V Ratified Specs 导览与下载入口",
      })}
    >
      <RiscvSpecPage />
    </Layout>
  );
}
