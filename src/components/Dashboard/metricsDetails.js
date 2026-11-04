import React from "react";

export const getMetricDetails = (index, locale) => {
  const data = {
    "zh-Hans": [
      // 1. RuyiSDK 组件包下载量
      {
        title: "RuyiSDK 组件包下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>ISCAS 镜像源 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> 目录下所有二进制组件包的累计下载次数（包含 GNU/LLVM 工具链、QEMU 模拟器、调试器、性能分析工具等）。</p>
          </div>
        )
      },
      // 2. RuyiSDK 遥测设备数
      {
        title: "RuyiSDK 遥测设备数",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>RuyiSDK 包管理器向后端上报的唯一设备标识符（UUID）的去重数量。</p>
          </div>
        )
      },
      // 3. RuyiSDK 文档下载量
      {
        title: "RuyiSDK 文档下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>ISCAS 镜像源分发的文档资源（PDF、HTML 包、Markdown 打包文件等）的下载次数。</p>
          </div>
        )
      },
      // 4. RuyiSDK 包管理器下载量
      {
        title: "RuyiSDK 包管理器下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Ruyi 包管理器命令行工具 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> 在以下三个渠道的累计下载次数汇总：</p>
            <ul className="list-disc pl-4 mt-1">
              <li>ISCAS 镜像源（<code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code> 目录下）</li>
              <li>GitHub Releases（预编译二进制包）</li>
              <li>PyPI（<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>）</li>
            </ul>
          </div>
        )
      },
      // 5. RuyiSDK VS Code 插件下载量
      {
        title: "RuyiSDK VS Code 插件下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>RuyiSDK VS Code 插件在 ISCAS 镜像源（离线 VSIX 文件）和 GitHub Releases 的累计下载次数。</p>
          </div>
        )
      },
      // 6. RuyiSDK Eclipse 组件下载量
      {
        title: "RuyiSDK Eclipse 组件下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>RuyiSDK 提供的 Eclipse IDE 定制包及插件的累计下载次数。</p>
          </div>
        )
      }
    ],
    en: [
      // 1. RuyiSDK Component Downloads
      {
        title: "RuyiSDK Component Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Cumulative downloads of all binary component packages (including GNU/LLVM toolchains, QEMU emulator, debuggers, and profiling tools) under the <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> directory on ISCAS mirrors.</p>
          </div>
        )
      },
      // 2. Ruyi Telemetry Upload Installations
      {
        title: "Ruyi Telemetry Upload Installations",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Deduplicated count of unique device identifiers (UUIDs) reported by the RuyiSDK package manager backend.</p>
          </div>
        )
      },
      // 3. RuyiSDK Documentation Downloads
      {
        title: "RuyiSDK Documentation Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Downloads of documentation resources distributed through ISCAS mirrors, such as PDF files, HTML packages, and packaged Markdown files.</p>
          </div>
        )
      },
      // 4. RuyiSDK Package Manager Downloads
      {
        title: "RuyiSDK Package Manager Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Cumulative downloads of the Ruyi package manager CLI tool <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> across the following three channels:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>ISCAS mirrors (under the <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code> directory)</li>
              <li>GitHub Releases (prebuilt binary packages)</li>
              <li>PyPI (<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>)</li>
            </ul>
          </div>
        )
      },
      // 5. VSCode Extension Downloads
      {
        title: "VSCode Extension Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Cumulative downloads of the RuyiSDK VS Code extension through ISCAS mirrors (offline VSIX files) and GitHub Releases.</p>
          </div>
        )
      },
      // 6. Eclipse Plugin Downloads
      {
        title: "Eclipse Plugin Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Cumulative downloads of RuyiSDK Eclipse IDE packages and plugins.</p>
          </div>
        )
      }
    ],
    de: [
      // 1. Downloads von RuyiSDK-Komponentenpaketen
      {
        title: "Downloads von RuyiSDK-Komponentenpaketen",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Kumulierte Downloads aller binären Komponentenpakete (einschließlich GNU/LLVM-Toolchains, QEMU-Emulator, Debugger und Profiling-Werkzeuge) im Verzeichnis <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> auf den ISCAS-Spiegelservern.</p>
          </div>
        )
      },
      // 2. Von RuyiSDK-Telemetrie gemeldete Geräte
      {
        title: "Von RuyiSDK-Telemetrie gemeldete Geräte",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Deduplizierte Anzahl eindeutiger Gerätekennungen (UUIDs), die vom RuyiSDK-Paketmanager an das Backend gemeldet wurden.</p>
          </div>
        )
      },
      // 3. Downloads von RuyiSDK-Dokumentation
      {
        title: "Downloads von RuyiSDK-Dokumentation",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Downloads von Dokumentationsressourcen, die über ISCAS-Spiegelserver verteilt werden, etwa PDF-Dateien, HTML-Pakete und gepackte Markdown-Dateien.</p>
          </div>
        )
      },
      // 4. Downloads des RuyiSDK-Paketmanagers
      {
        title: "Downloads des RuyiSDK-Paketmanagers",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Kumulierte Downloads des Ruyi-Paketmanager-CLI-Werkzeugs <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> über die folgenden drei Kanäle:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>ISCAS-Spiegelserver (im Verzeichnis <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code>)</li>
              <li>GitHub Releases (vorkompilierte Binärpakete)</li>
              <li>PyPI (<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>)</li>
            </ul>
          </div>
        )
      },
      // 5. Downloads der RuyiSDK-VS-Code-Erweiterung
      {
        title: "Downloads der RuyiSDK-VS-Code-Erweiterung",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Kumulierte Downloads der RuyiSDK-VS-Code-Erweiterung über ISCAS-Spiegelserver (Offline-VSIX-Dateien) und GitHub Releases.</p>
          </div>
        )
      },
      // 6. Downloads von RuyiSDK-Eclipse-Komponenten
      {
        title: "Downloads von RuyiSDK-Eclipse-Komponenten",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p>Kumulierte Downloads der RuyiSDK-Eclipse-IDE-Pakete und Plugins.</p>
          </div>
        )
      }
    ]
  };

  const list = data[locale] || data["en"];
  return list[index] || { title: "", content: null };
};
