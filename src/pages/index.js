/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Head from "@docusaurus/Head";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Home from '@site/src/components/Home';

const Index = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      wrapperClassName="homepage"
      title={`Hello from ${siteConfig.title}`}
      description="All-in-one integrated development environment for RISC-V architecture"
    >
      <Head>
        <title>
          {translate({
            id: "RuyiSDK · 为 100 万 RISC-V 软件开发人员做好准备",
            message: "RuyiSDK · 为 100 万 RISC-V 软件开发人员做好准备",
          })}
        </title>
      </Head>

      <Home />
    </Layout>
  );
};

export default Index;
