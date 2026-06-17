import React from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import DownloadCards, { COLOR_VARS } from '@site/src/components/Downloads/DownloadCards';
import DownloadGuide from '@site/src/components/Downloads/DownloadGuide';
import DownloadInstallScript from '@site/src/components/Downloads/DownloadInstallScript';
import { PageBackground } from '@site/src/components/Home/Background';

const SECTION_IDS = {
  packageManager: 'ruyisdk-package-manager',
  vscodeExtension: 'ruyisdk-vscode-extension',
  eclipseExtension: 'ruyisdk-eclipse-extension',
};

export default function DownloadsPage() {
  return (
    <Layout
      title={translate({ id: 'downloads.meta.title', message: '下载' })}
      description={translate({ id: 'downloads.meta.description', message: '下载 RuyiSDK 包管理器与 IDE' })}
    >
      <div className="relative min-h-screen text-gray-800 font-inter">
        <PageBackground />
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 mt-16">
        <div className="relative mx-auto w-full z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 drop-shadow-sm">
            <Translate id="downloads.title">下载 RuyiSDK</Translate>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed text-center mt-8">
            <Translate id="downloads.subtitle">获取 RuyiSDK 包管理器和 IDE，开启您的 RISC-V 开发之旅</Translate>
          </p>

          <DownloadGuide />

          <div className="mb-8 text-center text-gray-500 text-sm">
            <p>
              <Translate
                id="downloads.agreement"
                values={{
                  privacyLink: (
                    <a href="/docs/legal/privacyPolicy/" className="hover:underline" style={{ color: COLOR_VARS.blue }}>
                      <Translate id="downloads.privacy">隐私声明</Translate>
                    </a>
                  ),
                }}
              >
                {'下载并使用 RuyiSDK，即表示您同意许可条款和 {privacyLink}。'}
              </Translate>
            </p>
          </div>

          <h2 className="mb-4 pl-2 text-left text-2xl md:text-3xl font-bold text-gray-900">
            <Translate id="downloads.installScript.title">使用安装脚本</Translate>
          </h2>
          <DownloadInstallScript />
          <div className="pt-8">
            <h2 className="mb-4 pl-2 text-left text-2xl md:text-3xl font-bold text-gray-900">
              <Translate id="downloads.manualDownload.title">手动下载安装</Translate>
            </h2>
          </div>
          <div className="mb-24">
            <DownloadCards sectionIds={SECTION_IDS} />
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
