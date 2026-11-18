
import cardS from "./CardS"
import cardM from "./CardM"
import cardL from "./CardL"

import { externalLinks } from "../common/byLocale";

function ruyiCard() {

  const cards = [
    {
      index: 1,
      title: {
        "zh-Hans": "RuyiSDK 包管理器",
        en: "RuyiSDK Package Manager",
        de: "RuyiSDK-Paketmanager"
      },
      subtitle: {
        "zh-Hans": "从包管理器获取 RuyiSDK 资源",
        en: "Access and manage RuyiSDK resources through the package manager",
        de: "RuyiSDK-Ressourcen mit dem Paketmanager abrufen und verwalten"
      },
      Image: "img/home/cardnews/home-cardnews-manager.webp",
      Links: "/docs/intro",
    },
    {
      index: 2,
      title: "Support Matrix",
      subtitle: {
        "zh-Hans": "RISC-V 开发板与操作系统支持矩阵",
        en: "RISC-V Board and OS Support Matrix",
        de: "Unterstützte RISC-V-Boards und Betriebssysteme"
      },
      Image: "img/home/cardnews/home-cardnews-matrix.webp",
      Links: externalLinks("support-matrix"),
    },
    {
      index: 3,
      title: {
        "zh-Hans": "Eclipse 插件",
        en: "Eclipse Plugin",
        de: "Eclipse-Plug-in"
      },
      subtitle: {
        "zh-Hans": "RuyiSDK 包管理器的 Eclipse 集成",
        en: "Eclipse integration for the RuyiSDK Package Manager",
        de: "RuyiSDK-Paketmanager in Eclipse"
      },
      Image: "img/home/cardnews/home-cardnews-eclipse.webp",
      Links: "/docs/IDE/",
      subLink: "https://marketplace.eclipse.org/content/ruyisdk",
      subText: {
        "zh-Hans": "从市场下载",
        en: "Marketplace",
        de: "Marketplace"
      },
    },
    {
      index: 4,
      title: {
        "zh-Hans": "VS Code 插件",
        en: "VS Code Extension",
        de: "VS-Code-Erweiterung"
      },
      subtitle: {
        "zh-Hans": "RuyiSDK 包管理器的 VS Code 集成",
        en: "RuyiSDK Package Manager integration for VS Code",
        de: "RuyiSDK-Paketmanager in VS Code"
      },
      Image: "img/home/cardnews/home-cardnews-vscode.webp",
      Links: "/docs/VSCode-Plugins/",
      subLink: "https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension",
      subText: {
        "zh-Hans": "从市场下载",
        en: "Marketplace",
        de: "Marketplace"
      },
    },
  ];

  return cardS(cards);
}


export default function CardNews() {
  return (
    <div className={`flex flex-wrap gap-4 w-full`}>
      {ruyiCard()}
    </div>
  );
}
