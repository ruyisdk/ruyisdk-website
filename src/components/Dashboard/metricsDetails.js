import React from "react";
import styles from "./styles.module.css";

export const getMetricDetails = (index, locale) => {
  const data = {
    "zh-Hans": [
      // 1. RuyiSDK 组件包下载量
      {
        title: "RuyiSDK 组件包下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">ISCAS 镜像源 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> 目录下所有二进制组件包的累计下载次数。</p>
            <p className={styles.tooltipLabel}>包含组件：</p>
            <p className="mb-2">GNU/LLVM 工具链、QEMU 模拟器、调试器、性能分析工具等。</p>
            <p className={styles.tooltipLabel}>统计方式：</p>
            <p className="mb-2">基于 ISCAS 镜像源服务器访问日志，统计对相关软件包文件的请求。</p>
            <p className={styles.tooltipWarning}>⚠️ 注意：同一组件不同版本、不同架构分别计数；不反映独立用户数。仅统计 ISCAS 镜像源渠道，不含 GitHub Releases 等其他来源。</p>
          </div>
        )
      },
      // 2. RuyiSDK 遥测设备数
      {
        title: "RuyiSDK 遥测设备数",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">RuyiSDK 包管理器向后端上报的唯一设备标识符（UUID）的去重数量。</p>
            <p className={styles.tooltipLabel}>UUID 生成与生命周期：</p>
            <p className="mb-2">首次运行 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> 时（若未禁用遥测），本地生成并持久化一个随机 UUID。重装系统、删除本地缓存或切换用户会导致原 UUID 丢失，再次运行生成新 UUID（同一物理设备可能被计为多台）。</p>
            <p className={styles.tooltipLabel}>上报时机：</p>
            <ul className="list-disc pl-4 mb-2">
              <li><strong>首次上报：</strong>首次运行且未禁用遥测时，在退出前上报包含 UUID 的环境基础信息。</li>
              <li><strong>定期上报：</strong>若用户主动开启“定期上传”功能，后续会按周期自动上报使用数据。</li>
            </ul>
            <p className={styles.tooltipLabel}>隐私保护与控制：</p>
            <p className="mb-2">不含个人身份、IP 或地理位置。用户可随时通过 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry optout</code> 禁用遥测，或通过 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry local</code> 仅本地记录。</p>
          </div>
        )
      },
      // 3. RuyiSDK 文档下载量
      {
        title: "RuyiSDK 文档下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">ISCAS 镜像源分发的文档资源（PDF、HTML 包、Markdown 打包文件等）的下载次数。</p>
            <p className={styles.tooltipLabel}>文档类型：</p>
            <p className="mb-2">含用户手册、规格书、峰会演示稿、技术白皮书、最佳实践指南等。</p>
            <p className={styles.tooltipLabel}>统计方式：</p>
            <p className="mb-2">根据 ISCAS 镜像源服务器日志，按文件下载请求计数。</p>
          </div>
        )
      },
      // 4. RuyiSDK 包管理器下载量
      {
        title: "RuyiSDK 包管理器下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">Ruyi 包管理器命令行工具 <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> 在以下三个渠道的累计下载次数汇总：</p>
            <ul className="list-disc pl-4 mb-2">
              <li>ISCAS 镜像源（<code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code> 目录下）</li>
              <li>GitHub Releases（预编译二进制包）</li>
              <li>PyPI（<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>）</li>
            </ul>
            <p className={styles.tooltipWarning}>📌 注意：不包括从 Linux 发行版系统包仓库安装的用户；不同渠道同一用户可能重复下载。</p>
          </div>
        )
      },
      // 5. RuyiSDK VS Code 插件下载量
      {
        title: "RuyiSDK VS Code 插件下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">RuyiSDK VS Code 插件在 <strong>ISCAS 镜像源</strong>（离线 VSIX 文件）和 <strong>GitHub Releases</strong> 的累计下载次数。</p>
            <p className={styles.tooltipWarning}>📌 注意：当前统计数据不包含 Open VSX 和 Visual Studio Marketplace 两个应用市场渠道。</p>
          </div>
        )
      },
      // 6. RuyiSDK Eclipse 组件下载量
      {
        title: "RuyiSDK Eclipse 组件下载量",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>定义：</p>
            <p className="mb-2">RuyiSDK 提供的 Eclipse IDE 定制包及插件 of 累计下载次数。</p>
            <p className={styles.tooltipLabel}>包含内容：</p>
            <ul className="list-disc pl-4 mb-2">
              <li>预集成的 Eclipse IDE for RuyiSDK（含 RISC-V 开发插件）</li>
              <li>独立插件（可安装到现有 Eclipse）</li>
            </ul>
            <p className={styles.tooltipLabel}>包含渠道：</p>
            <p className="mb-2">ISCAS 镜像源（<code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/ide/</code> 目录下的完整 IDE 包和插件包）及 GitHub Releases。</p>
            <p className={styles.tooltipWarning}>📌 注意：当前统计数据不包含 Eclipse Marketplace 市场。</p>
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
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Cumulative downloads of all binary component packages under the <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> directory on ISCAS mirrors.</p>
            <p className={styles.tooltipLabel}>Included components:</p>
            <p className="mb-2">GNU/LLVM toolchains, QEMU emulator, debuggers, profiling tools, and other components.</p>
            <p className={styles.tooltipLabel}>Counting method:</p>
            <p className="mb-2">Based on ISCAS mirror server access logs, counting requests for package files under the <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> directory.</p>
            <p className={styles.tooltipWarning}>⚠️ Note: different versions and architectures of the same component are counted separately. This does not represent unique users. Only the ISCAS mirror channel is counted.</p>
          </div>
        )
      },
      // 2. Ruyi Telemetry Upload Installations
      {
        title: "Ruyi Telemetry Upload Installations",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Deduplicated count of unique device identifiers (UUIDs) reported by the RuyiSDK package manager backend.</p>
            <p className={styles.tooltipLabel}>UUID Generation & Lifecycle:</p>
            <p className="mb-2">When <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> is run for the first time (if telemetry is enabled), a random UUID is generated and stored locally. Reinstalling the OS, deleting local cache, or switching user accounts will reset the UUID.</p>
            <p className={styles.tooltipLabel}>Reporting Timing:</p>
            <ul className="list-disc pl-4 mb-2">
              <li><strong>Initial report:</strong> automatically reports basic environment info containing the UUID on first run.</li>
              <li><strong>Periodic report:</strong> if explicitly enabled with <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry consent</code>, usage data is reported at weekly intervals.</li>
            </ul>
            <p className={styles.tooltipLabel}>Privacy & Control:</p>
            <p className="mb-2">No personal identity, IP or geolocation is sent. Disable completely with <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry optout</code> or log locally with <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry local</code>.</p>
          </div>
        )
      },
      // 3. RuyiSDK Documentation Downloads
      {
        title: "RuyiSDK Documentation Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Downloads of documentation resources distributed through ISCAS mirrors, such as PDF files, HTML packages, and packaged Markdown files.</p>
            <p className={styles.tooltipLabel}>Document types:</p>
            <p className="mb-2">Includes user manuals, specifications, summit slides, white papers, best practice guides, etc.</p>
            <p className={styles.tooltipLabel}>Counting method:</p>
            <p className="mb-2">Based on ISCAS mirror server logs, counted by file download requests.</p>
          </div>
        )
      },
      // 4. RuyiSDK Package Manager Downloads
      {
        title: "RuyiSDK Package Manager Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Cumulative downloads of the Ruyi package manager CLI tool <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> across the following three channels:</p>
            <ul className="list-disc pl-4 mb-2">
              <li>ISCAS mirrors (under the <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code> directory)</li>
              <li>GitHub Releases (prebuilt binary packages)</li>
              <li>PyPI (<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>)</li>
            </ul>
            <p className={styles.tooltipWarning}>📌 Note: This does not include users installing from Linux distribution repositories. The same user may download from multiple channels.</p>
          </div>
        )
      },
      // 5. VSCode Extension Downloads
      {
        title: "VSCode Extension Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Cumulative downloads of the RuyiSDK VS Code extension through <strong>ISCAS mirrors</strong> (offline VSIX files) and <strong>GitHub Releases</strong>.</p>
            <p className={styles.tooltipWarning}>📌 Note: Statistics do not include Open VSX or Visual Studio Marketplace.</p>
          </div>
        )
      },
      // 6. Eclipse Plugin Downloads
      {
        title: "Eclipse Plugin Downloads",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Cumulative downloads of RuyiSDK Eclipse IDE packages and plugins.</p>
            <p className={styles.tooltipLabel}>Included content:</p>
            <ul className="list-disc pl-4 mb-2">
              <li>Pre-integrated Eclipse IDE for RuyiSDK (including RISC-V plugins)</li>
              <li>Standalone plugins for existing Eclipse installations</li>
            </ul>
            <p className={styles.tooltipLabel}>Included channels:</p>
            <p className="mb-2">ISCAS mirrors (complete packages under <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/ide/</code>) and GitHub Releases.</p>
            <p className={styles.tooltipWarning}>📌 Note: Statistics do not include Eclipse Marketplace.</p>
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
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Kumulierte Downloads aller binären Komponentenpakete im Verzeichnis <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code> auf den ISCAS-Spiegelservern.</p>
            <p className={styles.tooltipLabel}>Enthaltene Komponenten:</p>
            <p className="mb-2">GNU/LLVM-Toolchains, QEMU-Emulator, Debugger, Profiling-Werkzeuge und weitere Komponenten.</p>
            <p className={styles.tooltipLabel}>Zählmethode:</p>
            <p className="mb-2">Auswertung der Zugriffs-Logs der ISCAS-Spiegelserver; gezählt werden Anfragen auf Paketdateien unter <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/dist</code>.</p>
            <p className={styles.tooltipWarning}>⚠️ Hinweis: Unterschiedliche Versionen und Architekturen derselben Komponente werden getrennt gezählt. Zählt nur den ISCAS-Spiegelkanal.</p>
          </div>
        )
      },
      // 2. Von RuyiSDK-Telemetrie gemeldete Geräte
      {
        title: "Von RuyiSDK-Telemetrie gemeldete Geräte",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Deduplizierte Anzahl eindeutiger Gerätekennungen (UUIDs), die vom RuyiSDK-Paketmanager an das Backend gemeldet wurden.</p>
            <p className={styles.tooltipLabel}>UUID-Erzeugung & Lebenszyklus:</p>
            <p className="mb-2">Beim ersten Ausführen von <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> (wenn Telemetrie aktiviert) wird eine zufällige UUID erzeugt und lokal gespeichert. Neuinstallation des Betriebssystems, Löschen lokaler Caches oder Wechsel des Benutzerkontos setzt die UUID zurück.</p>
            <p className={styles.tooltipLabel}>Zeitpunkt der Meldung:</p>
            <ul className="list-disc pl-4 mb-2">
              <li><strong>Erstmeldung:</strong> meldet automatisch grundlegende Umgebungsinformationen einschließlich UUID beim ersten Lauf.</li>
              <li><strong>Periodische Meldung:</strong> bei Aktivierung mit <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry consent</code> werden wöchentlich Nutzungsdaten gemeldet.</li>
            </ul>
            <p className={styles.tooltipLabel}>Datenschutz & Kontrolle:</p>
            <p className="mb-2">Keine personenbezogenen Daten, IP oder Geostandort. Deaktivieren Sie mit <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry optout</code> oder speichern Sie lokal mit <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi telemetry local</code>.</p>
          </div>
        )
      },
      // 3. Downloads von RuyiSDK-Dokumentation
      {
        title: "Downloads von RuyiSDK-Dokumentation",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Downloads von Dokumentationsressourcen, die über ISCAS-Spiegelserver verteilt werden, etwa PDF-Dateien, HTML-Pakete und gepackte Markdown-Dateien.</p>
            <p className={styles.tooltipLabel}>Dokumenttypen:</p>
            <p className="mb-2">Benutzerhandbücher, Spezifikationen, Konferenzpräsentationen, Whitepaper, Best-Practice-Leitfäden usw.</p>
            <p className={styles.tooltipLabel}>Zählmethode:</p>
            <p className="mb-2">Auswertung der Server-Logs der ISCAS-Spiegelserver; gezählt werden Datei-Download-Anfragen.</p>
          </div>
        )
      },
      // 4. Downloads des RuyiSDK-Paketmanagers
      {
        title: "Downloads des RuyiSDK-Paketmanagers",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Kumulierte Downloads des Ruyi-Paketmanager-CLI-Werkzeugs <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi</code> über die folgenden drei Kanäle:</p>
            <ul className="list-disc pl-4 mb-2">
              <li>ISCAS-Spiegelserver (im Verzeichnis <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyi/</code>)</li>
              <li>GitHub Releases (vorkompilierte Binärpakete)</li>
              <li>PyPI (<code className="bg-black/10 dark:bg-black/20 px-1 rounded">pip install ruyi</code>)</li>
            </ul>
            <p className={styles.tooltipWarning}>📌 Hinweis: Nicht enthalten sind Installationen aus Paketquellen von Linux-Distributionen.</p>
          </div>
        )
      },
      // 5. Downloads der RuyiSDK-VS-Code-Erweiterung
      {
        title: "Downloads der RuyiSDK-VS-Code-Erweiterung",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Kumulierte Downloads der RuyiSDK-VS-Code-Erweiterung über <strong>ISCAS-Spiegelserver</strong> (Offline-VSIX-Dateien) und <strong>GitHub Releases</strong>.</p>
            <p className={styles.tooltipWarning}>📌 Hinweis: Open VSX und Visual Studio Marketplace sind nicht enthalten.</p>
          </div>
        )
      },
      // 6. Downloads von RuyiSDK-Eclipse-Komponenten
      {
        title: "Downloads von RuyiSDK-Eclipse-Komponenten",
        content: (
          <div className="text-left text-xs leading-relaxed max-w-xs md:max-w-sm">
            <p className={styles.tooltipLabel}>Definition:</p>
            <p className="mb-2">Kumulierte Downloads der RuyiSDK-Eclipse-IDE-Pakete und Plugins.</p>
            <p className={styles.tooltipLabel}>Enthaltene Inhalte:</p>
            <ul className="list-disc pl-4 mb-2">
              <li>Vorintegrierte Eclipse IDE for RuyiSDK (einschließlich RISC-V-Plugins)</li>
              <li>Eigenständige Plugins für vorhandene Eclipse-Installationen</li>
            </ul>
            <p className={styles.tooltipLabel}>Enthaltene Kanäle:</p>
            <p className="mb-2">ISCAS-Spiegelserver (vollständige Pakete unter <code className="bg-black/10 dark:bg-black/20 px-1 rounded">ruyisdk/ide/</code>) und GitHub Releases.</p>
            <p className={styles.tooltipWarning}>📌 Hinweis: Eclipse Marketplace ist nicht enthalten.</p>
          </div>
        )
      }
    ]
  };

  const list = data[locale] || data["en"];
  return list[index] || { title: "", content: null };
};
