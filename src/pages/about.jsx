import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import ReactDOM from "react-dom";
import { QRCode, QRGroup } from "@site/src/components/common";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout
      title="About RuyiSDK"
      description="RuyiSDK 项目介绍与联系方式"
    >
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site flex flex-col items-center">
          {/* 顶部居中的 Logo 与名称 */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center rounded-2xl bg-white/80 shadow-lg border border-white/70">
              <img
                src="/img/ruyi-logo-720.svg"
                alt="RuyiSDK logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
              RuyiSDK
            </h1>
          </div>

          {/* 内容主体卡片 */}
          <div className="w-full grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
            {/* 左侧：项目介绍与目标 */}
            <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                <Translate id="about.intro.title">关于我们</Translate>
              </h2>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
                <Translate id="about.project.title">项目介绍</Translate>
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                <Translate id="about.project.description">
                  RUYISDK 是一款专为 RISC-V 开发者打造的全方位、集成式全功能开发环境。RUYISDK 由中国科学院软件研究所（ISCAS）主导，旨在为 RISC-V 开发者提供一站式的开发解决方案。本项目从 2022 年下半年开始筹划，从 2024 年年初起变更为双周发布的敏捷开发方式。项目启动以来，我们不断优化产品，致力于为广大 RISC-V 开发者提供优质的服务。
                </Translate>
              </p>

              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
                <Translate id="about.goals.title">核心目标</Translate>
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm md:text-base mb-4">
                <li>
                  <Translate id="about.goals.item1">
                    开发者购买了（几乎）任何一款 RISC-V 开发板或模组，都可以通过 RUYISDK 系统获得硬件资料说明、固件/软件更新、调试支持等。
                  </Translate>
                </li>
                <li>
                  <Translate id="about.goals.item2">
                    开发者可以指定任何常用的 RISC-V 扩展指令集架构组合，都可以通过 RUYISDK 系统生成客户所需的操作系统、工具链、语言执行环境（运行时或虚拟机）、计算库、应用框架等。
                  </Translate>
                </li>
                <li>
                  <Translate id="about.goals.item3">
                    培育运营一个活跃全面的开发者交流社区。
                  </Translate>
                </li>
              </ol>

              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
                <Translate id="about.products.title">我们的产品</Translate>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm md:text-base mb-4">
                <li>
                  <Translate id="about.products.revyos">
                    RISC-V 操作系统（XuanTie 芯片优化定制发行版）：
                  </Translate>
                  {" "}
                  <a
                    href="https://github.com/ruyisdk/revyos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    RevyOS
                  </a>
                </li>
                <li>
                  <Translate id="about.products.ruyi">RISC-V 包管理器：</Translate>{" "}
                  <a
                    href="https://github.com/ruyisdk/ruyi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    ruyi
                  </a>
                </li>
                <li>
                  <Translate id="about.products.provision">RISC-V 操作系统安装工具：ruyi device provision</Translate>
                </li>
                <li>
                  <Translate id="about.products.ide">RISC-V IDE：RuyiSDK IDE</Translate>
                </li>
                <li>
                  <Translate id="about.products.toolchains">RISC-V 编译工具链：PLCT-GCC、PLCT-LLVM</Translate>
                </li>
                <li>
                  <Translate id="about.products.software.title">
                    重点参与 RISC-V 适配和支持的软件（已集成到 RuyiSDK 软件源的部分）：
                  </Translate>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>QEMU</li>
                    <li>Box64</li>
                    <li>LuaJIT</li>
                    <li>DynamoRIO</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
                <Translate id="about.opensource.title">开源贡献与社区</Translate>
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-2">
                <Translate id="about.opensource.description1">
                  RUYISDK 项目采用开源管理模式，代码托管于 GitHub。我们欢迎广大开发者参与项目，共同推动 RISC-V 技术的发展。
                </Translate>
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-2">
                <Translate id="about.opensource.description2">
                  RUYISDK 社区旨在建设一个开放、友善、多样化、包容、健康活跃的社区。
                </Translate>
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                <Translate id="about.opensource.description3">
                  我们正在寻找有激情、有才华的您加入我们的团队。如果您对 RISC-V 技术充满热情，欢迎投递简历至：吴老师 wuwei2016@iscas.ac.cn。
                </Translate>
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                <Translate id="about.opensource.description4">
                  在参与社区讨论前，请先查阅社区守则以便更好地在社区内交流。
                </Translate>{" "}
                <a
                  href="/code_of_conduct"
                  className="text-sky-600 hover:text-sky-700 hover:underline"
                >
                  <Translate id="about.opensource.codeOfConduct">社区守则</Translate>
                </a>
                。
              </p>
            </section>

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
