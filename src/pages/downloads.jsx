import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import ReactDOM from 'react-dom';
import latestPm from '@site/src/generated/latest_pm.json';

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

const PM_MIRROR_RELEASES_URL = 'https://fast-mirror.isrc.ac.cn/ruyisdk/ruyi/releases/';
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

function detectArchDefault() {
  if (typeof navigator === 'undefined') return 'x86_64';
  const ua = (navigator.userAgent || '').toLowerCase();
  const uaArch = (navigator.userAgentData && navigator.userAgentData.architecture) || '';

  if (/riscv64|risc-v|riscv/.test(ua) || /riscv64/.test(uaArch)) return 'riscv64';
  if (/aarch64|arm64/.test(ua) || /arm64/.test(uaArch)) return 'aarch64';
  return 'x86_64';
}

function getLocalePrefixFromPathname(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  const known = new Set(['zh-Hans', 'en', 'de']);
  const first = segments[0];
  return known.has(first) ? `/${first}` : '';
}

function withLocalePrefix(path, localePrefix) {
  if (!path.startsWith('/')) return `${localePrefix}/${path}`;
  return `${localePrefix}${path}`;
}

function extractFileName(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split('/').filter(Boolean).pop();
    return last || '';
  } catch {
    return url.split('/').pop() || '';
  }
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

function PackageManagerSection({ releaseData, isClient, localePrefix }) {
  const hasReleaseData = Boolean(releaseData?.channels?.stable);
  const stable = releaseData?.channels?.stable || null;
  const [arch, setArch] = useState(detectArchDefault());
  const [source, setSource] = useState('mirror');
  const [hasInteracted, setHasInteracted] = useState(false);

  const downloadUrls = stable?.download_urls || {};
  const archKey = `linux/${arch}`;
  const downloadEntry = downloadUrls[archKey] || [];
  const githubUrl = downloadEntry[0] || '';
  const mirrorUrl = downloadEntry[1] || '';
  const downloadUrl = source === 'github' ? (githubUrl || mirrorUrl) : (mirrorUrl || githubUrl);
  const version = stable?.version || 'latest';
  const fileName = extractFileName(downloadUrl);

  const thanksUrl = useMemo(() => {
    const parent = source === 'github'
      ? `https://github.com/ruyisdk/ruyi/releases/tag/${version}`
      : `${PM_MIRROR_RELEASES_URL}${version}/`;
    const params = new URLSearchParams({
      source: source === 'github' ? 'github' : 'mirror',
      arch,
      version,
      file: fileName,
      download: downloadUrl,
      parent,
    });
    return `${withLocalePrefix('/downloads/thanks', localePrefix)}?${params.toString()}`;
  }, [arch, downloadUrl, fileName, localePrefix, source, version]);

  useEffect(() => {
    if (!isClient) return;
    if (!hasReleaseData || !downloadUrl) return;
    if (!hasInteracted) return;
    window.location.assign(thanksUrl);
  }, [downloadUrl, hasInteracted, hasReleaseData, isClient, thanksUrl]);

  const archOptions = [
    { value: 'x86_64', label: 'x86_64' },
    { value: 'aarch64', label: 'aarch64' },
    { value: 'riscv64', label: 'riscv64' },
  ];

  const handleArchSelect = (value) => {
    setArch(value);
    setHasInteracted(true);
  };

  const handleSourceToggle = () => {
    setSource((prev) => (prev === 'mirror' ? 'github' : 'mirror'));
    setHasInteracted(true);
  };

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

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <Translate id="downloads.pm.selector.title">Start Locally</Translate>
              </div>
              <p className="mt-2 text-gray-700">
                <Translate id="downloads.pm.selector.subtitle">选择偏好并开始下载。切换架构后将自动开始下载并跳转到感谢页面。</Translate>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                <Translate id="downloads.badge.stable">稳定版</Translate>
              </span>
              <span className="text-sm text-gray-500">
                <Translate id="downloads.label.version">版本</Translate> {version}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm font-semibold text-gray-600">
                <Translate id="downloads.pm.selector.channel">Build</Translate>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200" style={{ color: COLOR_VARS.contrast }}>
                  <Translate id="downloads.pm.selector.channel.stable">Stable</Translate>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm font-semibold text-gray-600">
                <Translate id="downloads.pm.selector.os">Your OS</Translate>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200" style={{ color: COLOR_VARS.contrast }}>
                  <Translate id="downloads.pm.selector.os.linux">Linux</Translate>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm font-semibold text-gray-600">
                <Translate id="downloads.pm.selector.arch">Architecture</Translate>
              </div>
              <div className="flex flex-wrap gap-2">
                {archOptions.map((option) => {
                  const isActive = option.value === arch;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleArchSelect(option.value)}
                      className="px-4 py-2 rounded-full text-sm font-semibold border transition-all"
                      style={{
                        backgroundColor: isActive ? COLOR_VARS.gold : 'white',
                        color: isActive ? COLOR_VARS.contrast : COLOR_VARS.contrast,
                        borderColor: isActive ? 'transparent' : 'rgba(0,0,0,0.16)',
                        boxShadow: isActive ? '0 8px 16px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm font-semibold text-gray-600">
                <Translate id="downloads.pm.selector.source">Source</Translate>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium" style={{ color: source === 'mirror' ? COLOR_VARS.contrast : '#6b7280' }}>
                  <Translate id="downloads.pm.selector.source.mirror">Fast Mirror</Translate>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={source === 'github'}
                  onClick={handleSourceToggle}
                  className="relative inline-flex items-center"
                  style={{
                    width: 52,
                    height: 28,
                    borderRadius: 999,
                    backgroundColor: source === 'github' ? COLOR_VARS.blue : 'rgba(0,0,0,0.2)',
                    transition: 'background-color 200ms ease',
                    padding: 2,
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      transform: source === 'github' ? 'translateX(24px)' : 'translateX(0px)',
                      transition: 'transform 200ms ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    }}
                  />
                </button>
                <span className="text-sm font-medium" style={{ color: source === 'github' ? COLOR_VARS.contrast : '#6b7280' }}>
                  <Translate id="downloads.pm.selector.source.github">GitHub</Translate>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <Translate id="downloads.pm.selector.download">Download</Translate>
                </div>
                <div className="text-base font-semibold text-gray-900 mt-1" style={{ wordBreak: 'break-all' }}>
                  {fileName || '-'}
                </div>
              </div>
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-lg font-extrabold min-w-[160px] border border-transparent shadow-md hover:shadow-lg transition-all"
                  style={primaryButtonStyle('gold')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setHasInteracted(true)}
                >
                  <Translate id="downloads.pm.selector.download.link">Direct download link</Translate>
                </a>
              ) : (
                <span className="text-sm text-gray-500">
                  <Translate id="downloads.pm.noData">当前构建未能获取最新版本信息，请使用下方入口获取最新版。</Translate>
                </span>
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <Translate id="downloads.pm.selector.download.note">If the download doesn't start, use the direct link.</Translate>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getLocalePrefixFromPathname(window.location.pathname);
  }, []);

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
            <PackageManagerSection releaseData={latestPm} isClient={isClient} localePrefix={localePrefix} />
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
