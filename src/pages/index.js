/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from "react";

import Head from "@docusaurus/Head";

import Layout from "@theme/Layout";

import Home from "./Home";

import HomepageFeatures from "@site/src/components/HomepageFeatures";

import CallToAction from "./CallToAction";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { translate } from "@docusaurus/Translate";
const Index = () => {
  const { siteConfig } = useDocusaurusContext();
  useEffect(() => {
    const supportedLocales = ['en', 'de'];
    const browserLocale = navigator.language.split('-')[0];
    const targetLocale = supportedLocales.includes(browserLocale)
      ? browserLocale
      : '';

    if (!window.location.pathname.startsWith(`/${targetLocale}`)) {
      console.log(targetLocale)
      window.location.href = `/${targetLocale}`;
    }
  }, []);

  return (
    <Layout
      wrapperClassName="homepage"
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <Head>
        <title>{translate({ id: "RuyiSDK · 为100 万 RISC-V 软件开发人员做好准备", message: "RuyiSDK · 为100 万 RISC-V 软件开发人员做好准备" })}</title>
      </Head>

      <Home />
      <HomepageFeatures />
      <CallToAction />
    </Layout>
  );
};

export default Index;
