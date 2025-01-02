---
authors: [jing, arch]
---

# 第 027 期·2024 年 08 月 13 日

## 卷首语

RuyiSDK V0.16 版本已于今日发布。包管理器**完成了设备安装器（`ruyi device provision`）的插件化改造**，后续升级程序将更加方便。此外，**RuyiSDK 完善了Canaan Kendryte K230D 开发板的支持**，对 K230D SDK 源码进行了更新和完善，同时建立了SDK自动构建CI，并联合玄铁团队和嘉楠科技进行了标题为“[嘉楠勘智 K230D: 首款基于新 32 位 RuyiSDK 的 AIoT 量产芯片](https://ruyisdk.org/blog/2024/07/30/k230d/)”的宣发，展示了基于 K230D RuyiSDK 源码的性能对比结果和其它合作成果。

操作系统支持矩阵持续更新中，同时开始启动操作系统中语言运行时环境、语言虚拟机等运行支持软件在不同Linux发行版中的支持情况（应用软件支持矩阵），如系统包管理器是否提供安装，以及软件版本信息。目前已经完成了 Debian 的部分测试用例。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.17 版本将在 9 月 3 日发布。此外RuyiSDK报名了2024年8月27日-29日在深圳会展中心举办的[深圳国际电子展](https://www.elexcon.com/)，欢迎关注。

## 包管理器

RuyiSDK 0.16 对应的包管理器版本也为 0.16.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.16.0-gh] 或 [ISCAS 镜像源][ruyi-0.16.0-iscas]下载体验。

[ruyi-0.16.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.16.0
[ruyi-0.16.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.16.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 完成了设备安装器（`ruyi device provision`）的插件化改造。今后对不常见刷写步骤的支持将更加方便了：不一定需要更新
  `ruyi` 本体了。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

本期暂无进展。

## GCC

RUYISDK-GNU-Toolchain发布了基于GCC14.2与Binutils2.43的linux工具链，修复了回归测试中发现的一些问题。

## LLVM

本期暂无进展。

## V8

审核新一代基线编译器maglev的riscv支持框架。

## 官网

截止今日 8 月 13 日，订阅人数一共 40 人（增加 2 人）。RuyiSDK 网站访问人数 834 人（增加 266 人），访问页面 4907 次（增加 2197 次）。RuyiSDK 微信交流群 83 人。

嘉楠勘智 K230D: 首款基于新 32 位 RuyiSDK 的 AIoT 量产芯片，详情阅读官网博客 https://ruyisdk.org/blog/2024/07/30/k230d/

## 操作系统支持矩阵

本期更新：

- Milk-V Duo S / [NuttX RTOS](https://github.com/ruyisdk/support-matrix/commit/015002b786fbd5117f5e2e9a432d0ca10df4ebe3): 同步最新主线版本
- Milk-V Pioneer : 新增 [Deepin RISC-V](https://github.com/ruyisdk/support-matrix/commit/6a7f56534ae10685846793fcb6ce19b6a5f37cff)
- StarFive VisionFive 2: [重测](https://github.com/linuxdeepin/developer-center/issues/9882)了 Deepin RISC-V CI build，已确认可用
- 主表格：同步 Deepin 测试结果

自动化测试/应用软件支持矩阵准备：[lintestor](https://github.com/255doesnotexist/lintestor)

- 目前已完成了 Debian 的部分测试用例，结果见[此处](https://github.com/255doesnotexist/lintestor/blob/main/summary.md)
