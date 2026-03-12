
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
        en: "RuyiSDK Package Manager"
      },
      subtitle: {
        "zh-Hans": "从包管理器获取 RuyiSDK 资源",
        en: "Access and manage RuyiSDK resources through the package manager"
      },
      Image: "img/home-cardnews-manager.png",
      Links: "/docs/intro",
    },
    {
      index: 2,
      title: "Support Matrix",
      subtitle: {
        "zh-Hans": "RISC-V 开发板与操作系统支持矩阵",
        en: "RISC-V Board and OS Support Matrix"
      },
      Image: "img/home-cardnews-matrix.png",
      Links: externalLinks("support-matrix"),
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
      Image: "img/home-cardnews-eclipse.jpg",
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
      Image: "img/home-cardnews-vscode.png",
      Links: "/docs/VSCode-Plugins/",
      subLink: "https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension",
      subText: {
        "zh-Hans": "从市场下载",
        en: "Marketplace"
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