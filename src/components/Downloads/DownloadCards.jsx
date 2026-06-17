import React, { useEffect, useMemo, useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import latestPmBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';
import latestVscodeBuilt from '@site/static/data/api/api_github_com/ruyisdk-vscode-extension_latest.json';
import latestEclipseBuilt from '@site/static/data/api/api_github_com/ruyisdk-eclipse-plugins_latest.json';

export const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  eclipse: '#5f3dc4',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

const ARCH_ORDER = ['x86_64', 'aarch64', 'riscv64', 'universal'];
const KNOWN_LOCALES = new Set(['zh-Hans', 'en', 'de']);

const PM_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-pm';
const VSCODE_RELEASE_LATEST_API = 'https://api.github.com/repos/ruyisdk/ruyisdk-vscode-extension/releases/latest';
const ECLIPSE_RELEASE_LATEST_API = 'https://api.github.com/repos/ruyisdk/ruyisdk-eclipse-plugins/releases/latest';

const PM_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/';
const PM_GITHUB_RELEASES_URL = 'https://github.com/ruyisdk/ruyi/releases';
const PM_PYPI_URL = 'https://pypi.org/project/ruyi/';

const IDE_MIRROR_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/';
const IDE_VSCODE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-vscode-extension/releases';
const IDE_ECLIPSE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases';

function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: 'linear-gradient(90deg, rgba(255, 247, 230, 0.98) 0%, rgba(255, 253, 245, 0.98) 100%)' };
  }
  if (accent === 'eclipse') {
    return { background: 'linear-gradient(90deg, rgba(239, 235, 255, 0.96) 0%, rgba(250, 248, 255, 0.98) 100%)' };
  }
  return { background: 'linear-gradient(90deg, rgba(236, 246, 255, 0.98) 0%, rgba(248, 252, 255, 0.98) 100%)' };
}

function latestButtonStyle(accent) {
  if (accent === 'gold') {
    return {
      backgroundColor: 'rgba(232, 183, 22, 0.18)',
      color: '#8c6b00',
      boxShadow: 'none',
    };
  }
  if (accent === 'eclipse') {
    return {
      backgroundColor: 'rgba(95, 61, 196, 0.14)',
      color: COLOR_VARS.eclipse,
      boxShadow: 'none',
    };
  }
  return {
    backgroundColor: 'rgba(45, 120, 255, 0.14)',
    color: COLOR_VARS.blue,
    boxShadow: 'none',
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

function withLocalePrefix(path, localePrefix) {
  if (!path.startsWith('/')) return `${localePrefix}/${path}`;
  return `${localePrefix}${path}`;
}

function getLocalePrefixFromPathname(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  const first = segments[0];
  return KNOWN_LOCALES.has(first) ? `/${first}` : '';
}

function startDownloadWithUserGesture(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return false;

  const allowedHosts = new Set(['mirror.iscas.ac.cn', 'github.com']);
  if (!allowedHosts.has(parsed.hostname)) return false;

  try {
    const popup = window.open('about:blank', '_blank');
    if (popup) {
      popup.opener = null;
      popup.location.href = parsed.toString();
      return true;
    }
  } catch {
    // no-op
  }

  try {
    const anchor = document.createElement('a');
    anchor.href = parsed.toString();
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    // no-op
  }

  return false;
}

export function detectSource(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return 'unknown';
  if (parsed.hostname.includes('mirror.iscas.ac.cn')) return 'mirror';
  if (parsed.hostname.includes('github.com')) return 'github';
  return 'unknown';
}

export function extractFileName(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return '';
  const parts = parsed.pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || '');
}

function pickPreferredUrl(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  const mirror = urls.find((url) => url.includes('mirror.iscas.ac.cn'));
  return mirror || urls[0] || '';
}

function archLabel(arch) {
  if (arch === 'x86_64') return translate({ id: 'downloads.arch.x86_64', message: 'x86_64' });
  if (arch === 'aarch64') return translate({ id: 'downloads.arch.aarch64', message: 'aarch64' });
  if (arch === 'riscv64') return translate({ id: 'downloads.arch.riscv64', message: 'riscv64' });
  return translate({ id: 'downloads.arch.universal', message: '通用（无架构区分）' });
}

function normalizeLatestRelease(data) {
  const firstAsset = Array.isArray(data?.assets) ? data.assets.find((item) => item?.browser_download_url) : null;
  return {
    version: data?.tag_name || data?.name || '-',
    downloadUrl: firstAsset?.browser_download_url || '',
    fileName: firstAsset?.name || '',
  };
}

export function ArchSelectModal({ modalState, onClose, onSelect }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!modalState.open) return;
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => {
      window.cancelAnimationFrame(id);
      setEntered(false);
    };
  }, [modalState.open]);

  if (!modalState.open) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0'}`}>
      <button aria-label="close" type="button" className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all duration-200 ${entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="text-lg font-bold text-gray-900">
              <Translate id="downloads.modal.title">选择架构并下载</Translate>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {modalState.projectLabel} · <Translate id="downloads.modal.latestVersion">最新版本</Translate> {modalState.version || '-'}
            </div>
          </div>

          <div className="p-4 grid gap-3">
            {modalState.options.length > 0 ? (
              modalState.options.map((item) => (
                <button
                  key={`${item.arch}-${item.url}`}
                  type="button"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all px-4 py-3 text-left"
                  onClick={() => onSelect(item)}
                >
                  <div className="font-semibold text-gray-900">{archLabel(item.arch)}</div>
                  <div className="mt-1 text-xs text-gray-500" style={{ wordBreak: 'break-all' }}>{item.fileName || item.url}</div>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 px-4 py-3 text-sm">
                <Translate id="downloads.modal.noOptions">当前无法获取该项目的最新版下载链接，请使用“其它版本”。</Translate>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center px-5 py-2.5 border rounded-lg bg-white hover:bg-gray-50 font-medium"
              style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
              onClick={onClose}
            >
              <Translate id="downloads.modal.cancel">取消</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageManagerSection({ sectionId, releaseData, onOpenLatest }) {
  const hasReleaseData = Boolean(releaseData?.channels?.stable);
  const stable = releaseData?.channels?.stable;
  const latestVersion = stable?.version || '-';

  const options = useMemo(() => {
    if (!stable?.download_urls) return [];
    return Object.entries(stable.download_urls)
      .map(([platformArch, urls]) => {
        const arch = platformArch.split('/').pop() || 'universal';
        const url = pickPreferredUrl(urls);
        return {
          arch,
          url,
          fileName: extractFileName(url),
          source: detectSource(url),
        };
      })
      .filter((item) => item.url)
      .sort((a, b) => ARCH_ORDER.indexOf(a.arch) - ARCH_ORDER.indexOf(b.arch));
  }, [stable]);

  return (
    <section id={sectionId} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl scroll-mt-24">
      <div className="relative overflow-hidden px-8 py-6" style={headerGradientStyle('gold')}>
        <div className="min-w-0 md:pr-44">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLOR_VARS.goldDark }}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <Translate id="downloads.pm.title">RuyiSDK Package Manager</Translate>
          </h2>
          <p className="mt-2 text-lg text-gray-700">
            <Translate id="downloads.pm.description">Ruyi 包管理器是 RuyiSDK 的核心组件，提供包管理、环境配置等功能。</Translate>
          </p>
        </div>
        <img
          src="/img/ruyi-logo-720.svg"
          alt="RuyiSDK"
          className="hidden md:block pointer-events-none select-none absolute right-6 top-2 h-36 w-auto object-contain"
          style={{ transform: 'translateY(12px)' }}
        />
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
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="w-full sm:w-52 inline-flex flex-col items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
              style={latestButtonStyle('gold')}
              onClick={() =>
                onOpenLatest({
                  projectLabel: translate({ id: 'downloads.pm.title', message: 'RuyiSDK Package Manager' }),
                  version: latestVersion,
                  options,
                  parentUrl: PM_MIRROR_RELEASES_URL,
                })
              }
              disabled={options.length === 0}
            >
              <span className="inline-flex items-center">
                <svg className="mr-2 -ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <Translate id="downloads.button.latest">最新版本</Translate>
              </span>
              <span className="text-xs font-medium mt-1 opacity-80">
                <Translate id="downloads.button.version">版本</Translate> {latestVersion}
              </span>
            </button>

            <a
              href={PM_MIRROR_RELEASES_URL}
              className="w-full sm:w-40 inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
              style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Translate id="downloads.button.otherVersions">其它版本</Translate>
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
      </div>
    </section>
  );
}

function ExtensionSection({
  sectionId,
  titleId,
  titleMessage,
  descriptionId,
  descriptionMessage,
  href,
  accent = 'blue',
  logoSrc,
  logoAlt,
  showIdeLink = false,
  latestVersion,
  latestDownloadUrl,
  latestFileName,
  onDirectLatest,
  isLoadingLatest,
}) {
  const options = useMemo(() => {
    if (!latestDownloadUrl) return [];
    return [
      {
        arch: 'universal',
        url: latestDownloadUrl,
        fileName: latestFileName || extractFileName(latestDownloadUrl),
        source: detectSource(latestDownloadUrl),
      },
    ];
  }, [latestDownloadUrl, latestFileName]);

  return (
    <section id={sectionId} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl scroll-mt-24">
      <div className="relative overflow-hidden px-8 py-6" style={headerGradientStyle(accent)}>
        <div className="min-w-0 md:pr-44">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accent === 'eclipse' ? COLOR_VARS.eclipse : COLOR_VARS.blueDark }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <Translate id={titleId}>{titleMessage}</Translate>
          </h2>
          <p className="mt-2 text-lg text-gray-700">
            <Translate id={descriptionId}>{descriptionMessage}</Translate>
          </p>
        </div>
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoAlt}
            className="hidden md:block pointer-events-none select-none absolute right-6 top-2 h-40 w-auto object-contain"
            style={{ transform: 'translateY(12px)' }}
          />
        )}
      </div>

      <div className="p-6 sm:p-8">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                <Translate id="downloads.badge.stable">稳定版</Translate>
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="w-full sm:w-52 inline-flex flex-col items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
              style={latestButtonStyle(accent)}
              onClick={() => {
                const first = options[0];
                if (!first?.url) return;
                onDirectLatest({
                  projectLabel: translate({ id: titleId, message: titleMessage }),
                  version: latestVersion || '-',
                  item: first,
                  parentUrl: href,
                });
              }}
              disabled={isLoadingLatest || options.length === 0}
            >
              {isLoadingLatest ? (
                <span className="inline-flex items-center">
                  <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 3a9 9 0 019 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <Translate id="downloads.button.loading">加载中</Translate>
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <svg className="mr-2 -ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <Translate id="downloads.button.latest">最新版本</Translate>
                </span>
              )}
              <span className="text-xs font-medium mt-1 opacity-80">
                <Translate id="downloads.button.version">版本</Translate> {latestVersion || '-'}
              </span>
            </button>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-40 inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
              style={{ color: COLOR_VARS.contrast, borderColor: 'rgba(0,0,0,0.16)' }}
            >
              <Translate id="downloads.button.otherVersions">其它版本</Translate>
            </a>
          </div>
        </div>
      </div>
      {showIdeLink && (
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
          <span className="font-medium">
            <Translate id="downloads.otherMethods">其他入口：</Translate>
          </span>
          <a href={IDE_MIRROR_URL} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
            <Translate id="downloads.pm.other.ideMirror">RuyiSDK IDE</Translate>
          </a>
        </div>
      )}
    </section>
  );
}

export default function DownloadCards({
  sectionIds,
}) {
  const { data: releaseData } = useDataWithApiFallback(latestPmBuilt, PM_RELEASE_LATEST_API);
  const { data: vscodeLatestData } = useDataWithApiFallback(
    latestVscodeBuilt,
    VSCODE_RELEASE_LATEST_API,
  );
  const { data: eclipseLatestData } = useDataWithApiFallback(
    latestEclipseBuilt,
    ECLIPSE_RELEASE_LATEST_API,
  );
  const [modalState, setModalState] = useState({
    open: false,
    projectLabel: '',
    version: '-',
    options: [],
    parentUrl: '',
  });

  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getLocalePrefixFromPathname(window.location.pathname);
  }, []);
  const vscodeLatest = useMemo(() => normalizeLatestRelease(vscodeLatestData), [vscodeLatestData]);
  const eclipseLatest = useMemo(() => normalizeLatestRelease(eclipseLatestData), [eclipseLatestData]);

  const handleOpenLatest = (payload) => {
    setModalState({
      open: true,
      projectLabel: payload.projectLabel,
      version: payload.version,
      options: payload.options,
      parentUrl: payload.parentUrl,
    });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, projectLabel: '', version: '-', options: [], parentUrl: '' });
  };

  const goToThanksPage = ({ item, version, parentUrl, arch }) => {
    if (!item?.url) return;

    const started = startDownloadWithUserGesture(item.url);
    const source = item.source || detectSource(item.url);
    const downloadPath = withLocalePrefix('/downloads/thanks', localePrefix);
    const query = new URLSearchParams({
      source,
      arch: arch || item.arch || '',
      version: version || '',
      file: item.fileName || extractFileName(item.url),
      parent: parentUrl || '',
      download: item.url,
      started: started ? '1' : '0',
    }).toString();

    window.location.href = `${downloadPath}?${query}`;
  };

  const handleSelectArch = (item) => {
    goToThanksPage({
      item,
      version: modalState.version,
      parentUrl: modalState.parentUrl,
      arch: item.arch,
    });
  };

  const handleDirectLatest = ({ version, item, parentUrl }) => {
    goToThanksPage({
      item,
      version,
      parentUrl,
      arch: item.arch || 'universal',
    });
  };

  return (
    <>
      <div className="w-full grid gap-8">
        <PackageManagerSection
          sectionId={sectionIds.packageManager}
          releaseData={releaseData}
          onOpenLatest={handleOpenLatest}
        />
        <ExtensionSection
          sectionId={sectionIds.vscodeExtension}
          titleId="downloads.vscode.title"
          titleMessage="RuyiSDK VS Code Extension"
          descriptionId="downloads.vscode.description"
          descriptionMessage="VS Code 扩展下载与发布入口。"
          href={IDE_VSCODE_RELEASES_URL}
          accent="blue"
          logoSrc="/img/vs-code.webp"
          logoAlt="VS Code"
          showIdeLink={false}
          latestVersion={vscodeLatest.version}
          latestDownloadUrl={vscodeLatest.downloadUrl}
          latestFileName={vscodeLatest.fileName}
          onDirectLatest={handleDirectLatest}
          isLoadingLatest={false}
        />
        <ExtensionSection
          sectionId={sectionIds.eclipseExtension}
          titleId="downloads.eclipse.title"
          titleMessage="RuyiSDK Eclipse Extension"
          descriptionId="downloads.eclipse.description"
          descriptionMessage="Eclipse 扩展下载与发布入口。"
          href={IDE_ECLIPSE_RELEASES_URL}
          accent="eclipse"
          logoSrc="/img/Eclipse2014-logo_RGB.svg"
          logoAlt="Eclipse"
          showIdeLink={true}
          latestVersion={eclipseLatest.version}
          latestDownloadUrl={eclipseLatest.downloadUrl}
          latestFileName={eclipseLatest.fileName}
          onDirectLatest={handleDirectLatest}
          isLoadingLatest={false}
        />
      </div>

      <ArchSelectModal modalState={modalState} onClose={handleCloseModal} onSelect={handleSelectArch} />
    </>
  );
}
