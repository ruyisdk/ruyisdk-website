import React from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import DownloadCards, { COLOR_VARS } from '@site/src/components/Downloads/DownloadCards';
import DownloadGuide from '@site/src/components/Downloads/DownloadGuide';
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
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <PageBackground />
        <div className="mx-auto relative z-10 w-full max-w-screen-xl">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm mb-4">
              <Translate id="downloads.title">下载 RuyiSDK</Translate>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              <Translate id="downloads.subtitle">获取 RuyiSDK 包管理器和 IDE，开启您的 RISC-V 开发之旅。</Translate>
            </p>
          </div>

          <DownloadGuide sectionIds={SECTION_IDS} />
          <DownloadCards sectionIds={SECTION_IDS} />

          <div className="mt-12 text-center text-gray-500 text-sm">
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
        </div>
      </div>
    </Layout>
  );
}
