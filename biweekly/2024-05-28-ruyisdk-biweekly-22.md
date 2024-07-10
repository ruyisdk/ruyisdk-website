---
authors: [jing, arch]
---

# 第 022 期·2024 年 05 月 28 日

## 卷首语

RuyiSDK V0.11 版本已于今日发布。 **RuyiSDK 社区首次线下 Meetup 成功举办**。RuyiSDK 包管理器本期重点修复并完善了一些缺陷，同时 RuyiSDK 软件源**增加支持了 Pine64 Star64 开发板**，此外正在设计第三方系统镜像在如意软件源的二次分发管理（很多系统镜像存放在网盘、Google Drive、MEGA 等平台上，不便于下载）、以及根据源码自构建出的系统镜像的管理（一些开发板未提供二进制，仅提供源码，需要用户自己编译构建系统镜像），后续将为用户提供更方便的镜像服务。

支持矩阵参考 [RISC-V Open Hours ](https://docs.google.com/presentation/d/1wyRJXCn4V3ytT6cIr0VyP6RP_pIPu1yLh5S-mjgLBmY/edit#slide=id.g24406ee815a_0_8)中汇总的 RISC-V 开发板，针对国外主流开发板进行了补充，此外增补了全志处理器的一些开发板的调研，目前支持矩阵已经覆盖了 milkv、矽速、嘉楠、赛昉、沁恒微电子、全志、芯来 这 7 家企业几乎全部 RISC-V 开发板（已知的）、5 款较为流行的国外 RISC-V 开发板，已提交调研和测试结果的开发板数量已有 49 款；RuyiSDK 计划集成所有流行的 RISC-V 开发板，欢迎大家继续补充遗漏的开发板型号。

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.12 版本将在 6 月 11 日发布。

## 包管理器

RuyiSDK 0.11 对应的包管理器版本也为 0.11.0，已于今日发布。您可移步
[GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.11.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.11.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 去除了先前唯一的 LGPL 依赖。现在 RuyiSDK 包管理器及其所有依赖都采用宽松开源许可证了，方便下游用户在商业场景取用。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

- Ruyi 设备安装器现已新增支持以下设备型号：
  - Pine64 Star64

我们注意到越来越多的设备型号，甚至如最新面世的 BananaPi BPI-F3 等等，其系统镜像仅以网盘（百度网盘、Google Drive、MEGA 等服务）方式分发。对这些设备型号的妥善支持面临挑战；在接下来的版本迭代中，我们将尝试支持此场景，敬请期待或参与进来。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

基于 VSCode IDE，以及包管理器提供的数据接口，初步在 VSCode 中实现了 news、如意软件源工具链、demo 等资源的获取，初步可以展示 news（软件更新新闻），软件源工具链资源的选择和安装、基于虚拟环境的 demo 的编译等初步模块化功能。

## GCC

更新了 RV64ILP32 的支持，，包括 Binutils,QEMU,说明文档等，发布了新的 release 工具版本。

## LLVM

- 继续完善 LLVM intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 14.7. Vector Floating-Point Square-Root Operations
  - 14.10. Vector Floating-Point MIN/MAX Operations
  - 14.11. Vector Floating-Point Sign-Injection Operations
  - 14.12. Vector Floating-Point Compare Operations
  - 14.13. Vector Floating-Point Classify Operations
  - 14.14. Vector Floating-Point Merge Operations
  - 14.15. Vector Floating-Point Move Operations
  - 14.16. Single-Width Floating-Point/Integer Type-Convert Operations
  - 14.17. Widening Floating-Point/Integer Type-Convert Operations
  - 14.18. Narrowing Floating-Point/Integer Type-Convert Operations
- 完善测试流程和测试数据
  - 增加了 [rvv-intrinsic-doc](https://github.com/riscv-non-isa/rvv-intrinsic-doc) 仓库中位于 `examples/` 目录下的测试用例
  - 在 GitHub Actions 中使用 qemu 6.2 对编译器输出的程序进行模拟运行测试
  - 重新整理 clang 部分对 RVV intrinsic 的测试用例，使其符合用例规范

## OpenJDK

1. Proposed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/18716 (8329258: TailCall should not use frame pointer register for jump target)
- https://github.com/openjdk/jdk/pull/18999 (8331281: RISC-V: C2: Support vector-scalar and vector-immediate bitwise logic instructions)
- https://github.com/openjdk/jdk22u/pull/174 (8330094: RISC-V: Save and restore FRM in the call stub)
- https://github.com/openjdk/jdk21u-dev/pull/545 (8330094: RISC-V: Save and restore FRM in the call stub)
- https://github.com/openjdk/jdk17u-dev/pull/2442 (8330094: RISC-V: Save and restore FRM in the call stub)

2. Reviewed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/18737 (8330095: RISC-V: Remove obsolete vandn_vi instruction)
- https://github.com/openjdk/jdk/pull/18774 (8330213: RISC-V: C2: assert(false) failed: bad AD file after JDK-8316991)
- https://github.com/openjdk/jdk/pull/18780 (8330242: RISC-V: Simplify and remove CORRECT_COMPILER_ATOMIC_SUPPORT in atomic_linux_riscv.hpp)
- https://github.com/openjdk/jdk/pull/18758 (8330094: RISC-V: Save and restore FRM in the call stub)
- https://github.com/openjdk/jdk/pull/18755 (8330156: RISC-V: Range check auipc + signed 12 imm instruction)
- https://github.com/openjdk/jdk/pull/18785 (8330266: RISC-V: Restore frm to RoundingMode::rne after JNI)
- https://github.com/openjdk/jdk/pull/18875 (8330735: RISC-V: No need to move sp to tmp register in set_last_Java_frame)
- https://github.com/openjdk/jdk/pull/18835 (8321014: RISC-V: C2 VectorLoadShuffle)
- https://github.com/openjdk/jdk/pull/18761 (8330161: RISC-V: Don't use C for Labels jumps)
- https://github.com/openjdk/jdk/pull/18960 (8331150: RISC-V: Fix "bad AD file" bug)
- https://github.com/openjdk/jdk/pull/18477 (8327647: Occasional SIGSEGV in markWord::displaced_mark_helper() for SPECjvm2008 sunflow)

## 官网

[RuyiSDK 首次线下 Meetup 圆满结束，下次见！](https://mp.weixin.qq.com/s/wHCKdaZLcEyn7CspkIoEmQ)

RuyiSDK 网站添加统计功能，增加了德语支持。ruyisdk.cn 域名 ICP 备案完成，技术论坛筹备中。

截止今日 5 月 28 日，订阅人数增加 14 人（由 meetup 引流），一共 32 人。RuyiSDK 网站自 5 月 16 日添加统计功能后，访问人数 177 人，访问页面 408 次。

## 操作系统支持矩阵

本周在支持矩阵中新增了更多开发板和操作系统：

- R128
- BeagleV-Ahead
- BeagleV-Fire
- Star64
- MongoPi MQ Pro
- Duo 256M
- BPi-F3
- DongshanPI-哪吒 STU
- DongshanPI D1s
- D1s NeZha
- Mangopi MQ
- CH573
- Polarfire SoC FPGA Icicle Kit

内容请详见：[ruyisdk/support-matrix](https://github.com/ruyisdk/support-matrix)

至此，操作系统支持矩阵已覆盖了近 50 款开发板，撒花~
