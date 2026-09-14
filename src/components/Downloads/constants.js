import { translate } from '@docusaurus/Translate';
import { detectSource, extractFileName } from './utils';

export const ARCH_ORDER = ['x86_64', 'aarch64', 'riscv64', 'universal'];

export const PM_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-pm';
export const VSCODE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/vscode';
export const ECLIPSE_RELEASE_LATEST_API = 'https://api.ruyisdk.cn/releases/latest-ide/eclipse';

export const PM_MIRROR_STABLE_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/stable/';
export const PM_MIRROR_TESTING_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ruyi/testing/';
export const PM_GITHUB_RELEASES_URL = 'https://github.com/ruyisdk/ruyi/releases';
export const PM_PYPI_URL = 'https://pypi.org/project/ruyi/';
export const PM_DEBIAN_TESTING_URL = 'https://packages.debian.org/testing/main/ruyi';
export const PM_GENTOO_OVERLAY_URL = 'https://github.com/ruyisdk/ruyisdk-overlay';
export const PM_AUR_URL = 'https://aur.archlinux.org/packages/ruyi';

export const VSCODE_OPEN_VSX_URL = 'https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension';
export const VSCODE_MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension';
export const VSCODE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/';
export const IDE_VSCODE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-vscode-extension/releases';
export const ECLIPSE_MARKETPLACE_URL = 'https://marketplace.eclipse.org/content/ruyisdk';
export const ECLIPSE_MIRROR_RELEASES_URL = 'https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/';
export const IDE_ECLIPSE_RELEASES_URL = 'https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases';

export function pickPreferredUrl(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  const mirror = urls.find((url) => url.includes('mirror.iscas.ac.cn'));
  return mirror || urls[0] || '';
}

export function pickUrlBySource(urls, source) {
  if (!Array.isArray(urls) || urls.length === 0) return '';
  if (source === 'mirror') return urls.find((url) => url.includes('mirror.iscas.ac.cn')) || '';
  if (source === 'github') return urls.find((url) => url.includes('github.com')) || '';
  return pickPreferredUrl(urls);
}

export function getChannelOptions(channel, source) {
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

export function getSingleChannelItem(channel, source) {
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

export function archLabel(arch) {
  if (arch === 'x86_64') return translate({ id: 'downloads.arch.x86_64', message: 'x86_64' });
  if (arch === 'aarch64') return translate({ id: 'downloads.arch.aarch64', message: 'aarch64' });
  if (arch === 'riscv64') return translate({ id: 'downloads.arch.riscv64', message: 'riscv64' });
  return translate({ id: 'downloads.arch.universal', message: '通用（无架构区分）' });
}
