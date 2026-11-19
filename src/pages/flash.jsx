import Translate, { translate } from "@docusaurus/Translate";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import React from "react";

/** Hosts the browser-only USB flasher without accessing hardware APIs during SSR. */
export default function FlashPage() {
  return (
    <Layout
      title={translate({
        id: "flasher.title",
        message: "Online image flasher",
      })}
      description={translate({
        id: "flasher.description",
        message:
          "Flash RISC-V board images over USB with fastboot. Supports ZIP, TAR.GZ and Zstandard images.",
      })}
    >
      <BrowserOnly
        fallback={
          <div className="margin-vert--lg container">
            <Translate id="flasher.loading">Loading image flasher…</Translate>
          </div>
        }
      >
        {() => {
          const Flasher = require("@site/src/components/Flasher").default;
          return <Flasher />;
        }}
      </BrowserOnly>
    </Layout>
  );
}
