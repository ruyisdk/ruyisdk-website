# 📊 RuyiSDK 统计数据详细说明

## 致读者

感谢您关注 RuyiSDK 的统计数据。在阅读具体指标前，有几点背景信息希望与您同步：

**RuyiSDK 软件栈包含两类产品**  
- **基础软件**：GNU 编译工具链、LLVM 工具链、QEMU 模拟器、V8、OpenJDK、Go 等。  
- **开发工具**：RuyiSDK 包管理器、VS Code 插件、Eclipse 插件等。

**分发渠道多样，统计覆盖有限**  
- 基础软件的适配成果主要通过上游社区回馈，分发方式跟随后续集成的各上游社区，数据难以统一追踪。
- 开发工具采用多渠道分发（ISCAS 镜像源、GitHub、应用市场、Linux 发行版仓库等），以方便用户按需获取。  
- 其中 **ISCAS 镜像源（即 RuyiSDK 官方软件源）** 和 **GitHub Releases** 提供了可编程访问的下载日志，因此统计数据**主要涵盖这两个渠道**。  
- 其他渠道（如应用市场、Linux 发行版系统仓库）受限于数据接口，暂时**无法纳入统计**，相关数据需前往各市场页面自行查阅。

**数据的用途与局限**  
所有统计仅用于产品改进参考，受客观条件限制，数据可能存在不精准之处，请以趋势和方向性判断为主。

以下为渠道覆盖总览及各统计项的详细口径说明。

---
## RuyiSDK 分发渠道及是否纳入官网统计页面一览

| 渠道 | 包管理器 | VS Code 插件 | Eclipse 插件 | 纳入统计页面 |
| --- | --- | --- | --- | --- |
| ISCAS 镜像源 | ✓ | ✓ | ✓ | ✅ |
| GitHub Releases | ✓ | ✓ | ✓ | ✅ |
| PyPI | ✓ | ∅ | ∅ | ✅ |
| Linux 发行版系统包仓库 | ✓（进展中） | ∅ | ∅ | ❌ |
| Open VSX | ∅ | ✓ | ∅ | ❌ |
| Visual Studio Marketplace | ∅ | ✓ | ∅ | ❌ |
| Eclipse Marketplace | ∅ | ∅ | ✓ | ❌ |

> **符号说明**  
> - `✓`：该产品在此渠道有分发支持  
> - `∅`：该产品不适用于此渠道（无需分发）  
> - `✅`：该渠道的下载量**计入**官网统计面板中的对应指标  
> - `❌`：该渠道的下载量**不计入**官网统计面板（需前往对应市场页面查看）
>
> 应用市场的具体数据请访问文末提供的链接查看。

---

## RuyiSDK 统计页面统计数据说明

以下说明对应官网统计面板中的 6 项核心指标，分别列出定义、统计范围及注意事项。

### 1. RuyiSDK 组件包下载量

**定义**：ISCAS 镜像源 `ruyisdk/dist` 目录下所有二进制组件包的累计下载次数。  

**包含组件**：GNU/LLVM 工具链、QEMU 模拟器、调试器、性能分析工具等。  

**统计方式**：基于 ISCAS 镜像源服务器访问日志，统计对 `ruyisdk/dist` 目录下软件包文件的请求。  

> ⚠️ **注意**：同一组件不同版本、不同架构分别计数；不反映独立用户数。**仅统计 ISCAS 镜像源渠道**，不含 GitHub Releases 等其他来源。


### 2. RuyiSDK 遥测设备上报数

**定义**：RuyiSDK 包管理器向后端上报的唯一设备标识符（UUID）的去重数量。

**UUID 生成与生命周期**：每个操作系统实例（用户主目录）首次运行 `ruyi` 时，若用户未禁用遥测，系统会生成一个随机 UUID 并持久化存储在本地。重装操作系统、删除本地缓存或切换用户账户后，原 UUID 丢失，新环境会生成新的 UUID，因此同一物理设备可能被计为多台。

**上报时机**：  
- **首次上报**：首次运行且用户未禁用遥测时，会在退出前自动上报一次包含 UUID 的环境基础信息，用于统计新增设备数量。  
- **定期上报**：若用户主动开启“定期上传”功能（通过 `ruyi telemetry consent` 命令），后续会按周期间隔自动上报使用数据，每次上报均携带同一 UUID。

**隐私保护**：上报内容不含个人身份信息、IP 地址或地理位置，仅包含匿名基础信息（如 CPU 架构、操作系统类型、`ruyi` 版本等），用于了解用户环境构成。

**用户控制**：用户可随时通过 `ruyi telemetry optout` 完全禁用遥测（此时不会生成 UUID，也不会进行任何上报），或通过 `ruyi telemetry local` 仅本地记录数据而不上传。首次运行时，`ruyi` 会明确征求用户同意，默认行为由用户当场选择。

**局限性**：  
- 用户可自愿关闭遥测，导致部分设备未被统计。  
- 同一物理设备因重装系统、删除缓存等原因可能产生多个 UUID，可能使设备数偏高。



### 3. RuyiSDK 文档下载量

**定义**：ISCAS 镜像源分发的文档资源（PDF、HTML 包、Markdown 打包文件等）的下载次数。  

**文档类型**：峰会演示文稿、RVI 规范文档、用户手册、技术白皮书、最佳实践指南等。  

**统计方式**：ISCAS 镜像源服务器日志，按文件下载请求计数。

### 4. RuyiSDK 包管理器下载量

**定义**：Ruyi 包管理器命令行工具 `ruyi` 在以下三个渠道的累计下载次数：  
- ISCAS 镜像源（`ruyi/` 目录下多架构多版本的下载量）  
- GitHub Releases（预编译二进制包）  
- PyPI（`pip install ruyi`）  

> 📌 不包括从 Linux 发行版系统包仓库安装的用户；不同渠道同一用户可能重复下载。Linux 发行版系统包仓库的下载量暂无法统计，目前工作重点是将 `ruyi` 引入各发行版官方源。

### 5. RuyiSDK VS Code 插件下载量

**定义**：RuyiSDK VS Code 插件的累计下载次数。 统计页面下载量数据当前仅反映 ISCAS 镜像源和 GitHub Releases 的分发量。

**包含渠道**：  
- ISCAS 镜像源（离线 VSIX 文件）  
- GitHub Releases  

> 📌 **统计页面中的下载量数据不包含 Open VSX 和 Visual Studio Marketplace 两个市场**。 如需查看 Open VSX 或 Visual Studio Marketplace 的数据，请访问对应市场页面。

### 6. RuyiSDK Eclipse 组件下载量

**定义**：RuyiSDK 提供的 Eclipse IDE 定制包及插件的累计下载次数。统计页面下载量数据当前仅反映 ISCAS 镜像源和 GitHub Releases 的分发量。

**包含内容**：  
- 预集成的 Eclipse IDE for RuyiSDK（含 RISC-V 开发插件）  
- 独立插件（可安装到现有 Eclipse）  

**包含渠道**：  
- ISCAS 镜像源（`ruyisdk/ide/` 目录下的完整 IDE 包和插件包）  
- GitHub Releases  

> 📌 **统计页面中的下载量数据不包含 Eclipse Marketplace 市场**。  Eclipse Marketplace 数据未纳入本指标，如需查询请访问其官方页面。

---

## RuyiSDK 分发渠道与链接

- [ISCAS 镜像源（RuyiSDK 官方软件源）](https://fast-mirror.isrc.ac.cn/ruyisdk/)：项目主分发点，由 ISCAS 托管。  

### RuyiSDK 包管理器分发渠道

- [PyPI](https://pypi.org/project/ruyi/)：`pip install ruyi` 安装。  
- [GitHub Releases](https://github.com/ruyisdk/ruyi/releases/)：多架构、多 Linux 发行版兼容的二进制包。  
- [ISCAS 镜像源（ruyi 目录）](https://mirror.iscas.ac.cn/ruyisdk/ruyi/)：多架构、多 Linux 发行版兼容的二进制包。 
- Linux 发行版系统包仓库（进展中）：在多个主流的 Linux 发行版中推进 ruyi 的入源工作（将ruyi引入系统镜像源，通过类似 `apt/dnf install ruyi` 方式安装）。

### RuyiSDK VS Code Extension 分发渠道

- [Open VSX](https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension)：适用于 VSCodium。  
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage/publishers/RuyiSDK)：适用于 VS Code。  
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-vscode-extension/releases/)：手动下载 VSIX 安装。  
- [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/)：手动下载 VSIX 安装。

### RuyiSDK Eclipse Plugins 分发渠道

- [Eclipse Marketplace](https://marketplace.eclipse.org/content/ruyisdk#metrics)：插件索引中心。  
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/)：手动下载 ZIP 包安装。  
- [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/)：手动下载 ZIP 包安装。  

> **关于 Eclipse Marketplace 统计数据的说明**  
> - Eclipse Marketplace 仅提供插件索引，不托管插件文件。用户在 Eclipse 内更新已安装插件时将绕过市场，因此无法产生准确的下载计数。  
> - 市场网站接口可能存在故障，准确的安装次数需在 Eclipse IDE 内置商店页面中手动查看，且通过更新方式安装时 `installed` 计数可能保持不变。

---

*RuyiSDK 团队维护 · 本说明文档随统计口径调整不定期更新 · 最后更新时间：2026年5月9日*
