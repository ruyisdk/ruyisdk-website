import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import { PageBackground } from '@site/src/components/Home/Background';

function headerGradientClass(accent) {
  if (accent === 'gold') {
    return 'bg-gradient-to-r from-[#fffbeb] via-[#fffef7] to-white dark:from-amber-500/12 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  if (accent === 'eclipse') {
    return 'bg-gradient-to-r from-[#f3f4ff] via-[#f9faff] to-white dark:from-indigo-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  return 'bg-gradient-to-r from-[#eff5ff] via-[#f8fbff] to-white dark:from-blue-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
}

function iconColorClass(accent) {
  if (accent === 'eclipse') return 'text-[#3730a3] dark:text-indigo-300';
  if (accent === 'gold') return 'text-[#c88a04] dark:text-amber-400';
  return 'text-[#1648B8] dark:text-[#79a8ff]';
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

export default function DownloadThanksPage() {
  const [isClient, setIsClient] = useState(false);
  const [retryEnabled, setRetryEnabled] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const params = useMemo(() => {
    if (!isClient || typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search || '');
  }, [isClient]);

  const source = params?.get('source') || '';
  const arch = params?.get('arch') || '';
  const version = params?.get('version') || '';
  const file = params?.get('file') || '';
  const product = params?.get('product') || '';
  const downloadRaw = params?.get('download') || '';
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
      <div className="relative min-h-[70vh] text-slate-900 dark:text-slate-100 font-inter">
        <PageBackground />
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 mt-16 mb-24">
        {params && (
        <div className="relative mx-auto w-full z-10">
          <section className="bg-white dark:bg-[#151b23] rounded-3xl shadow-[0_12px_32px_rgba(10,44,126,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-white/10 overflow-hidden">
            <div className={`px-8 py-6 border-b border-slate-200/75 dark:border-white/10 ${headerGradientClass(accent)}`}>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-slate-900 dark:text-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 shrink-0 ${iconColorClass(accent)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Translate id="downloads.thanks.title">感谢下载 RuyiSDK</Translate>
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                <Translate id="downloads.thanks.subtitle">下载已经开始（若遇浏览器拦截，请检查下载设置）</Translate>
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="bg-[#f8fafd] dark:bg-[#1c2330]/75 rounded-2xl p-6 border border-slate-200/85 dark:border-white/10">
                <div className="text-slate-800 dark:text-slate-200">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    <Translate id="downloads.thanks.details">下载详情</Translate>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="bg-white dark:bg-[#151b23] rounded-xl border border-slate-200/85 dark:border-white/10 p-4">
                      <div className="text-slate-500 dark:text-slate-400">
                        <Translate id="downloads.thanks.field.source">来源</Translate>
                      </div>
                      <div className="font-semibold mt-1">{sourceLabel}</div>
                    </div>

                    <div className="bg-white dark:bg-[#151b23] rounded-xl border border-slate-200/85 dark:border-white/10 p-4">
                      <div className="text-slate-500 dark:text-slate-400">
                        <Translate id="downloads.thanks.field.arch">架构</Translate>
                      </div>
                      <div className="font-semibold mt-1">{arch || '-'}</div>
                    </div>

                    <div className="bg-white dark:bg-[#151b23] rounded-xl border border-slate-200/85 dark:border-white/10 p-4">
                      <div className="text-slate-500 dark:text-slate-400">
                        <Translate id="downloads.thanks.field.version">版本</Translate>
                      </div>
                      <div className="font-semibold mt-1">{version || '-'}</div>
                    </div>

                    <div className="bg-white dark:bg-[#151b23] rounded-xl border border-slate-200/85 dark:border-white/10 p-4">
                      <div className="text-slate-500 dark:text-slate-400">
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
                      >
                        <Translate id="downloads.thanks.retry">无响应？点此重试</Translate>
                      </a>
                    )}
                    {download && !retryEnabled && (
                      <button
                        type="button"
                        disabled
                        className="secondary-button text-sm font-semibold whitespace-nowrap"
                        style={{ opacity: 0.5, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' }}
                      >
                        <Translate id="downloads.thanks.retryWaiting">正在开始下载</Translate>
                        <LoadingDots />
                      </button>
                    )}

                    <a
                      href={withLocalePrefix(installDocsPath, localePrefix)}
                      className="primary-button text-sm font-semibold whitespace-nowrap"
                    >
                      <Translate id="downloads.thanks.gotoInstallDocs">下一步：阅读安装文档</Translate>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}
        </div>
      </div>
    </Layout>
  );
}
