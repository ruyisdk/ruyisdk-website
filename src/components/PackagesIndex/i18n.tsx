import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Locale = 'en-US' | 'zh-CN';
type Dict = Record<string, string>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const dictionaries: Record<Locale, Dict> = {
  'en-US': {
    appTitle: 'Packages Index',
    appSubtitle: '',
    searchPlaceholderDevices: 'Search devices, variants, arch, or CPU…',
    searchPlaceholderPackages: 'Search packages, categories, or descriptions…',
    listByDevice: 'List by Device',
    listByPackages: 'List by Packages',
    devices: 'Devices',
    packages: 'Packages',
    architectures: 'Architectures',
    cpus: 'CPUs',
    categories: 'Categories',
    clearFilters: 'Clear filters',
    results: 'Results',
    loading: 'Loading…',
    noDevices: 'No devices found',
    noPackages: 'No packages found',
    noMatches: 'No matches found',
    adjustFilters: 'Try adjusting your search or filters.',
    variants: 'Variants',
    deviceType: 'Device',
    packageType: 'Package',
    noDescription: 'No description available',
    language: 'Language',
    english: 'English',
    chinese: '中文',
    activeFilters: 'Active filters',
    filterHelp: 'Use filters to narrow the current list.',
    deviceListDescription: '',
    packageListDescription: '',
    backToHome: 'Back',
    back: 'Back',
    supportedPackages: 'Supported Packages',
    supportedDevices: 'Supported Devices',
    notFound: 'Not Found',
    version: 'Version',
    categoryLabel: 'Category',
    descriptionLabel: 'Description',
    details: 'Details',
    id: 'ID',
    manufacturer: 'Manufacturer',
    vendor: 'Vendor',
    eula: 'EULA',
    slug: 'Slug',
    upstreamVersion: 'Upstream Version',
    serviceLevel: 'Service Level',
    distfiles: 'Distfiles',
    size: 'Size',
    checksums: 'Checksums',
    urls: 'URLs',
    downloadMirrors: 'Download Mirrors',
    primaryMirror: 'Primary',
    copyLink: 'Copy link',
    openLink: 'Open link',
    sourceUrl: 'Source URL',
    noChecksum: 'No checksum available',
    downloadHint: '{count} download item(s). Mirrors are ordered by priority.',
    fetchRestriction: 'Fetch Restriction',
    toolchain: 'Toolchain',
    target: 'Target',
    components: 'Components',
    quirks: 'Quirks',
    binary: 'Binary',
    host: 'Host',
    commands: 'Commands',
    emulator: 'Emulator',
    programs: 'Programs',
    flavor: 'Flavor',
    path: 'Path',
    binfmtMisc: 'Binfmt Misc',
    supportedArches: 'Supported Arches',
    provisionable: 'Provisionable',
    strategy: 'Strategy',
    partitionMap: 'Partition Map',
    source: 'Source',
    blob: 'Blob',
  },
  'zh-CN': {
    appTitle: 'Packages Index',
    appSubtitle: '',
    searchPlaceholderDevices: '搜索设备、变体、架构或 CPU…',
    searchPlaceholderPackages: '搜索包、分类或描述…',
    listByDevice: '按设备浏览',
    listByPackages: '按包浏览',
    devices: '设备',
    packages: '软件包',
    architectures: '架构',
    cpus: 'CPU',
    categories: '分类',
    clearFilters: '清除筛选',
    results: '结果',
    loading: '加载中…',
    noDevices: '未找到设备',
    noPackages: '未找到软件包',
    noMatches: '没有匹配结果',
    adjustFilters: '请调整搜索词或筛选条件。',
    variants: '变体',
    deviceType: '设备',
    packageType: '软件包',
    noDescription: '暂无描述',
    language: '语言',
    english: 'English',
    chinese: '中文',
    activeFilters: '当前筛选',
    filterHelp: '使用筛选条件缩小当前列表。',
    deviceListDescription: '',
    packageListDescription: '',
    backToHome: '返回',
    back: '返回',
    supportedPackages: '支持的软件包',
    supportedDevices: '支持的设备',
    notFound: '未找到',
    version: '版本',
    categoryLabel: '分类',
    descriptionLabel: '描述',
    details: '详细信息',
    id: '标识符',
    manufacturer: '制造商',
    vendor: '供应商',
    eula: '最终用户许可协议',
    slug: '短名称 (Slug)',
    upstreamVersion: '上游版本',
    serviceLevel: '服务级别',
    distfiles: '分发文件',
    size: '大小',
    checksums: '校验和',
    urls: '下载链接',
    downloadMirrors: '下载镜像',
    primaryMirror: '首选',
    copyLink: '复制链接',
    openLink: '打开链接',
    sourceUrl: '原始链接',
    noChecksum: '暂无校验和',
    downloadHint: '{count} 个下载项，镜像按优先级排序。',
    fetchRestriction: '获取限制',
    toolchain: '工具链',
    target: '目标平台',
    components: '组件',
    quirks: '特殊配置 (Quirks)',
    binary: '二进制文件',
    host: '主机环境',
    commands: '命令',
    emulator: '模拟器',
    programs: '程序',
    flavor: '类型',
    path: '路径',
    binfmtMisc: 'Binfmt Misc',
    supportedArches: '支持的架构',
    provisionable: '可刷写设备',
    strategy: '策略',
    partitionMap: '分区映射',
    source: '源代码',
    blob: '二进制固件',
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n } = useDocusaurusContext();
  const docusaurusLocale = i18n?.currentLocale || 'zh-Hans';
  const locale: Locale = docusaurusLocale === 'zh-Hans' ? 'zh-CN' : 'en-US';

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string, params?: Record<string, string | number>) => {
      const raw = dictionaries[locale][key] ?? dictionaries['en-US'][key] ?? key;
      if (!params) return raw;
      return Object.entries(params).reduce((acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)), raw);
    };

    return {
      locale,
      setLocale: () => {},
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Locale };
