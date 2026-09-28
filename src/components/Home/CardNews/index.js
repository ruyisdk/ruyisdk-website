
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import cardS from "./CardS";

import { getExternalLink } from "@site/src/utils/locale";

function ruyiCard(locale, externalLinkMap) {

  const cards = [
    {
      index: 1,
      title: {
        "zh-Hans": "RuyiSDK 包管理器",
        en: "RuyiSDK Package Manager"
      },
      subtitle: {
        "zh-Hans": "从包管理器获取 RuyiSDK 资源",
        en: "Access and manage RuyiSDK resources through the package manager"
      },
      Image: "img/home/cardnews/home-cardnews-manager.webp",
      Links: "/docs/intro",
    },
    {
      index: 2,
      title: "Support Matrix",
      subtitle: {
        "zh-Hans": "RISC-V 开发板与操作系统支持矩阵",
        en: "RISC-V Board and OS Support Matrix"
      },
      Image: "img/home/cardnews/home-cardnews-matrix.webp",
      Links: getExternalLink(externalLinkMap, "support-matrix", locale),
    },
    {
      index: 3,
      title: {
        "zh-Hans": "Eclipse 插件",
        en: "Eclipse Plugin"
      },
      subtitle: {
        "zh-Hans": "RuyiSDK 包管理器的 Eclipse 集成",
        en: "Eclipse integration for the RuyiSDK Package Manager"
      },
      Image: "img/home/cardnews/home-cardnews-eclipse.webp",
      Links: "/docs/IDE/",
      subLink: "https://marketplace.eclipse.org/content/ruyisdk",
      subText: {
        "zh-Hans": "从市场下载",
        en: "Marketplace"
      },
    },
    {
      index: 4,
      title: {
        "zh-Hans": "VS Code 插件",
        en: "VSCode Extension"
      },
      subtitle: {
        "zh-Hans": "RuyiSDK 包管理器的 VS Code 集成",
        en: "Visual Studio Code integration for the RuyiSDK Package Manager"
      },
      Image: "img/home/cardnews/home-cardnews-vscode.webp",
      Links: "/docs/VSCode-Plugins/",
      subLink: "https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension",
      subText: {
        "zh-Hans": "从市场下载",
        en: "Marketplace"
      },
    },
  ];

  return cardS(cards, locale);
}


export default function CardNews() {
  const { i18n, siteConfig } = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const externalLinkMap = siteConfig.customFields.externalLinks;

  return (
    <div className={`flex flex-wrap gap-4 w-full`}>
      {ruyiCard(locale, externalLinkMap)}
    </div>
  );
}