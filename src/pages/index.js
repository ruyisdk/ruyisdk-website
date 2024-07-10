/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

import Head from "@docusaurus/Head";

import Layout from "@theme/Layout";

import Home from "./Home";

import HomepageFeatures from "@site/src/components/HomepageFeatures";

import CallToAction from "./CallToAction";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const Index = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      wrapperClassName="homepage"
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <Head>
        <title>RuyiSDK · 为100 万 RISC-V 软件开发人员做好准备</title>
      </Head>
      <Home />
      <HomepageFeatures />
      <CallToAction />
    </Layout>
  );
};

export default Index;
