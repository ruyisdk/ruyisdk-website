---
authors: [jing, arch]
---

# 第 014 期·2024 年 01 月 16 日

## 卷首语

RuyiSDK V0.3 版本今日发布，这是 RuyiSDK 项目切换为开发迭代模式后的第一次发版，为了更好的让用户了解版本功能的演进，包管理器提供了软件源新闻消息的功能。此外新增了主流的 3 款 RISC-V 开发板的 可用镜像信息维护与下载、开发板系统安装引导程序，方便 RISC-V 开发者获取指定开发板可用的 OS 并可方便的安装 OS 的安装。欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.4 版本将在 1 月 30 日发布。

## 包管理器

项目地址：https://github.com/ruyisdk/ruyi

RuyiSDK 包管理器 `ruyi` 的 0.3.0 版本已于今日发布，您可移步 [GitHub Releases][GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

本次的更新内容主要有：

- 增加了软件源新闻消息功能。`ruyi update` 后，如有未读的新闻消息，会输出提示信息。
  您可用新增的 `ruyi news list` 与 `ruyi news read` 命令阅读这些消息文章。
- [Issue 32](https://github.com/ruyisdk/ruyi/issues/32)：为 Milk-V Duo、Milk-V Pioneer、Sipeed LicheePi 4A 增加了多种系统镜像，详见 RuyiSDK 官方源的新闻。
  由于这些镜像文件并非都直接由 RuyiSDK 团队打包，当您安装它们时，包管理器将从相应的源站下载：`ruyi` 的版本需要是 0.3.0 或更高。
- 增加了开发板安装器功能：`ruyi device provision`。这是个一步步指导您为手头的 RISC-V 开发板烧写系统镜像、引导器等初始数据的向导。
  初期支持的硬件范围同样是上述 3 种板卡的所有已知不同版本。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

IDE 加强了基于 Eclipse 和 Vscode 的插件调研，本期跑通了 Rust 在 Eclipse 和 Vscode 的交叉编译。

## GCC

根据上游的意见，重新提交了 Zc\*与 Intrinsic 支持的 patch，继续移植 RUYISDK GCC11/12 版本

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.3.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.3.0/
