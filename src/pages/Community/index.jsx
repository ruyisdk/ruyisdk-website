import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";

export default function CommunityHub() {
  return (
    <Layout title="Community" description="RuyiSDK 社区页面">
      <div className="relative overflow-hidden px-6 py-8 text-gray-800">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
            <Translate>RuyiSDK 社区</Translate>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto text-center mb-6">
            <Translate id="community.hub.lead">RuyiSDK 是一个开放、包容的社区，我们欢迎每一位对 RISC-V 与开源软件感兴趣的贡献者参与其中。</Translate>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="bg-white/80 rounded-lg p-6 shadow-md text-center">
              <div className="text-lg font-bold mb-2"><Translate>贡献者</Translate></div>
              <div className="text-sm text-gray-600 mb-4"><Translate id="community.hub.contributors.desc">查看并感谢为项目做出贡献的个人与组织。</Translate></div>
              <a href="/Community/contributors" className="text-blue-600 font-semibold"><Translate>前往查看 →</Translate></a>
            </div>
            <div className="bg-white/80 rounded-lg p-6 shadow-md text-center">
              <div className="text-lg font-bold mb-2"><Translate>社区共建计划</Translate></div>
              <div className="text-sm text-gray-600 mb-4"><Translate id="community.hub.partners.desc">了解我们的合作伙伴与共建项目，发现合作机会。</Translate></div>
              <a href="/Community/partners" className="text-blue-600 font-semibold"><Translate>前往查看 →</Translate></a>
            </div>
            <div className="bg-white/80 rounded-lg p-6 shadow-md text-center">
              <div className="text-lg font-bold mb-2"><Translate>贡献者公约</Translate></div>
              <div className="text-sm text-gray-600 mb-4"><Translate id="community.hub.code.desc">阅读社区行为准则，确保友好与高质量的协作。</Translate></div>
              <a href="/code_of_conduct" className="text-blue-600 font-semibold"><Translate>前往查看 →</Translate></a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
