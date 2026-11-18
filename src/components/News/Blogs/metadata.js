export const BLOG_ARTICLES = [
  {
    slug: "2024-07-08-box64-wps-office-poc",
    date: "2024-07-08",
    title: {
      "zh-Hans": "尝鲜：使用 Box64 在 RISC-V 系统上运行 WPS Office",
      en: "Early Access: Using Box64 to Run WPS Office on RISC-V Systems",
      de: "WPS Office auf RISC-V mit Box64 ausprobieren",
    },
    description: {
      "zh-Hans": "使用 RuyiSDK 与 Box64 在 RISC-V Linux 桌面发行版上体验运行 WPS Office。",
      en: "Use RuyiSDK and Box64 to try running WPS Office on RISC-V Linux desktop systems.",
      de: "WPS Office mit RuyiSDK und Box64 auf einem RISC-V-Linux-Desktop ausprobieren.",
    },
  },
  {
    slug: "2024-07-30-k230d",
    date: "2024-07-30",
    title: {
      "zh-Hans": "嘉楠勘智K230D: 首款基于新32位 RuyiSDK 的AIoT量产芯片",
      en: "K230D: The First Mass-Produced AIoT Chip Based on the New 32-bit RuyiSDK",
      de: "Canaan Kendryte K230D: Erster AIoT-Serienchip mit dem neuen 32-Bit-RuyiSDK",
    },
    description: {
      "zh-Hans": "介绍基于新32位 RuyiSDK 的 K230D AIoT 量产芯片及其内存、性能收益。",
      en: "An overview of the K230D AIoT chip, its new 32-bit RuyiSDK, and the gains in memory efficiency and performance.",
      de: "Der AIoT-Chip K230D mit dem neuen 32-Bit-RuyiSDK benötigt weniger Speicher und bietet mehr Leistung.",
    },
  },
  {
    slug: "2024-09-30-eclipse-riscv64",
    date: "2024-09-30",
    title: {
      "zh-Hans": "Eclipse 上游初步支持 RISC-V，每日构建镜像已经可以下载试用",
      en: "Initial RISC-V Support Landed Upstream in Eclipse, and Daily Builds Are Available",
      de: "Eclipse unterstützt erstmals RISC-V: Tägliche Builds zum Ausprobieren",
    },
    description: {
      "zh-Hans": "介绍 Eclipse 上游对 riscv64 的初步支持，以及可供试用的每日构建镜像。",
      en: "An introduction to the upstream riscv64 support in Eclipse and the available daily builds.",
      de: "Erste riscv64-Unterstützung im Eclipse-Projekt und tägliche Builds zum Ausprobieren.",
    },
  },
  {
    slug: "2024-12-31-th1520",
    date: "2024-12-31",
    title: {
      "zh-Hans": "内核从 5.10 升级至 6.6，RuyiSDK 发布面向 TH1520 系列开发板操作系统新镜像",
      en: "Kernel Upgraded from 5.10 to 6.6: New RuyiSDK Images for TH1520 Development Boards",
      de: "Linux 6.6: Neue RuyiSDK-Systemabbilder für TH1520-Boards",
    },
    description: {
      "zh-Hans": "介绍面向 TH1520 系列开发板的新 RevyOS 镜像与相关支持更新。",
      en: "An overview of the new RevyOS images and support updates for TH1520 boards.",
      de: "Neue RevyOS-Abbilder und erweiterte Unterstützung für TH1520-Boards.",
    },
  },
];

export function getLocalizedArticleField(article, field, locale) {
  const value = article[field];
  if (!value) return "";
  return value[locale] || value.en || value["zh-Hans"] || "";
}
