import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import ReactDOM from 'react-dom';
import latestPm from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';

// NOTE: /downloads must be self-contained. The global theme does not guarantee
// that --ruyi-* CSS variables exist, so we provide safe fallbacks to existing
// Docusaurus theme tokens.
const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

const PM_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/';
const PM_GITHUB_RELEASES_URL = 'https://github.com/ruyisdk/ruyi/releases';
const PM_PYPI_URL = 'https://pypi.org/project/ruyi/';

const IDE_MIRROR_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/';
const IDE_VSCODE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-vscode-extension/releases';
const IDE_ECLIPSE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases';

function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: `linear-gradient(90deg, ${COLOR_VARS.goldDark} 0%, ${COLOR_VARS.gold} 100%)` };
  }
  return { background: `linear-gradient(90deg, ${COLOR_VARS.blue} 0%, ${COLOR_VARS.blueDark} 100%)` };
}

function primaryButtonStyle(accent) {
  if (accent === 'gold') {
    return {
      backgroundColor: COLOR_VARS.gold,
      color: COLOR_VARS.contrast,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    };
  }
  return {
    backgroundColor: COLOR_VARS.blue,
    color: 'white',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  };
}

function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: 'rgba(221, 190, 221, 0.2)', filter: 'blur(120px)' }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: 'rgba(168, 218, 220, 0.2)', filter: 'blur(120px)' }}
      />
    </div>,
    document.body,
  );
}

function PackageManagerSection({ releaseData }) {
  const hasReleaseData = Boolean(releaseData?.channels?.stable);

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      <div className="px-8 py-6 text-white" style={headerGradientStyle('gold')}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <Translate id="downloads.pm.title">RuyiSDK Package Manager</Translate>
        </h2>
        <p className="mt-2 text-lg opacity-90 text-white/90">
          <Translate id="downloads.pm.description">Ruyi 包管理器是 RuyiSDK 的核心组件，提供包管理、环境配置等功能。</Translate>
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {!hasReleaseData && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-5 py-4 rounded-xl mb-6">
            <p className="m-0">
              <Translate id="downloads.pm.noData">当前构建未能获取最新版本信息，请使用下方入口获取最新版。</Translate>
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                <Translate id="downloads.badge.stable">稳定版</Translate>
              </span>
            </div>
            <p className="m-0 text-gray-600">
              <Translate id="downloads.pm.latestOnly">前往下载页面</Translate>
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <a
              href={PM_MIRROR_RELEASES_URL}
              className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
              style={primaryButtonStyle('gold')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="mr-2 -ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <Translate id="downloads.label.mirror">镜像站</Translate>
            </a>

            <a
              href={PM_GITHUB_RELEASES_URL}
              className="w-full inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
              style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Translate id="downloads.label.githubReleases">GitHub Releases</Translate>
            </a>

            <a
              href={PM_PYPI_URL}
              className="w-full inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
              style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Translate id="downloads.label.pypi">PyPI</Translate>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
        <span className="font-medium">
          <Translate id="downloads.otherMethods">其他入口：</Translate>
        </span>
        <a href="/docs/Package-Manager/installation" className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
          <Translate id="downloads.viewDocs">查看完整安装文档</Translate>
        </a>
        <span className="text-gray-300">|</span>
        <a href={PM_GITHUB_RELEASES_URL} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
          <Translate id="downloads.label.githubReleases">GitHub Releases</Translate>
        </a>
        <span className="text-gray-300">|</span>
        <a href={PM_PYPI_URL} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
          <Translate id="downloads.label.pypi">PyPI</Translate>
        </a>
        <span className="text-gray-300">|</span>
        <a href={PM_MIRROR_RELEASES_URL} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
          <Translate id="downloads.label.mirror">镜像站</Translate>
        </a>
      </div>
    </section>
  );
}

function IDESection() {
  const entries = useMemo(() => {
    return [
      {
        title: translate({ id: 'downloads.ide.entry.mirror', message: 'IDE 镜像目录' }),
        description: translate({ id: 'downloads.ide.entry.mirror.desc', message: '获取 IDE 的最新构建/版本。' }),
        href: IDE_MIRROR_URL,
      },
      {
        title: translate({ id: 'downloads.ide.entry.vscode', message: 'RuyiSDK VS Code Extension（Releases）' }),
        description: translate({ id: 'downloads.ide.entry.vscode.desc', message: '基于 VS Code 的 RuyiSDK 扩展发布页。' }),
        href: IDE_VSCODE_RELEASES_URL,
      },
      {
        title: translate({ id: 'downloads.ide.entry.eclipse', message: 'RuyiSDK Eclipse（Releases）' }),
        description: translate({ id: 'downloads.ide.entry.eclipse.desc', message: '基于 Eclipse 的 RuyiSDK 项目发布页。' }),
        href: IDE_ECLIPSE_RELEASES_URL,
      },
    ];
  }, []);

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      <div className="px-8 py-6 text-white" style={headerGradientStyle('blue')}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <Translate id="downloads.ide.title">RuyiSDK IDE</Translate>
        </h2>
        <p className="mt-2 text-lg opacity-90 text-white/90">
          <Translate id="downloads.ide.description">IDE 相关下载与发布入口。</Translate>
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
              <Translate id="downloads.badge.stable">稳定版</Translate>
            </span>
            <span className="text-gray-500 text-sm font-medium">
              <Translate id="downloads.ide.latestOnly">前往下载页面</Translate>
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {entries.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 mb-1 group-hover:underline" style={{ color: COLOR_VARS.contrast }}>
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">{item.description}</div>
                  </div>

                  <span
                    aria-hidden
                    className="shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-all"
                    style={{ color: COLOR_VARS.blue }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v10" />
                      <path d="M7 11l5 5 5-5" />
                      <path d="M4 21h16" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DownloadsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout
      title={translate({ id: 'downloads.meta.title', message: '下载' })}
      description={translate({ id: 'downloads.meta.description', message: '下载 RuyiSDK 包管理器与 IDE' })}
    >
      <PageBackground isClient={isClient} />

      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm mb-4">
              <Translate id="downloads.title">下载 RuyiSDK</Translate>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              <Translate id="downloads.subtitle">获取 RuyiSDK 包管理器和 IDE，开启您的 RISC-V 开发之旅。</Translate>
            </p>
          </div>

          <div className="w-full grid gap-8">
            <PackageManagerSection releaseData={latestPm} />
            <IDESection />
          </div>

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
