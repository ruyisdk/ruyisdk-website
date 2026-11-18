import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import latestPmBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_pm.json';
import latestVscodeBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_vscode.json';
import latestEclipseBuilt from '@site/static/data/api/api_ruyisdk_cn/releases_latest_eclipse.json';
import DownloadInstallScript from './DownloadInstallScript';

export const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  eclipse: '#3730a3',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

const ARCH_ORDER = ['x86_64', 'aarch64', 'riscv64', 'universal'];
const KNOWN_LOCALES = new Set(['zh-Hans', 'en', 'de']);

const PM_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-pm';
const VSCODE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/vscode';
const ECLIPSE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/eclipse';

const PM_MIRROR_STABLE_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/stable/';
const PM_MIRROR_TESTING_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/testing/';
const PM_GITHUB_RELEASES_URL = 'https://github.com/ruyisdk/ruyi/releases';
const PM_PYPI_URL = 'https://pypi.org/project/ruyi/';
const PM_DEBIAN_TESTING_URL = 'https://packages.debian.org/testing/main/ruyi';
const PM_GENTOO_OVERLAY_URL = 'https://github.com/ruyisdk/ruyisdk-overlay';
const PM_AUR_URL = 'https://aur.archlinux.org/packages/ruyi';

const VSCODE_OPEN_VSX_URL = 'https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension';
const VSCODE_MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension';
const VSCODE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/';
const IDE_VSCODE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-vscode-extension/releases';
const ECLIPSE_MARKETPLACE_URL = 'https://marketplace.eclipse.org/content/ruyisdk';
const ECLIPSE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/';
const IDE_ECLIPSE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases';

function headerGradientClass(accent) {
  if (accent === 'gold') {
    return 'bg-gradient-to-r from-[#fffbeb] via-[#fffef7] to-white dark:from-amber-500/12 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  if (accent === 'eclipse') {
    return 'bg-gradient-to-r from-[#f3f4ff] via-[#f9faff] to-white dark:from-indigo-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  return 'bg-gradient-to-r from-[#eff5ff] via-[#f8fbff] to-white dark:from-blue-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
}

function headerIconClass(accent) {
  if (accent === 'gold') {
    return 'text-[#c88a04] dark:text-amber-400';
  }
  if (accent === 'eclipse') {
    return 'text-[#3730a3] dark:text-indigo-300';
  }
  return 'text-[#1648B8] dark:text-[#79a8ff]';
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

function pickUrlBySource(urls, source) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  if (source === 'mirror') return urls.find((url) => url.includes('mirror.iscas.ac.cn')) || '';
  if (source === 'github') return urls.find((url) => url.includes('github.com')) || '';
  return pickPreferredUrl(urls);
}

function getChannelOptions(channel, source) {
  if (!channel?.download_urls) return [];
  return Object.entries(channel.download_urls)
    .map(([platformArch, urls]) => {
      const rawArch = platformArch.split('/').pop() || 'universal';
      const arch = rawArch === 'any' ? 'universal' : rawArch;
      const url = pickUrlBySource(urls, source);
      return {
        arch,
        url,
        fileName: extractFileName(url),
        source: detectSource(url),
      };
    })
    .filter((item) => item.url)
    .sort((a, b) => ARCH_ORDER.indexOf(a.arch) - ARCH_ORDER.indexOf(b.arch));
}

function getSingleChannelItem(channel, source) {
  if (!channel?.download_urls) return null;
  const urls = Object.values(channel.download_urls).find((item) => Array.isArray(item) && item.length > 0);
  const url = pickUrlBySource(urls, source);
  if (!url) return null;
  return {
    arch: 'universal',
    url,
    fileName: extractFileName(url),
    source: detectSource(url),
  };
}

function archLabel(arch) {
  if (arch === 'x86_64') return translate({ id: 'downloads.arch.x86_64', message: 'x86_64' });
  if (arch === 'aarch64') return translate({ id: 'downloads.arch.aarch64', message: 'aarch64' });
  if (arch === 'riscv64') return translate({ id: 'downloads.arch.riscv64', message: 'riscv64' });
  return translate({ id: 'downloads.arch.universal', message: '通用（无架构区分）' });
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

  if (!modalState.open || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`fixed inset-0 z-[var(--ifm-z-index-overlay)] transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0'}`}>
      <button aria-label="close" type="button" className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl bg-white dark:bg-[#151b23] border border-slate-200/90 dark:border-white/12 shadow-[0_24px_48px_rgba(10,44,126,0.16)] transition-all duration-200 ${entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        >
          <div className="shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200/80 dark:border-white/10">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              <Translate id="downloads.modal.title">选择架构并下载</Translate>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {modalState.projectLabel} · <Translate id="downloads.modal.latestVersion">最新版本</Translate> {modalState.version || '-'}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-4 grid gap-3">
            {modalState.options.map((item) => (
              <button
                key={`${item.arch}-${item.url}`}
                type="button"
                className="w-full rounded-xl border border-slate-200/85 dark:border-white/10 bg-[#f8fafd] dark:bg-[#1c2330] hover:bg-[#eef4ff]/65 dark:hover:bg-[#253042] hover:border-[#1648B8]/30 hover:shadow-sm transition-all px-4 py-3 text-left cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100">{archLabel(item.arch)}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400" style={{ wordBreak: 'break-all' }}>{item.fileName || item.url}</div>
              </button>
            ))}
          </div>

          <div className="shrink-0 px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200/80 dark:border-white/10 flex justify-end">
            <button
              type="button"
              className="secondary-button text-sm font-semibold whitespace-nowrap"
              onClick={onClose}
            >
              <Translate id="downloads.modal.cancel">取消</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function VersionBadge({ labelId, labelMessage }) {
  const isTesting = labelId === 'downloads.badge.testing';
  const badgeTone = isTesting
    ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30'
    : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeTone}`}>
      <Translate id={labelId}>{labelMessage}</Translate>
    </span>
  );
}

function DownloadButton({
  children,
  href,
  onClick,
  variant = 'primary',
  disabled = false,
}) {
  const className = variant === 'primary'
    ? 'primary-button text-sm font-semibold whitespace-nowrap'
    : 'secondary-button text-sm font-semibold whitespace-nowrap';
  const disabledStyle = disabled
    ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' }
    : undefined;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={disabledStyle}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} style={disabledStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function DownloadSourceRow({
  labelId,
  labelMessage,
  latestDisabled,
  onLatest,
  allVersionsUrl,
  accent,
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <Translate id={labelId}>{labelMessage}</Translate>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <DownloadButton accent={accent} onClick={onLatest} disabled={latestDisabled}>
          <Translate id="downloads.button.latest">最新版本</Translate>
        </DownloadButton>
        <DownloadButton variant="secondary" href={allVersionsUrl}>
          <Translate id="downloads.button.allVersions">所有版本</Translate>
        </DownloadButton>
      </div>
    </div>
  );
}

function ReleaseCard({
  badgeId,
  badgeMessage,
  channel,
  accent,
  mirrorAllUrl,
  githubAllUrl,
  onMirrorLatest,
  onGithubLatest,
  mirrorLatestDisabled = false,
  githubLatestDisabled = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/85 dark:border-white/10 bg-[#f8fafd] dark:bg-[#1c2330]/75 p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <VersionBadge labelId={badgeId} labelMessage={badgeMessage} />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{channel?.version || '-'}</span>
      </div>

      <div className="grid gap-5">
        <DownloadSourceRow
          labelId="downloads.source.mirror"
          labelMessage="软件所镜像站下载："
          latestDisabled={mirrorLatestDisabled}
          onLatest={onMirrorLatest}
          allVersionsUrl={mirrorAllUrl}
          accent={accent}
        />
        <DownloadSourceRow
          labelId="downloads.source.github"
          labelMessage="GitHub Release 下载："
          latestDisabled={githubLatestDisabled}
          onLatest={onGithubLatest}
          allVersionsUrl={githubAllUrl}
          accent={accent}
        />
      </div>
    </div>
  );
}

function ProductHeader({
  titleId,
  titleMessage,
  descriptionId,
  descriptionMessage,
  accent,
  logoSrc,
  logoAlt,
  iconPath,
}) {
  return (
    <div className={`relative overflow-hidden px-5 py-5 sm:px-8 sm:py-6 border-b border-slate-200/75 dark:border-white/10 ${headerGradientClass(accent)}`}>
      <div className="min-w-0 md:pr-44">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-slate-900 dark:text-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 shrink-0 ${headerIconClass(accent)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
          <Translate id={titleId}>{titleMessage}</Translate>
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          <Translate id={descriptionId}>{descriptionMessage}</Translate>
        </p>
      </div>
      {logoSrc && (
        <img
          src={logoSrc}
          alt={logoAlt}
          className={`hidden md:block pointer-events-none select-none absolute right-6 top-2 h-36 w-auto object-contain ${
            accent === 'eclipse'
              ? 'dark:drop-shadow-[0_0_18px_rgba(165,180,252,0.38)]'
              : 'dark:drop-shadow-[0_0_14px_rgba(121,168,255,0.14)]'
          }`}
          style={{ transform: 'translateY(12px)' }}
        />
      )}
    </div>
  );
}

function ExternalLinks({ links }) {
  return (
    <div className="bg-[#f8fafd] dark:bg-[#11161d]/80 px-5 py-4 sm:px-8 border-t border-slate-200/80 dark:border-white/10 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
      {links.map((link, index) => (
        <React.Fragment key={link.href}>
          {index > 0 && <span className="text-slate-300 dark:text-slate-700">|</span>}
          <a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className="font-medium text-[#1648B8] hover:text-[#0A2C7E] dark:text-[#79a8ff] dark:hover:text-[#a5c5ff] hover:underline transition-colors">
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}

function PackageManagerSection({ sectionId, releaseData, onOpenLatest }) {
  const stable = releaseData?.channels?.stable;
  const testing = releaseData?.channels?.testing;
  const stableMirrorOptions = useMemo(() => getChannelOptions(stable, 'mirror'), [stable]);
  const stableGithubOptions = useMemo(() => getChannelOptions(stable, 'github'), [stable]);
  const testingMirrorOptions = useMemo(() => getChannelOptions(testing, 'mirror'), [testing]);
  const testingGithubOptions = useMemo(() => getChannelOptions(testing, 'github'), [testing]);

  return (
    <section id={sectionId} className="bg-white dark:bg-[#151b23] rounded-3xl shadow-[0_12px_32px_rgba(10,44,126,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-white/10 overflow-hidden scroll-mt-24">
      <ProductHeader
        titleId="downloads.pm.title"
        titleMessage="Ruyi 包管理器"
        descriptionId="downloads.pm.description"
        descriptionMessage="Ruyi 包管理器是 RuyiSDK 的核心组件"
        accent="gold"
        logoSrc="/img/downloads/ruyi-logo-720.svg"
        logoAlt="RuyiSDK"
        iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />

      <div className="p-6 sm:p-8 pt-4 sm:pt-5">
        <div className="mb-6">
          <DownloadInstallScript variant="plain" />
        </div>

        <div className="border-t border-slate-200/80 dark:border-white/10 pt-6 mt-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            <Translate id="downloads.manualDownload.title">手动下载安装</Translate>
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <ReleaseCard
              badgeId="downloads.badge.stable"
              badgeMessage="稳定版"
              channel={stable}
              accent="gold"
              mirrorAllUrl={PM_MIRROR_STABLE_URL}
              githubAllUrl={PM_GITHUB_RELEASES_URL}
              mirrorLatestDisabled={stableMirrorOptions.length === 0}
              githubLatestDisabled={stableGithubOptions.length === 0}
              onMirrorLatest={() =>
                onOpenLatest({
                  projectLabel: translate({ id: 'downloads.pm.title', message: 'Ruyi 包管理器' }),
                  version: stable?.version || '-',
                  options: stableMirrorOptions,
                  parentUrl: PM_MIRROR_STABLE_URL,
                  product: 'pm',
                })
              }
              onGithubLatest={() =>
                onOpenLatest({
                  projectLabel: translate({ id: 'downloads.pm.title', message: 'Ruyi 包管理器' }),
                  version: stable?.version || '-',
                  options: stableGithubOptions,
                  parentUrl: PM_GITHUB_RELEASES_URL,
                  product: 'pm',
                })
              }
            />
            <ReleaseCard
              badgeId="downloads.badge.testing"
              badgeMessage="测试版"
              channel={testing}
              accent="gold"
              mirrorAllUrl={PM_MIRROR_TESTING_URL}
              githubAllUrl={PM_GITHUB_RELEASES_URL}
              mirrorLatestDisabled={testingMirrorOptions.length === 0}
              githubLatestDisabled={testingGithubOptions.length === 0}
              onMirrorLatest={() =>
                onOpenLatest({
                  projectLabel: translate({ id: 'downloads.pm.title', message: 'Ruyi 包管理器' }),
                  version: testing?.version || '-',
                  options: testingMirrorOptions,
                  parentUrl: PM_MIRROR_TESTING_URL,
                  product: 'pm',
                })
              }
              onGithubLatest={() =>
                onOpenLatest({
                  projectLabel: translate({ id: 'downloads.pm.title', message: 'Ruyi 包管理器' }),
                  version: testing?.version || '-',
                  options: testingGithubOptions,
                  parentUrl: PM_GITHUB_RELEASES_URL,
                  product: 'pm',
                })
              }
            />
          </div>
        </div>
      </div>

      <ExternalLinks
        links={[
          { href: '/docs/Package-Manager/installation', label: <Translate id="downloads.viewDocs">安装文档</Translate> },
          { href: PM_PYPI_URL, external: true, label: <Translate id="downloads.label.pypi">PyPI</Translate> },
          { href: PM_DEBIAN_TESTING_URL, external: true, label: <Translate id="downloads.label.debianTesting">Debian testing</Translate> },
          { href: PM_GENTOO_OVERLAY_URL, external: true, label: <Translate id="downloads.label.ruyisdkOverlay">ruyisdk-overlay</Translate> },
          { href: PM_AUR_URL, external: true, label: <Translate id="downloads.label.aur">AUR</Translate> },
        ]}
      />
    </section>
  );
}

function ImagerSection({ sectionId }) {
  useBrokenLinks().collectAnchor(sectionId);
  const docsUrl = useBaseUrl('/docs/Imager/');

  return (
    <section id={sectionId} className="bg-white dark:bg-[#151b23] rounded-3xl shadow-[0_12px_32px_rgba(10,44,126,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-white/10 overflow-hidden scroll-mt-24">
      <ProductHeader
        titleId="imager.name"
        titleMessage="Ruyi 镜像刷写工具"
        descriptionId="imager.downloads.description"
        descriptionMessage="RISC-V 图形化镜像刷写工具"
        accent="gold"
        iconPath="M5 3h14v18H5V3zm3 4h8M8 11h8m-4 3v4m-2-2 2 2 2-2"
      />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Translate id="downloads.source.github">GitHub Release 下载：</Translate>
          </div>
          <div className="flex flex-wrap justify-start gap-3">
            <DownloadButton accent="gold" href="https://github.com/ruyisdk/ruyi-imager/releases/latest">
              <Translate id="downloads.button.latest">最新版本</Translate>
            </DownloadButton>
            <DownloadButton variant="secondary" href="https://github.com/ruyisdk/ruyi-imager/releases">
              <Translate id="downloads.button.allVersions">所有版本</Translate>
            </DownloadButton>
          </div>
        </div>
      </div>
      <ExternalLinks links={[
        { href: docsUrl, label: <Translate id="downloads.viewDocs">安装文档</Translate> },
        { href: 'https://github.com/ruyisdk/ruyi-imager', external: true, label: <Translate id="imager.source">项目源码</Translate> },
      ]} />
    </section>
  );
}

function MarketplaceCard({ titleId, titleMessage, children }) {
  return (
    <div className="rounded-2xl border border-slate-200/85 dark:border-white/10 bg-[#f8fafd] dark:bg-[#1c2330]/75 p-6">
      <h3 className="m-0 mb-5 text-lg font-bold text-slate-900 dark:text-slate-100">
        <Translate id={titleId}>{titleMessage}</Translate>
      </h3>
      <div className="flex flex-wrap justify-end gap-3">
        {children}
      </div>
    </div>
  );
}

function ExtensionSection({
  sectionId,
  titleId,
  titleMessage,
  descriptionId,
  descriptionMessage,
  accent = 'blue',
  logoSrc,
  logoAlt,
  releaseData,
  mirrorAllUrl,
  githubAllUrl,
  marketplace,
  docsUrl,
  product,
  onDirectLatest,
}) {
  const stable = releaseData?.channels?.stable;
  const mirrorItem = useMemo(() => getSingleChannelItem(stable, 'mirror'), [stable]);
  const githubItem = useMemo(() => getSingleChannelItem(stable, 'github'), [stable]);

  return (
    <section id={sectionId} className="bg-white dark:bg-[#151b23] rounded-3xl shadow-[0_12px_32px_rgba(10,44,126,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-slate-200/90 dark:border-white/10 overflow-hidden scroll-mt-24">
      <ProductHeader
        titleId={titleId}
        titleMessage={titleMessage}
        descriptionId={descriptionId}
        descriptionMessage={descriptionMessage}
        accent={accent}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        iconPath="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />

      <div className="p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <ReleaseCard
            badgeId="downloads.badge.stable"
            badgeMessage="稳定版"
            channel={stable}
            accent={accent}
            mirrorAllUrl={mirrorAllUrl}
            githubAllUrl={githubAllUrl}
            mirrorLatestDisabled={!mirrorItem?.url}
            githubLatestDisabled={!githubItem?.url}
            onMirrorLatest={() => {
              if (!mirrorItem?.url) return;
              onDirectLatest({
                version: stable?.version || '-',
                item: mirrorItem,
                parentUrl: mirrorAllUrl,
                product,
              });
            }}
            onGithubLatest={() => {
              if (!githubItem?.url) return;
              onDirectLatest({
                version: stable?.version || '-',
                item: githubItem,
                parentUrl: githubAllUrl,
                product,
              });
            }}
          />

          <MarketplaceCard titleId={marketplace.titleId} titleMessage={marketplace.titleMessage}>
            {marketplace.links.map((link) => (
              <DownloadButton key={link.href} variant="secondary" href={link.href}>
                {link.label}
              </DownloadButton>
            ))}
          </MarketplaceCard>
        </div>
      </div>
      <ExternalLinks
        links={[
          { href: docsUrl, label: <Translate id="downloads.viewDocs">安装文档</Translate> },
        ]}
      />
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
    product: '',
  });

  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getLocalePrefixFromPathname(window.location.pathname);
  }, []);

  const handleOpenLatest = (payload) => {
    setModalState({
      open: true,
      projectLabel: payload.projectLabel,
      version: payload.version,
      options: payload.options,
      parentUrl: payload.parentUrl,
      product: payload.product,
    });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, projectLabel: '', version: '-', options: [], parentUrl: '', product: '' });
  };

  const goToThanksPage = ({ item, version, parentUrl, arch, product }) => {
    if (!item?.url) return;

    const source = item.source || detectSource(item.url);
    const downloadPath = withLocalePrefix('/downloads/thanks', localePrefix);
    const query = new URLSearchParams({
      source,
      arch: arch || item.arch || '',
      version: version || '',
      file: item.fileName || extractFileName(item.url),
      parent: parentUrl || '',
      download: item.url,
      product: product || '',
    }).toString();

    window.location.href = `${downloadPath}?${query}`;
  };

  const handleSelectArch = (item) => {
    goToThanksPage({
      item,
      version: modalState.version,
      parentUrl: modalState.parentUrl,
      arch: item.arch,
      product: modalState.product,
    });
  };

  const handleDirectLatest = ({ version, item, parentUrl, product }) => {
    goToThanksPage({
      item,
      version,
      parentUrl,
      arch: item.arch || 'universal',
      product,
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
        <ImagerSection sectionId={sectionIds.imager} />
        <ExtensionSection
          sectionId={sectionIds.vscodeExtension}
          titleId="downloads.vscode.title"
          titleMessage="RuyiSDK VS Code 扩展"
          descriptionId="downloads.vscode.description"
          descriptionMessage="在 Visual Studio Code 上使用 RuyiSDK"
          accent="blue"
          logoSrc="/img/downloads/vs-code.webp"
          logoAlt="VS Code"
          releaseData={vscodeLatestData}
          mirrorAllUrl={VSCODE_MIRROR_RELEASES_URL}
          githubAllUrl={IDE_VSCODE_RELEASES_URL}
          docsUrl="/docs/VSCode-Plugins/"
          product="vscode"
          marketplace={{
            titleId: 'downloads.vscode.marketplace.title',
            titleMessage: '从扩展市场下载',
            links: [
              {
                href: VSCODE_OPEN_VSX_URL,
                label: <Translate id="downloads.vscode.openVsx">从 Open VSX 下载</Translate>,
              },
              {
                href: VSCODE_MARKETPLACE_URL,
                label: <Translate id="downloads.vscode.marketplace">从 Marketplace 下载</Translate>,
              },
            ],
          }}
          onDirectLatest={handleDirectLatest}
        />
        <ExtensionSection
          sectionId={sectionIds.eclipseExtension}
          titleId="downloads.eclipse.title"
          titleMessage="RuyiSDK Eclipse 插件"
          descriptionId="downloads.eclipse.description"
          descriptionMessage="在 Eclipse Embedded CDT 上使用 RuyiSDK"
          accent="eclipse"
          logoSrc="/img/downloads/Eclipse2014-logo_RGB.svg"
          logoAlt="Eclipse"
          releaseData={eclipseLatestData}
          mirrorAllUrl={ECLIPSE_MIRROR_RELEASES_URL}
          githubAllUrl={IDE_ECLIPSE_RELEASES_URL}
          docsUrl="/docs/IDE/"
          product="eclipse"
          marketplace={{
            titleId: 'downloads.eclipse.marketplace.title',
            titleMessage: '从扩展市场下载',
            links: [
              {
                href: ECLIPSE_MARKETPLACE_URL,
                label: <Translate id="downloads.eclipse.marketplace">从 Marketplace 下载</Translate>,
              },
            ],
          }}
          onDirectLatest={handleDirectLatest}
        />
      </div>

      <ArchSelectModal modalState={modalState} onClose={handleCloseModal} onSelect={handleSelectArch} />
    </>
  );
}
