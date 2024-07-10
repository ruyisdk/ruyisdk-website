---
authors: [jing, arch]
---

# 第 012 期·2023 年 12 月 19 日

## 卷首语

RuyiSDK V0.2 版本发布，为大家提供了一个基础的以编译工具链和模拟器运行环境为主的包管理器，并在 12 月 15 日举办的 PLCT Lab OpenDay 2023 线上会议上分享了 RuyiSDK V0.2 的建设成果和未来计划，希望这个版本能够给大家带来不一样的编译环境搭建体验，从[文档](https://ruyisdk.github.io/docs/)开始，欢迎大家关注和试用。

## 包管理器

项目地址：https://github.com/ruyisdk/ruyi

Ruyi 0.2 在上周五成功发布了，可移步 [GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。发布前做了以下的修复与功能改进：

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.2.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.2.0/

- [Issue #12](https://github.com/ruyisdk/ruyi/issues/12) 的进一步用户体验优化：在需要用到某个命令如 `tar` 或 `zstd` 而当前环境内却未提供的时候，提前报错退出，而不仅仅只是警告然后在实际调用时向用户展示满屏的 Python backtrace。
- [Issue #24](https://github.com/ruyisdk/ruyi/issues/24)：GNU 工具链包中的 GDB 先前非预期地动态链接到了构建环境中的 Python 3.8，导致这些 `gdb` 二进制在 Python 版本不是 3.8.x 的系统上无法工作。考虑到 Python 版本的多样性，以及目前 Ruyi 所计划支持的宿主发行版均已提供 `gdb` 包，目前暂时先禁用了软件源中三种 GNU 工具链包的 GDB Python 支持。后续将调研以静态链接的方式恢复支持。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期暂无进展。

## GCC

Bitmanip/Scalar Crypto 的 intrinsic patch 收到了 review 意见，开发过程中发现了 gcc upstream 的模板错误，已反馈社区进行了修复。RISC-V Profiles 根据 review 意见重新提交了 patch，目前收到新的反馈意见，等待修改后重新发送。修复了 OpenHW 社区发现的 Zca .option 段冲突问题，目前已被 OpenHW 社区合并。Gprofng/libmvec RISC-V 后端 porting 工作持续推进中。
