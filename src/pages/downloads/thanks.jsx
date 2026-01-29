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
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

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

  const allowedHosts = new Set(['mirror.iscas.ac.cn', 'fast-mirror.isrc.ac.cn', 'mirror.isrc.ac.cn', 'github.com']);
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
  const parentRaw = params.get('parent') || '';
  const parent = safeParseUrl(parentRaw)?.toString() || '';
  const downloadRaw = params.get('download') || '';
  const download = safeParseUrl(downloadRaw)?.toString() || '';

  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getLocalePrefixFromPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (!download) return;
    triggerDownload(download);
  }, [isClient, download]);

  const sourceLabel =
    source === 'mirror' || source === 'fast-mirror'
      ? translate({ id: 'downloads.thanks.source.mirror', message: '极速镜像' })
      : source === 'github'
        ? translate({ id: 'downloads.thanks.source.github', message: 'GitHub Releases' })
        : translate({ id: 'downloads.thanks.source.unknown', message: '下载源' });

  return (
    <Layout
      title={translate({ id: 'downloads.thanks.meta.title', message: '感谢下载' })}
      description={translate({ id: 'downloads.thanks.meta.description', message: '感谢下载 RuyiSDK 包管理器' })}
    >
      <PageBackground isClient={isClient} />

      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 text-white" style={headerGradientStyle('gold')}>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Translate id="downloads.thanks.title">感谢下载</Translate>
              </h1>
              <p className="mt-2 text-lg opacity-90 text-white/90">
                <Translate id="downloads.thanks.subtitle">您的下载已开始（若浏览器拦截下载，请检查下载设置）。</Translate>
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
                        <Translate id="downloads.thanks.field.file">文件</Translate>
                      </div>
                      <div className="font-semibold mt-1" style={{ wordBreak: 'break-all' }}>
                        {file || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row gap-3">
                    <a
                      href={withLocalePrefix('/docs/Package-Manager/installation', localePrefix)}
                      className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
                      style={primaryButtonStyle('gold')}
                    >
                      <Translate id="downloads.thanks.gotoInstallDocs">查看安装文档</Translate>
                    </a>

                    {parent && (
                      <a
                        href={parent}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
                        style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
                      >
                        <Translate id="downloads.thanks.gotoParent">前往上级目录</Translate>
                      </a>
                    )}

                    <a
                      href={withLocalePrefix('/downloads', localePrefix)}
                      className="w-full inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
                      style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
                    >
                      <Translate id="downloads.thanks.back">返回下载页</Translate>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="font-medium">
                <Translate id="downloads.thanks.more">下一步：</Translate>
              </span>
              <a
                href={withLocalePrefix('/docs/Package-Manager/installation', localePrefix)}
                className="hover:underline font-medium transition-colors"
                style={{ color: COLOR_VARS.contrast }}
              >
                <Translate id="downloads.thanks.more.install">阅读安装文档并完成安装</Translate>
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
