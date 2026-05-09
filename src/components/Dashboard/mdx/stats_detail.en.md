# 📊 RuyiSDK Statistics Data Details

## For Readers

Thank you for following RuyiSDK statistics. Before reading the detailed metrics, please note the following background information:

**The RuyiSDK software stack includes two categories of products**
- **Base software**: GNU toolchains, LLVM toolchains, QEMU emulator, V8, OpenJDK, Go, and more.
- **Development tools**: RuyiSDK package manager, VS Code extension, Eclipse plugins, and more.

**Distribution channels are diverse, and statistics coverage is limited**
- Base software adaptation work is primarily contributed back to upstream communities. Distribution follows each upstream community, so the data is difficult to track in a unified way.
- Development tools are distributed through multiple channels, including ISCAS mirrors, GitHub, application marketplaces, and Linux distribution repositories, so users can choose the most suitable source.
- Among these channels, **ISCAS mirrors (the official RuyiSDK software source)** and **GitHub Releases** provide programmable access to download logs. Therefore, the statistics **mainly cover these two channels**.
- Other channels, such as application marketplaces and Linux distribution repositories, are not currently included because of data interface limitations. Please visit the corresponding marketplace pages for those metrics.

**Purpose and limitations of the data**
All statistics are used only as references for product improvement. Due to objective limitations, the data may not be fully precise. Please focus on trends and directional signals.

The following sections provide a channel coverage overview and detailed definitions for each metric.

---

## RuyiSDK Distribution Channels and Whether They Are Included in Official Statistics

| Channel | Package Manager | VS Code Extension | Eclipse Plugins | Included in Statistics |
| --- | --- | --- | --- | --- |
| ISCAS mirrors | ✓ | ✓ | ✓ | ✅ |
| GitHub Releases | ✓ | ✓ | ✓ | ✅ |
| PyPI | ✓ | ∅ | ∅ | ✅ |
| Linux distribution repositories | ✓ (in progress) | ∅ | ∅ | ❌ |
| Open VSX | ∅ | ✓ | ∅ | ❌ |
| Visual Studio Marketplace | ∅ | ✓ | ∅ | ❌ |
| Eclipse Marketplace | ∅ | ∅ | ✓ | ❌ |

> **Legend**
> - `✓`: this product is distributed through the channel.
> - `∅`: this channel does not apply to the product.
> - `✅`: downloads from this channel are counted in the corresponding official statistics panel.
> - `❌`: downloads from this channel are not counted in the official statistics panel and should be checked on the corresponding marketplace page.
>
> For application marketplace metrics, please visit the links at the end of this document.

---

## Explanation of RuyiSDK Statistics Page Metrics

The following explanations correspond to the six core metrics on the official statistics panel. Each item lists its definition, scope, and notes.

### 1. RuyiSDK Component Package Downloads

**Definition**: cumulative downloads of all binary component packages under the `ruyisdk/dist` directory on ISCAS mirrors.

**Included components**: GNU/LLVM toolchains, QEMU emulator, debuggers, profiling tools, and other components.

**Counting method**: based on ISCAS mirror server access logs, counting requests for package files under the `ruyisdk/dist` directory.

> ⚠️ **Note**: different versions and architectures of the same component are counted separately. This does not represent unique users. **Only the ISCAS mirror channel is counted**; GitHub Releases and other sources are not included.

### 2. RuyiSDK Telemetry Device Reports

**Definition**: deduplicated count of unique device identifiers (UUIDs) reported by the RuyiSDK package manager backend.

**UUID generation and lifecycle**: when `ruyi` is run for the first time in an operating system instance (user home directory), a random UUID is generated and stored locally if telemetry is not disabled. Reinstalling the operating system, deleting local cache, or switching user accounts can cause the original UUID to be lost and a new one to be generated. Therefore, the same physical device may be counted as multiple devices.

**Reporting timing**:
- **Initial report**: when run for the first time and telemetry is not disabled, `ruyi` automatically reports basic environment information containing the UUID before exit. This is used to count newly observed devices.
- **Periodic report**: if the user explicitly enables periodic uploads with `ruyi telemetry consent`, subsequent usage data is reported at weekly intervals. Each report carries the same UUID.

**Privacy protection**: reports do not contain personal identity information, IP addresses, or geolocation. They contain only anonymous basic information such as CPU architecture, operating system type, and `ruyi` version, used to understand user environments.

**User control**: users can disable telemetry completely with `ruyi telemetry optout`, in which case no UUID is generated and no data is reported. Users can also use `ruyi telemetry local` to record data locally only. On first run, `ruyi` explicitly asks for user consent, and the default behavior is chosen by the user at that time.

**Limitations**:
- Users may voluntarily disable telemetry, so some devices are not counted.
- The same physical device may generate multiple UUIDs because of system reinstallation or cache deletion, which may make the device count higher than the physical device count.

### 3. RuyiSDK Documentation Downloads

**Definition**: downloads of documentation resources distributed through ISCAS mirrors, such as PDF files, HTML packages, and packaged Markdown files.

**Document types**: summit presentations, RVI specification documents, user manuals, technical white papers, best practice guides, and more.

**Counting method**: based on ISCAS mirror server logs, counted by file download requests.

### 4. RuyiSDK Package Manager Downloads

**Definition**: cumulative downloads of the Ruyi package manager CLI tool `ruyi` across the following three channels:
- ISCAS mirrors: multi-architecture and multi-version downloads under the `ruyi/` directory.
- GitHub Releases: prebuilt binary packages.
- PyPI: `pip install ruyi`.

> 📌 This does not include users installing from Linux distribution repositories. The same user may download from multiple channels and be counted multiple times. Downloads from Linux distribution repositories cannot currently be counted. Current work focuses on introducing `ruyi` into official repositories of major Linux distributions.

### 5. RuyiSDK VS Code Extension Downloads

**Definition**: cumulative downloads of the RuyiSDK VS Code extension. Current statistics only reflect distribution through ISCAS mirrors and GitHub Releases.

**Included channels**:
- ISCAS mirrors: offline VSIX files.
- GitHub Releases.

> 📌 **Statistics do not include Open VSX or Visual Studio Marketplace.** To view data from those marketplaces, please visit the corresponding marketplace pages.

### 6. RuyiSDK Eclipse Component Downloads

**Definition**: cumulative downloads of RuyiSDK Eclipse IDE packages and plugins. Current statistics only reflect distribution through ISCAS mirrors and GitHub Releases.

**Included content**:
- Pre-integrated Eclipse IDE for RuyiSDK, including RISC-V development plugins.
- Standalone plugins that can be installed into an existing Eclipse installation.

**Included channels**:
- ISCAS mirrors: complete IDE packages and plugin packages under `ruyisdk/ide/`.
- GitHub Releases.

> 📌 **Statistics do not include Eclipse Marketplace.** Eclipse Marketplace data is not included in this metric. Please visit the official marketplace page if needed.

---

## RuyiSDK Distribution Channels and Links

- [ISCAS mirrors (official RuyiSDK software source)](https://fast-mirror.isrc.ac.cn/ruyisdk/): the primary distribution point hosted by ISCAS.

### RuyiSDK Package Manager Distribution Channels

- [PyPI](https://pypi.org/project/ruyi/): install with `pip install ruyi`.
- [GitHub Releases](https://github.com/ruyisdk/ruyi/releases/): binary packages compatible with multiple architectures and Linux distributions.
- [ISCAS mirrors (ruyi directory)](https://mirror.iscas.ac.cn/ruyisdk/ruyi/): binary packages compatible with multiple architectures and Linux distributions.
- Linux distribution repositories (in progress): work is ongoing to introduce `ruyi` into major Linux distribution repositories so it can be installed with commands such as `apt install ruyi` or `dnf install ruyi`.

### RuyiSDK VS Code Extension Distribution Channels

- [Open VSX](https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension): for VSCodium.
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage/publishers/RuyiSDK): for VS Code.
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-vscode-extension/releases/): manual VSIX download and installation.
- [ISCAS mirrors](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/): manual VSIX download and installation.

### RuyiSDK Eclipse Plugins Distribution Channels

- [Eclipse Marketplace](https://marketplace.eclipse.org/content/ruyisdk#metrics): plugin index.
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/): manual ZIP download and installation.
- [ISCAS mirrors](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/): manual ZIP download and installation.

> **About Eclipse Marketplace statistics**
> - Eclipse Marketplace only provides a plugin index and does not host plugin files. When users update installed plugins inside Eclipse, they bypass the marketplace, so accurate download counting is not possible.
> - The marketplace website interface may have issues. Accurate install counts must be checked manually inside the Eclipse IDE marketplace page, and installs performed through updates may not change the `installed` count.

---

*Maintained by the RuyiSDK team. This document is updated irregularly as statistics definitions evolve. Last updated: May 9, 2026.*
