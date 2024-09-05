---
authors: [jing, arch]
---

# 第 028 期·2024 年 09 月 03 日

## 卷首语
RuyiSDK V0.17 版本已于今日发布。RuyiSDK 包管理器修复了一些已知的缺陷，RuyiSDK 软件源更新了 Box64 和 WPS Office；RuyiSDK 官网也新增 algolia search，现在可以搜索网站上的任何内容了。

此外，RuyiSDK 在第四届 RISC-V 中国峰会（RISC-V Summit China 2024）上，进行了包括 RuyiSDK 介绍、Ruyi 包管理器的自动化测试、RISC-V 操作系统支持矩阵 等报告；RuyiSDK 还亮相 elexcon 2024深圳国际电子展，展示了近期的工作成果。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.18 版本将在 9 月 14 日发布。

## 包管理器

RuyiSDK 0.17 对应的包管理器版本也为 0.17.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.17.0-gh] 或 [ISCAS 镜像源][ruyi-0.17.0-iscas]下载体验。

[ruyi-0.17.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.17.0
[ruyi-0.17.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.17.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 修复了 [issue #181]: 现在在宽度较短的终端窗口中使用 `ruyi news read`
  等功能时，Markdown 代码块中的长行不会缺字了，行首、行尾也不再存在影响复制粘贴的空格。代价是覆盖整行宽度的漂亮的背景色无法实现了。

[issue #181]: https://github.com/ruyisdk/ruyi/issues/181

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 更新了 Box64 到上游最新开发版本。
* 更新了 WPS Office 到上游最新版本。请注意：上游移除了 AArch64 架构的原生支持。这部分用户也将需要依赖二进制翻译方案来运行 WPS Office 了。
* 明确了软件源内容的开源许可证：Apache 2.0 许可证，与 Ruyi 包管理器本体一致。

此外，我们已经着手设计、实现 `ruyi` 包管理器分发渠道与 RuyiSDK 软件源的服务端组件。未来，这将使得
RuyiSDK 能够更加频繁地、自动化地更新软件源中的包；也能在取得用户明确授权的前提下，使
RuyiSDK 用户与测试人员能够向 RuyiSDK 团队反馈一定的使用信息，有助于未来的设计与维护工作。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

本期暂无进展。

## GCC

- 支持了Zimop扩展
- 修复了部分回归测试中发现的错误

## LLVM

- 支持了对 tuple type 的 vget/vset/vcreate 操作。
- 修复在指定 XTHeadVector 拓展时，编译器未定义 `__riscv_vector` 的问题，现在编译器行为与 GCC 一致。

## V8

1. 提交patch，使V8 for Android RISCV64在 NDK r27 版本获得标准构建支持（无需在手工配置NDK toolchain）。
2. 继续实现TurboShaft SIMD IR 到RVV的指令选择。
3. 移植central stack switches特性。

## 官网

截止今日9月3日，RuyiSDK 网站访问人数986人，新增152人，访问页面7622次，新增2755次。RuyiSDK 微信交流群132人，新增49人（进群请加微信小助手 ruyisdk_helper）。

官网新增 algolia search，现在可以搜索网站上的任何内容啦！

[RuyiSDK 亮相 elexcon 2024深圳国际电子展](https://mp.weixin.qq.com/s/Rr04my4SxRPfTT7-wvKriw)

## 操作系统支持矩阵

- 修正了部分 typo 和 i18n / 英文翻译。
- lintestor 应用软件可用性测试项目继续更新中
  - 重写了测试调度相关的代码
  - 添加了全局前置环境配置
  - 改进了测试结果报告
  - 新增了更多软件包的测试用例
