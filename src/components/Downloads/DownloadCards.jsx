import React, { useMemo, useState } from 'react';
import Translate from '@docusaurus/Translate';
import ArchSelectModal from './ArchSelectModal';
import { ExtensionSection, ImagerSection, PackageManagerSection } from './ProductSections';
import { detectSource, extractFileName, getLocalePrefixFromPathname, withLocalePrefix } from './downloadUtils';
import useLatestReleases from './useLatestReleases';

export { ArchSelectModal, detectSource, extractFileName };

export const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  eclipse: '#3730a3',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

const VSCODE_OPEN_VSX_URL = 'https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension';
const VSCODE_MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension';
const VSCODE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/';
const IDE_VSCODE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-vscode-extension/releases';
const ECLIPSE_MARKETPLACE_URL = 'https://marketplace.eclipse.org/content/ruyisdk';
const ECLIPSE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/';
const IDE_ECLIPSE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases';

export default function DownloadCards({
  sectionIds,
}) {
  const { releaseData, vscodeLatestData, eclipseLatestData } = useLatestReleases();
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
