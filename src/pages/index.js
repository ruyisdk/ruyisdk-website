/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";

import Hero from '@site/src/components/Home';

const Index = () => {
  return (
    <Layout
      wrapperClassName="homepage"
      title={translate({id: "home.title", message: "RuyiSDK · 为 100 万 RISC-V 软件开发人员做好准备"})}
      description={translate({id: "home.description", message: "面向 RISC-V 架构的一体化集成开发环境"})}
    >

      <Hero />
    </Layout>
  );
};

export default Index;
