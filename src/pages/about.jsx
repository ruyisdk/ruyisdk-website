import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import ReactDOM from "react-dom";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { QRCode, QRGroup } from "@site/src/components/common";

import AboutEn from "@site/src/components/About/about.en.mdx";
import AboutZh from "@site/src/components/About/about.zh-Hans.mdx";
import AboutDe from "@site/src/components/About/about.de.mdx";

// 与 /Community/contributors 页面保持相同的背景风格
function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: "rgba(221, 190, 221, 0.2)", filter: "blur(120px)" }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: "rgba(168, 218, 220, 0.2)", filter: "blur(120px)" }}
      />
    </div>,
    document.body,
  );
}

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);
  const { i18n } = useDocusaurusContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pageTitle = i18n?.currentLocale === "zh-Hans" ? "关于我们" : i18n?.currentLocale === "de" ? "Über uns" : "About";

  return (
    <Layout
      title={pageTitle}
      description="RuyiSDK 项目介绍与联系方式"
    >
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site flex flex-col items-center">
          {/* 顶部居中的 名称（已移除 'RuyiSDK' 文本） */}

          {/* 内容主体卡片 */}
          <div className="w-full grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
            {(() => {
              let Content = AboutEn;
              if (i18n?.currentLocale === "zh-Hans") {
                Content = AboutZh;
              } else if (i18n?.currentLocale === "de") {
                Content = AboutDe;
              }
              return <Content />;
            })()}
            {/* 右侧：联系方式与二维码卡片 */}
            <aside className="space-y-6">
              <section className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                  <Translate id="about.contact.title">联系我们</Translate>
                </h2>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  <li>
                    <span className="font-medium">
                      <Translate id="about.contact.emailLabel">电子邮件：</Translate>
                    </span>
                    <a
                      href="mailto:contact@ruyisdk.cn"
                      className="text-sky-600 hover:text-sky-700 hover:underline ml-1"
                    >
                      contact@ruyisdk.cn
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">
                      <Translate id="about.contact.websiteLabel">官方网站：</Translate>
                    </span>
                    <a
                      href="http://www.ruyisdk.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-700 hover:underline ml-1"
                    >
                      www.ruyisdk.org
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">GitHub：</span>
                    <a
                      href="https://github.com/ruyisdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-700 hover:underline ml-1"
                    >
                      ruyisdk
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">
                      <Translate id="about.contact.wechatLabel">微信公众号：</Translate>
                    </span>
                    <span className="ml-1">RUYISDK</span>
                  </li>
                  <li>
                    <span className="font-medium">
                      <Translate id="about.contact.qqLabel">技术交流群 QQ 群：</Translate>
                    </span>
                    <span className="ml-1">544940413</span>
                  </li>
                </ul>
              </section>

              <section className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">
                  <Translate id="about.qr.title">社区二维码</Translate>
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 mb-2 text-sm md:text-base">
                      <Translate id="about.qr.wechat">微信扫一扫关注 RuyiSDK 官方公众号：</Translate>
                    </p>
                    <QRGroup align="left" gap="15px">
                      <QRCode
                        src="/img/QRCode_img/wechat_account_img.png"
                        size={140}
                        location="left"
                      />
                    </QRGroup>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2 text-sm md:text-base">
                      <Translate id="about.qr.qq">加入 RUYISDK 技术交流群 QQ 群：</Translate>
                    </p>
                    <QRGroup align="left" gap="15px">
                      <QRCode
                        src="/img/QRCode_img/qqgroup_img.png"
                        QRnumber="544940413"
                      />
                    </QRGroup>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
