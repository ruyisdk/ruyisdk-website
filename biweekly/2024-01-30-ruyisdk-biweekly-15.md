---
authors: [jing, arch]
---

# 第 015 期·2024 年 01 月 30 日

## 卷首语

RuyiSDK V0.4 版本今日正式发布。此版本添加了对 Allwinner Nezha D1、Sipeed Lichee RV、StarFive VisionFive、StarFive VisionFive2 四款 RISC-V 开发板的支持，包括镜像信息的维护与下载、开发板系统的安装引导，为 RISC-V 开发者提供了更加便捷的 OS 获取及安装体验。此外 RuyiSDK 软件源新增提供了 riscv64 平台的 DynamoRIO 二进制软件包的下载和安装。

随着春节的临近，我们即将迈入 2024 年。在此，我们先向大家送上春节的祝福，祝大家新春愉快，万事如意！
另外，需要通知各位的是，RuyiSDK V0.5 版本的发布将稍作延迟，调整为 2 月 27 日。感谢大家的理解与支持，我们将会带来更多精彩的内容。再次祝大家春节快乐！

## 包管理器

RuyiSDK 0.4 对应的包管理器版本也为 0.4.0，已于今日发布。您可移步
[GitHub Releases][GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.4.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.4.0/

本次更新主要包含了以下内容：

- `ruyi device provision` 会将 `fastboot` 的调用以 `sudo` 包装了。
- `ruyi self uninstall --purge` 不会忘记删除 `~/.local/state/ruyi` 目录了。
- 从软件源下载文件失败时，会提供一些有助于用户自助排查问题的提示讯息了。
- 为提供更稳定的服务，RuyiSDK 软件源仓库现已搬迁至 GitHub。
  视您所在地区或组织所可能设置的网络访问限制，您可能需要采取一些措施，
  以便能继续与 RuyiSDK 软件源同步。
- 在 RuyiSDK 软件源中，新增提供了上述四款 RISC-V 开发板的系统镜像包、运行于
  amd64 架构的 RISC-V QEMU 系统模拟器二进制包，以及运行于 riscv64 架构的
  DynamoRIO 二进制包。

请注意：原先位置的 RuyiSDK 软件源仓库将在 2024-02-01 前后停止更新。请尽早更新您的
`ruyi` 版本以自动迁移到最新配置。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

IDE 部分主要开展了 Eclipse 和 VSCode 对 C、Rust、Golang 进行了 RISC-V 架构上编译和调试现有插件的调研，目前整体来说 C、Rust 和 Golang 在 RISC-V 架构下的交叉编译可走通，但是调试插件还或多或少存在一些问题，缺乏成熟插件甚至无可用调试插件支持。

## GCC

上游已经接受了 Bitmanip/Scalar Crypto intrinsic 的支持，对 Zcmp/Zcmt 的 patch 提出了新的修改意见，目前正在修改中。 持续推进 RUYISDK GCC 的多版本支持工作，预计下个月提交发布版本进行打包测试。

## OpenJDK

OpenJDK RV64 继续持续负责 OpenJDK RISC-V 相关代码的日常开发、测试、代码检视和架构看护。

1. 两个 OpenJDK LTS (OpenJDK 17.0.10 / OpenJDK 21.0.2) 版本完成 release 发版。
2. 期间向社区提交/检视多个优化的 patch, 并排查解决两起社区使用 OpenJDK 相关的问题。

## V8

完成 V8 on Android RISC-V 的英文文档，并向 RISE 汇报了此项任务的完成（https://github.com/riscv-collab/v8/wiki/How-to-Run-v8-on-Android-RISCV）。
