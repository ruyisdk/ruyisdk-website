import React, { useEffect, useMemo, useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import {
  COLOR_VARS,
  buttonStyle,
  headerGradientStyle,
} from './utils';
import {
  PM_MIRROR_STABLE_URL,
  PM_MIRROR_TESTING_URL,
  PM_GITHUB_RELEASES_URL,
  PM_PYPI_URL,
  PM_DEBIAN_TESTING_URL,
  PM_GENTOO_OVERLAY_URL,
  PM_AUR_URL,
  archLabel,
  getChannelOptions,
  getSingleChannelItem,
} from './constants';
import DownloadInstallScript from './DownloadInstallScript';

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
            {modalState.options.map((item) => (
              <button
                key={`${item.arch}-${item.url}`}
                type="button"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all px-4 py-3 text-left"
                onClick={() => onSelect(item)}
              >
                <div className="font-semibold text-gray-900">{archLabel(item.arch)}</div>
                <div className="mt-1 text-xs text-gray-500" style={{ wordBreak: 'break-all' }}>{item.fileName || item.url}</div>
              </button>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              className="secondary-button text-sm font-semibold whitespace-nowrap"
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

export function VersionBadge({ labelId, labelMessage }) {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
      <Translate id={labelId}>{labelMessage}</Translate>
    </span>
  );
}

export function DownloadButton({
  children,
  href,
  onClick,
  variant = 'primary',
  accent = 'blue',
  disabled = false,
}) {
  const className = variant === 'primary'
    ? 'primary-button text-sm font-semibold whitespace-nowrap'
    : 'secondary-button text-sm font-semibold whitespace-nowrap';
  const style = buttonStyle(variant, accent);
  const disabledStyle = disabled ? { opacity: 0.55, cursor: 'not-allowed', transform: 'none' } : {};

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={{ ...style, ...disabledStyle }}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} style={{ ...style, ...disabledStyle }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function DownloadSourceRow({
  labelId,
  labelMessage,
  latestDisabled,
  onLatest,
  allVersionsUrl,
  accent,
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-600">
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

export function ReleaseCard({
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
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <VersionBadge labelId={badgeId} labelMessage={badgeMessage} />
        <span className="text-sm font-semibold text-gray-700">{channel?.version || '-'}</span>
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

export function ProductHeader({
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
    <div className="relative overflow-hidden px-8 py-6" style={headerGradientStyle(accent)}>
      <div className="min-w-0 md:pr-44">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0 text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accent === 'eclipse' ? COLOR_VARS.eclipse : accent === 'gold' ? COLOR_VARS.goldDark : COLOR_VARS.blueDark }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
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
          className="hidden md:block pointer-events-none select-none absolute right-6 top-2 h-36 w-auto object-contain"
          style={{ transform: 'translateY(12px)' }}
        />
      )}
    </div>
  );
}

export function ExternalLinks({ links }) {
  return (
    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
      {links.map((link, index) => (
        <React.Fragment key={link.href}>
          {index > 0 && <span className="text-gray-300">|</span>}
          <a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined} className="hover:underline font-medium transition-colors" style={{ color: COLOR_VARS.contrast }}>
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
}

export function MarketplaceCard({ titleId, titleMessage, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <h3 className="m-0 mb-5 text-lg font-bold text-gray-900">
        <Translate id={titleId}>{titleMessage}</Translate>
      </h3>
      <div className="flex flex-wrap justify-end gap-3">
        {children}
      </div>
    </div>
  );
}

export function PackageManagerSection({ sectionId, releaseData, onOpenLatest }) {
  const stable = releaseData?.channels?.stable;
  const testing = releaseData?.channels?.testing;
  const stableMirrorOptions = useMemo(() => getChannelOptions(stable, 'mirror'), [stable]);
  const stableGithubOptions = useMemo(() => getChannelOptions(stable, 'github'), [stable]);
  const testingMirrorOptions = useMemo(() => getChannelOptions(testing, 'mirror'), [testing]);
  const testingGithubOptions = useMemo(() => getChannelOptions(testing, 'github'), [testing]);

  return (
    <section id={sectionId} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden scroll-mt-24">
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

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
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

export function ExtensionSection({
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
    <section id={sectionId} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden scroll-mt-24">
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
