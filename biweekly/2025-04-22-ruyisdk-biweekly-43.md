---
authors: [jing, white, fox]
---
# 第 043 期·2025 年 04 月 22 日

## 卷首语
近两周进展已呈上，欢迎阅读《RuyiSDK 双周进展汇报》第 43 期。如果您在 RuyiSDK 的使用中遇到问题，欢迎参加每双周四下午 15:00 开展的 [“RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务（下一次在4月25日），也可以在[ RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈。

受五一假期影响，下个开发版本将顺延至5月13日发布，我们将持续带来更多创新改进。

## 包管理器

RuyiSDK 0.32 对应的包管理器版本也为 0.32.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.32.0-gh] 或 [ISCAS 镜像源][ruyi-0.32.0-iscas]下载体验。

[ruyi-0.32.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.32.0
[ruyi-0.32.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.32.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 新增了贡献指南文档，使社区成员更容易参与项目贡献。
* 为流程合规，现在要求所有向 RuyiSDK 发起的拉取请求（Pull Requests）都包含开发者原创声明（Developer's Certificate of Origin, DCO）了。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 完善了设备支持：
    * 新增支持了适用于 SpacemiT K1 设备的特殊刷写策略。
    * 修复了设备安装器调用 `fastboot` 失败的问题。
    * 更新了 Sipeed LicheeRV Nano 的 Buildroot SDK 镜像。
    * 更新了 Sipeed LicheePi 4A 的 RevyOS 镜像版本并修复问题。
    * 更新了 Milk-V Meles 的 RevyOS 镜像。
* 重命名了软件包 `board-image/revyos-sg2042-milkv-pioneer` 为 `board-image/revyos-milkv-pioneer` 以符合当前的软件包命名规范。
* 实体数据库更新：
    * 设备实体定义现已与设备安装器支持范围对齐。补充了 Milk-V、Sipeed、Canaan、StarFive、WCH 等厂商的设备定义。

本次 RuyiSDK 服务端组件的更新主要包含了以下内容：

* 优化了 ruyisdk.org 官网数据统计页面的性能。
* 集成了 GitHub Releases 渠道的下载量到官网数据统计页面的 RuyiSDK 包管理器下载计数中，使统计数据更准确、全面。
* 将原先位于 RuyiSDK 包管理器仓库、需要手工配置生效的镜像源同步脚本迁移到了服务端。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
- 将插件仓库规范化迁移到[ruyisdk-eclipse-plugins](https://github.com/ruyisdk/ruyisdk-eclipse-plugins) ，并对代码进行了重构和优化：
   - 重构插件组织，基础类调整到 org.ruyisdk.core 包下，作为其它插件的依赖项；实现XDG规范目录的设置和路径获取；
   - 重构和优化设备管理，调整配置文件到 ~/.config/ruyisdkide 下，并将UI从继承 viewpart 实现修改为 PreferencePage，实现了通过 Windows > preferences > Device Manage 进行管理，更加符合使用场景。
- 新增 ruyi 包管理器安装检测、版本检测等基础类；

## GCC
- 添加了zama16b，sdtrig，zvfbfmin 扩展的支持，重新提交了ssnpm 的 patch。

## LLVM
- upstream：[Add smcntrpmf extension](https://github.com/llvm/llvm-project/pull/136556)

## V8
- 处理 scriptcontext 里面 let 涉及的常量和变量，避免重复堆分配和垃圾回收开销。
- 修复了构建错误和段错误 bug。
- 优化 RiscvCmpDouble 和 RiscvCmpSingle 的 codegen。

## 操作系统支持矩阵

- ruyisdk/support-matrix
  - [LicheePi4A: add openEuler 25.03](https://github.com/ruyisdk/support-matrix/pull/237)
  - [Sync reports and address recent issues](https://github.com/ruyisdk/support-matrix/pull/238)
  - [LicheePi4A/RevyOS: Bump to 20250323](https://github.com/ruyisdk/support-matrix/pull/239)
  - [Bit-Birck K1: update to biandu 2.1.1,add alpine](https://github.com/ruyisdk/support-matrix/pull/240)
  - [fix typo](https://github.com/ruyisdk/support-matrix/pull/241)
  - [duo256/licheervnano: Update Debian/Fedora](https://github.com/ruyisdk/support-matrix/pull/242)
  - [BPI-F3: Bianbu Update to v2.1.1](https://github.com/ruyisdk/support-matrix/pull/243)
  - [CONTRIBUTING: change/add some definitions in metadata](https://github.com/ruyisdk/support-matrix/pull/245)
  - [Pioneer/openEuler: bump to 25.03](https://github.com/ruyisdk/support-matrix/pull/246)
  - [LicheePi4A_8+32G: Add RevyOS Test Report](https://github.com/ruyisdk/support-matrix/pull/247)
  - [LicheePi4A_8+32G: Add RevyOS Test Report](https://github.com/ruyisdk/support-matrix/pull/247)
  - [LicheePi4A_8+32GB: Add OpenEuler Innovation Test Report](https://github.com/ruyisdk/support-matrix/pull/248)
  - [fix typo](https://github.com/ruyisdk/support-matrix/pull/249)
  - [VisionFive2: Add Guix System test reports.](https://github.com/ruyisdk/support-matrix/pull/250)
  - [Add ram information for the boards](https://github.com/ruyisdk/support-matrix/pull/251)
  - [Megrez: Add Guix System test reports.](https://github.com/ruyisdk/support-matrix/pull/252)
  - [Add a new board HiFive Premier P550 and it's Ubuntu, Yocto and Debian test reports (CFT).](https://github.com/ruyisdk/support-matrix/pull/253)
  - [Unmatched: update Debian to trixie/sid](https://github.com/ruyisdk/support-matrix/pull/254)
  - [Unmatched: update Ubuntu/OpenWrt/FreeBSD/OpenBSD](https://github.com/ruyisdk/support-matrix/pull/255)
  - [oERV: add notes](https://github.com/ruyisdk/support-matrix/pull/256)
  - [visionfive2: Add Guix](https://github.com/ruyisdk/support-matrix/pull/258)
  - [meles: update revyos 20250323](https://github.com/ruyisdk/support-matrix/pull/259)
  - [Add Guix and Ubuntu test reports for Mars. Add Guix to metadata.](https://github.com/ruyisdk/support-matrix/pull/260)
  - [HiFive Premier P550: fix date and board matadata](https://github.com/ruyisdk/support-matrix/pull/261)
  - [Unmatched: fix frontmatter](https://github.com/ruyisdk/support-matrix/pull/262)
  - [Unmatched: update Armbian](https://github.com/ruyisdk/support-matrix/pull/263)
  - [Enforce and document DCO compliance](https://github.com/ruyisdk/support-matrix/pull/264)
  - [Fix RAM information for some boards](https://github.com/ruyisdk/support-matrix/pull/265)
  - [duos: Add/Update Debian/BuildRoot/NixOS](https://github.com/ruyisdk/support-matrix/pull/266)
  - [Add xv6](https://github.com/ruyisdk/support-matrix/pull/268)
  - [LicheeConsole4A/RevyOS: Bump to 20240720](https://github.com/ruyisdk/support-matrix/pull/269)
  - [Pioneer/openCloudOS: Add openCloudOs Stream 23](https://github.com/ruyisdk/support-matrix/pull/270)
  - [Tool: Add metadata checker ](https://github.com/ruyisdk/support-matrix/pull/271)
  - [NeZha-D1s/Ubuntu: Bump to Ubuntu 25.04 LTS](https://github.com/ruyisdk/support-matrix/pull/272)
  - [PIC64GX/Ubuntu: Bump to Ubuntu 25.04](https://github.com/ruyisdk/support-matrix/pull/273)
  - [Icicle/Ubuntu: Bump to Ubuntu 25.04](https://github.com/ruyisdk/support-matrix/pull/274)
  - [Star64/Ubuntu: Add Ubuntu 25.04](https://github.com/ruyisdk/support-matrix/pull/275)
  - [Add NixOS test reports for Mars.](https://github.com/ruyisdk/support-matrix/pull/276)
  - [LicheePi4A(8+32): Add test report for Armbian ](https://github.com/ruyisdk/support-matrix/pull/278)
- support-matrix-frontend
  - 新增：Tab 栏
    - 相关 bug 修复
  - 测试报告页翻译修正
  - Frontmatter 解析代码优化
  - Submodules 自动同步 CI 部署
  - Link: https://martrix.ruyisdk.org
  - Repo: https://github.com/QA-Team-lo/support-matrix-frontend

## 官网

+ 优化了 RuyiSDK [数据总览](https://ruyisdk.org/Home/StatisticalDataPages/)

