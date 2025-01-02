---
authors: [jing]
---
# 第 032 期·2024 年 11 月 05 日

## 卷首语
RuyiSDK包管理器 V0.21 版本已于今日发布。包管理器近期主要修复了一些测试出的缺陷，并增加兼容性支持和一些小功能的实现，进一步完善了包管理器工具；

Milkv Duo SDK建设计划已经完成第一阶段的验证和缺陷整理，后续可以有针对性的进行SDK的优化了。

《从零开始开发VSCode插件与Ruyi IDE插件》 第3课已经上线B站。Eclipse 插件开发当前成功的搭建并解决了依赖项的问题，eclipse-embed-cdt/eclipse-plugins下的所有插件已经可以在Eclipse IDE中以插件工程方式成功运行和调试，后续可以基于现有的嵌入式插件学习并开展相关开发工作了。

操作系统支持矩阵本期有大量更新，包括了测试报告元数据、首页表格 CI、issue 模板、测试报告更新等。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.22 版本将在 11 月 19 日发布。

## 包管理器

RuyiSDK 0.21 对应的包管理器版本也为 0.21.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.21.0-gh] 或 [ISCAS 镜像源][ruyi-0.21.0-iscas]下载体验。

[ruyi-0.21.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.21.0
[ruyi-0.21.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.21.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 将 RuyiSDK 软件源打包辅助命令 `ruyi admin manifest` 重命名为 `ruyi admin checksum` 了。如果您在为
  RuyiSDK 打包，您可能需要更新您的脚本。
* `ruyi self clean` 支持删除新闻（`ruyi news`）的阅读状态了：`ruyi self clean --news-read-status`。
* `ruyi self clean` 也支持一次性删除 `ruyi` 产生的所有可变状态文件了：`ruyi self clean --all`。
* 修复了 `ruyi` 测试用例与 Python 3.11 的兼容性。我们现在以 CI 形式确保 `ruyi`
  能够在 Python 3.11、3.12、3.13 这三个版本通过测试，这将有助于保障后续 `ruyi`
  在多种 Linux 发行版上的兼容性。
* 新增声明了遗漏的 `typing_extensions` 依赖，以修复第三方打包。
* 重构了 `ruyi` 子命令的声明与实现方式，后续扩展 `ruyi` 命令行功能更加方便了。

注意：我们可能在今后的一到两个版本期间，实装 RuyiSDK 遥测机制。届时，您可自行决定是否主动上传这部分匿名统计信息，以便
RuyiSDK 团队改进产品；您也可以选择删除先前的遥测数据，以及是否禁用遥测。您可用
`ruyi self clean --telemetry` 删除所有的遥测信息，包括设备信息。详情请见 RuyiSDK 0.19
的发布说明：[《RuyiSDK 双周进展汇报 第 030 期·2024年09月30日》][ruyisdk-biweekly-30]。

[ruyisdk-biweekly-30]: ./20240930-ruyisdk-biweekly-30.md

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
从零开始开发VSCode插件与Ruyi IDE插件 第3课已经上线B站。视频可以在[此](https://www.bilibili.com/video/BV1dxSXYzE6L/?share_source=copy_web&vd_source=ec7b3fbeca3203e5c990a2be1cbdeb2e)观看。欢迎点赞关注一键三连！

Eclipse 插件开发当前成功的搭建并解决了依赖项的问题，[eclipse-embed-cdt/eclipse-plugins]([https://github.com/eclipse-embed-cdt/eclipse-plugins](https://github.com/eclipse-embed-cdt/eclipse-plugins/tree/master/plugins)下的所有插件已经可以在Eclipse IDE中以插件工程方式成功运行和调试，后续可以开展相关开发工作了。


## GCC
继续推进P扩展在binutils上的草案支持，尝试更新新32位在glibc上的支持工作

## LLVM
本期暂无ruyisdk相关更新。

## V8
1. 修复和完善TurboShaft IR、Maglev JIT 的RISC-V架构相关部分。
2. 继续移植LeapTiering特性。
3. 实现wasm JSPI特性。

## 官网
RuyiSDK官网博客板块中新增文章：[Eclipse 上游初步支持 RISC-V，每日构建镜像已经可以下载试用](https://ruyisdk.org/blog/2024/09/30/eclipse-riscv64) 。

## 操作系统支持矩阵

本期支持矩阵有大量更新，包括：测试报告元数据、首页表格 CI、issue 模板、测试报告更新等等。

- CI Table gen [PR #49](https://github.com/ruyisdk/support-matrix/pull/49)
- VisionFive2/Ubuntu Ubuntu 24.10 & Ubuntu 24.04.1 LTS [PR #50](https://github.com/ruyisdk/support-matrix/pull/50)
- VisionFive2/Openkylin Openkylin 2.0，VisionFive2/Alpine [PR #51](https://github.com/ruyisdk/support-matrix/pull/51)
- PIC64GX/Ubuntu Ubuntu 24.10 [PR #52](https://github.com/ruyisdk/support-matrix/pull/52)
- CI Push Error fix [PR #53](https://github.com/ruyisdk/support-matrix/pull/53)
- BPI-F3 Bianbu v2.0：[PR #54](https://github.com/ruyisdk/support-matrix/pull/54)
- NeZha-D1s/Ubuntu: update test report for Ubuntu 24.10 and Ubuntu 24.04.1 LTS [PR #55](https://github.com/ruyisdk/support-matrix/pull/55)
- Metadata: Refactor and add sys variant [PR #56](https://github.com/ruyisdk/support-matrix/pull/56)
- VisionFive/Alpine: add test report, VisionFive2/Alpine: fix typo [PR #57](https://github.com/ruyisdk/support-matrix/pull/57)
- Icicle/Ubuntu: update test report for Ubuntu 24.10 and Ubuntu 24.04.1 LTS：[PR #58](https://github.com/ruyisdk/support-matrix/pull/58)
- Mars/Ubuntu: update test report for Ubuntu 24.10 and Ubuntu 24.04.1 LTS：[PR #59](https://github.com/ruyisdk/support-matrix/pull/59)
- Unmatched/Ubuntu: update test report for Ubuntu 24.10 and Ubuntu 24.04.1 LTS：[PR #60](https://github.com/ruyisdk/support-matrix/pull/60)
- D1_LicheeRV/Ubuntu: update test report for Ubuntu 24.10 and Ubuntu 24.04.1 LTS：[PR #61](https://github.com/ruyisdk/support-matrix/pull/61)
- LPi4a: Update RevyOS to 20240720：[PR #62](https://github.com/ruyisdk/support-matrix/pull/62)
- LPi4a/openKylin: Update to 2.0：[PR #63](https://github.com/ruyisdk/support-matrix/pull/63)
- CI: Modify table to pages：[PR #64](https://github.com/ruyisdk/support-matrix/pull/64)
- README: Remove all svgs and use pages from ci：[PR #65](https://github.com/ruyisdk/support-matrix/pull/65)
- VisionFive2/Archlinux: update archlinux to cwt23：[PR #66](https://github.com/ruyisdk/support-matrix/pull/66)
- VisionFive2/DietPi: add test report：[PR #67](https://github.com/ruyisdk/support-matrix/pull/67)
- VisionFive2/openSUSE: update openSUSE test report：[PR #68](https://github.com/ruyisdk/support-matrix/pull/68)
- PIC64GX/Ubuntu: fix typo：[PR #69](https://github.com/ruyisdk/support-matrix/pull/69)
- duo: Add uniproton basic support：[PR #70](https://github.com/ruyisdk/support-matrix/pull/70)
- README: Add desc for tools：[PR #71](https://github.com/ruyisdk/support-matrix/pull/71)
- CI: Tables gen CI redesign：[PR #72](https://github.com/ruyisdk/support-matrix/pull/72)
- Template: Add new templates：[PR #74](https://github.com/ruyisdk/support-matrix/pull/74)
- CI: Add debug mode and pr target：[PR #76](https://github.com/ruyisdk/support-matrix/pull/76)
- Metadata: fix and tweaks：[PR #89](https://github.com/ruyisdk/support-matrix/pull/89)
- BPI-F3: Added Fedora test report：[PR #90](https://github.com/ruyisdk/support-matrix/pull/90)
- duo256m/openeuler: Add openEuler support for duo256：[PR #91](https://github.com/ruyisdk/support-matrix/pull/91)
- BPI-F3: Added OpenWrt test report：[PR #93](https://github.com/ruyisdk/support-matrix/pull/93)
- Metadata: sync metadata and test report：[PR #94](https://github.com/ruyisdk/support-matrix/pull/94)
- LPi4a/deepin: Update to 20240815 [PR #95](https://github.com/ruyisdk/support-matrix/pull/95)
- Metadata: Add multi-language support [PR #96](https://github.com/ruyisdk/support-matrix/pull/96)
- Duo/BuildRoot: Update to v1.1.3 [PR #98](https://github.com/ruyisdk/support-matrix/pull/98)



## SDK
完成 Milkv Duo 官方SDK 的验证及缺陷总结，为后续SDK优化做准备。
- [Milkv Duo/Duo256/DuoS C/C++ 应用编程和调试](https://gitee.com/yunxiangluo/milkv-duo/blob/master/README.md)
- [Milkv Duo/Duo 256M/DuoS 缺陷](https://gitee.com/yunxiangluo/milkv-duo/blob/master/todo.md)
