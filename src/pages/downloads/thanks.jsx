import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import ReactDOM from 'react-dom';

// Keep this page self-contained, same rationale as /downloads.
const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  eclipse: '#5f3dc4',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: 'linear-gradient(90deg, rgba(255, 247, 230, 0.98) 0%, rgba(255, 253, 245, 0.98) 100%)' };
  }
  if (accent === 'eclipse') {
    return { background: 'linear-gradient(90deg, rgba(239, 235, 255, 0.96) 0%, rgba(250, 248, 255, 0.98) 100%)' };
  }
  return { background: 'linear-gradient(90deg, rgba(236, 246, 255, 0.98) 0%, rgba(248, 252, 255, 0.98) 100%)' };
}

function buttonStyle(variant, accent) {
  if (variant === 'secondary') {
    return { color: COLOR_VARS.contrast, background: '#fff', border: '1px solid rgba(0,0,0,0.16)' };
  }
  if (accent === 'gold') {
    return {
      backgroundColor: 'rgba(232, 183, 22, 0.18)',
      background: 'rgba(232, 183, 22, 0.18)',
      color: '#8c6b00',
      boxShadow: 'none',
    };
  }
  if (accent === 'eclipse') {
    return {
      backgroundColor: 'rgba(95, 61, 196, 0.14)',
      background: 'rgba(95, 61, 196, 0.14)',
      color: COLOR_VARS.eclipse,
      boxShadow: 'none',
    };
  }
  return {
    backgroundColor: 'rgba(45, 120, 255, 0.14)',
    background: 'rgba(45, 120, 255, 0.14)',
    color: COLOR_VARS.blue,
    boxShadow: 'none',
  };
}

function getDownloadAccent(product, download) {
  if (product === 'eclipse') return 'eclipse';
  if (product === 'vscode') return 'blue';
  if (product === 'pm') return 'gold';

  const normalized = (download || '').toLowerCase();
  if (normalized.includes('eclipse')) return 'eclipse';
  if (normalized.includes('vscode') || normalized.includes('vsix')) return 'blue';
  return 'gold';
}

function getInstallDocsPath(accent) {
  if (accent === 'blue') return '/docs/VSCode-Plugins/';
  if (accent === 'eclipse') return '/docs/IDE/';
  return '/docs/Package-Manager/installation';
}

function iconColor(accent) {
  if (accent === 'eclipse') return COLOR_VARS.eclipse;
  if (accent === 'gold') return COLOR_VARS.goldDark;
  return COLOR_VARS.blueDark;
}

function safeParseUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed;
  } catch {
    return null;
  }
}

function triggerDownload(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return;

  const allowedHosts = new Set(['mirror.iscas.ac.cn', 'github.com']);
  if (!allowedHosts.has(parsed.hostname)) return;

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = parsed.toString();
  document.body.appendChild(iframe);

  window.setTimeout(() => {
    try {
      document.body.removeChild(iframe);
    } catch {
      // no-op
    }
  }, 15_000);
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

function LoadingDots() {
  return (
    <>
      <style>{`
        @keyframes downloadRetryDot {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
      `}</style>
      <span className="ml-1 inline-flex w-5 justify-start" aria-hidden="true">
        <span style={{ animation: 'downloadRetryDot 1.2s infinite' }}>.</span>
        <span style={{ animation: 'downloadRetryDot 1.2s infinite', animationDelay: '200ms' }}>.</span>
        <span style={{ animation: 'downloadRetryDot 1.2s infinite', animationDelay: '400ms' }}>.</span>
      </span>
    </>
  );
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

export default function DownloadThanksPage() {
  const [isClient, setIsClient] = useState(false);
  const [retryEnabled, setRetryEnabled] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const params = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search || '');
  }, []);

  const source = params.get('source') || '';
  const arch = params.get('arch') || '';
  const version = params.get('version') || '';
  const file = params.get('file') || '';
  const product = params.get('product') || '';
  const downloadRaw = params.get('download') || '';
  const download = safeParseUrl(downloadRaw)?.toString() || '';
  const accent = getDownloadAccent(product, download);
  const installDocsPath = getInstallDocsPath(accent);

  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getLocalePrefixFromPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!download) return;
    triggerDownload(download);
  }, [isClient, download]);

  useEffect(() => {
    if (!download) return undefined;
    const id = window.setTimeout(() => {
      setRetryEnabled(true);
    }, 5_000);
    return () => window.clearTimeout(id);
  }, [download]);

  const sourceLabel =
    source === 'mirror'
      ? translate({ id: 'downloads.thanks.source.mirror', message: '软件所镜像站' })
      : source === 'github'
        ? translate({ id: 'downloads.thanks.source.github', message: 'GitHub Releases' })
        : translate({ id: 'downloads.thanks.source.unknown', message: '下载源' });

  return (
    <Layout
      title={translate({ id: 'downloads.thanks.meta.title', message: '感谢下载' })}
      description={translate({ id: 'downloads.thanks.meta.description', message: '感谢下载 RuyiSDK 包管理器' })}
    >
      <PageBackground isClient={isClient} />

      <div className="relative text-gray-800 font-inter">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 mt-16 mb-24">
        <div className="relative mx-auto w-full z-10">
          <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-8 py-6" style={headerGradientStyle(accent)}>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: iconColor(accent) }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Translate id="downloads.thanks.title">感谢下载 RuyiSDK</Translate>
              </h1>
              <p className="mt-2 text-lg text-gray-700">
                <Translate id="downloads.thanks.subtitle">下载已经开始（若遇浏览器拦截，请检查下载设置）</Translate>
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-gray-800">
                  <div className="font-bold text-gray-900" style={{ color: COLOR_VARS.contrast }}>
                    <Translate id="downloads.thanks.details">下载详情</Translate>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="text-gray-500">
                        <Translate id="downloads.thanks.field.source">来源</Translate>
                      </div>
                      <div className="font-semibold mt-1">{sourceLabel}</div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="text-gray-500">
                        <Translate id="downloads.thanks.field.arch">架构</Translate>
                      </div>
                      <div className="font-semibold mt-1">{arch || '-'}</div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="text-gray-500">
                        <Translate id="downloads.thanks.field.version">版本</Translate>
                      </div>
                      <div className="font-semibold mt-1">{version || '-'}</div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="text-gray-500">
                        <Translate id="downloads.thanks.field.file">文件名</Translate>
                      </div>
                      <div className="font-semibold mt-1" style={{ wordBreak: 'break-all' }}>
                        {file || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {download && retryEnabled && (
                      <a
                        href={download}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary-button text-sm font-semibold whitespace-nowrap"
                        style={buttonStyle('secondary', accent)}
                      >
                        <Translate id="downloads.thanks.retry">无响应？点此重试</Translate>
                      </a>
                    )}
                    {download && !retryEnabled && (
                      <button
                        type="button"
                        disabled
                        className="secondary-button text-sm font-semibold whitespace-nowrap"
                        style={{ ...buttonStyle('secondary', accent), opacity: 0.55, cursor: 'not-allowed', transform: 'none' }}
                      >
                        <Translate id="downloads.thanks.retryWaiting">正在开始下载</Translate>
                        <LoadingDots />
                      </button>
                    )}

                    <a
                      href={withLocalePrefix(installDocsPath, localePrefix)}
                      className="primary-button text-sm font-semibold whitespace-nowrap"
                      style={buttonStyle('primary', accent)}
                    >
                      <Translate id="downloads.thanks.gotoInstallDocs">下一步：阅读安装文档</Translate>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    </Layout>
  );
}
