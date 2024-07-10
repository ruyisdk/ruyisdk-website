---
authors: [jing, arch]
---

# 第 021 期·2024 年 05 月 14 日

## 卷首语

RuyiSDK V0.10 版本已于今日发布。 **如意软件源仓库发布了 PLCT 实验室提交的支持 T-Head Vector 的 LLVM 17.0.6 版本**。RISC-V 设备集成与支持方面，**RuyiSDK 完成了对沁恒微电子现有 RISC-V 全产品系列的调研，并在设备系统安装器中添加支持。** 此外，**全志、芯来**RISC-V 处理器的开发板也已经加入集成设备清单，目前相关开发板大部分已经完成调研，接下来也会集成到如意设备安装器中。

为了完善国内注册功能，如意官网在进一步的完善后端服务端和推进 ruyisdk.cn 域名备案。RuyiSDK 推广工作也开始筹备，**RuyiSDK 社区首次线下 Meetup 完成筹备，将于 5 月 18 举办**。

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.11 版本将在 5 月 28 日发布。

## 包管理器

RuyiSDK 0.10 对应的包管理器版本也为 0.10.0，已于今日发布。您可移步
[GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.10.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.10.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 支持了全局选项 `--porcelain` 以方便外部程序与 `ruyi` 交互。初期适配了
  `ruyi list` 与 `ruyi news list` 两种操作。
- `ruyi news` 在某条新闻存在当前系统语言翻译版本时，会优先展示此语言版本了。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

- 新增打包了 PLCT 维护的 LLVM 工具链 `toolchain/llvm-plct`，主要特色是
  `XTHeadVector` 支持。
- 新增支持了大量沁恒微电子（WCH）RISC-V MCU 评估板。Ruyi 设备安装器现已新增支持以下设备型号：
  - WCH CH32V103 评估板
  - WCH CH32V203 评估板
  - WCH CH32V208 评估板
  - WCH CH32V303 评估板
  - WCH CH32V305 评估板
  - WCH CH32V307 评估板
  - WCH CH582F 评估板
  - WCH CH592X 评估板

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期无可见交付进展。

## GCC

更新了 RUYISDK GCC14 分支，目前正在 rebase rv64ilp32/SIMD/Profiles 等特性中。

## LLVM

- 增加针对 T-Head Vector 的优化 Pass

  - 增加了 `RedundantVSETVLIElimination` 优化过程，用于消除冗余的 `vsetvli` 指令

- 继续完善 LLVM intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：

  - 14.1. Vector Single-Width Floating-Point Add/Subtract Operations
  - 14.2. Vector Widening Floating-Point Add/Subtract Operations
  - 14.3. Vector Single-Width Floating-Point Multiply/Divide Operations
  - 14.4. Vector Widening Floating-Point Multiply Operations
  - 14.5. Vector Single-Width Floating-Point Fused Multiply-Add Operations
  - 14.6. Vector Widening Floating-Point Fused Multiply-Add Operations
  - 14.7. Vector Floating-Point Square-Root Operations
  - 14.8. Vector Floating-Point Reciprocal Square-Root Estimate Operations
  - 14.9. Vector Floating-Point Reciprocal Estimate Operations
  - 14.10. Vector Floating-Point MIN/MAX Operations
  - 14.11. Vector Floating-Point Sign-Injection Operations
  - 14.12. Vector Floating-Point Compare Operations
  - 14.13. Vector Floating-Point Classify Operations
  - 14.14. Vector Floating-Point Merge Operations
  - 14.15. Vector Floating-Point Move Operations
  - 14.16. Single-Width Floating-Point/Integer Type-Convert Operations
  - 14.17. Widening Floating-Point/Integer Type-Convert Operations
  - 14.18. Narrowing Floating-Point/Integer Type-Convert Operations
  - 17.2. Integer Scalar Move Operations
  - 17.3. Floating-Point Scalar Move Operations
  - 17.4. Vector Slide Operations
  - 17.5. Vector Register Gather Operations
  - 17.6. Vector Compress Operations

- 继续完善 Clang intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：

  - 14.1. Vector Single-Width Floating-Point Add/Subtract Operations
  - 14.2. Vector Widening Floating-Point Add/Subtract Operations
  - 14.3. Vector Single-Width Floating-Point Multiply/Divide Operations
  - 14.4. Vector Widening Floating-Point Multiply Operations
  - 14.5. Vector Single-Width Floating-Point Fused Multiply-Add Operations
  - 14.6. Vector Widening Floating-Point Fused Multiply-Add Operations
  - 15.1. Vector Single-Width Integer Reduction Operations
  - 15.2. Vector Widening Integer Reduction Operations
  - 15.3. Vector Single-Width Floating-Point Reduction Operations
  - 15.4. Vector Widening Floating-Point Reduction Operations
  - 17.4. Vector Slide Operations
  - 17.5. Vector Register Gather Operations
  - 17.6. Vector Compress Operations

## OpenJDK

1. OpenJDK PRs:

- Initial version: https://github.com/RealFYang/loom/commit/56746e7b9b2e20c999427201479b03f97eac805c (RISC-V vthread support for JVM intrinsic monitors)
- https://github.com/openjdk/jdk/pull/18737 (8330095: RISC-V: Remove obsolete vandn_vi instruction)
- https://github.com/openjdk/jdk/pull/18780 (8330242: RISC-V: Simplify and remove CORRECT_COMPILER_ATOMIC_SUPPORT in atomic_linux_riscv.hpp)
- https://github.com/openjdk/jdk22u/pull/146 (8330242: RISC-V: Simplify and remove CORRECT_COMPILER_ATOMIC_SUPPORT in atomic_linux_riscv.hpp)
- https://github.com/openjdk/jdk21u-dev/pull/507 (8326936: RISC-V: Shenandoah GC crashes due to incorrect atomic memory operations)
- https://github.com/openjdk/jdk17u-dev/pull/2385 (8329823: RISC-V: Need to sync CPU features with related JVM flags)
- https://github.com/openjdk/jdk17u-dev/pull/2417 (8326936: RISC-V: Shenandoah GC crashes due to incorrect atomic memory operations)

2. Reviewed riscv-port-jdk11u backport PRs:

- https://github.com/openjdk/riscv-port-jdk11u/pull/11 (8328065: RISC-V: Add isolation for shared code changes)
- https://github.com/openjdk/riscv-port-jdk11u/pull/12 (8328580: Remove trivial shared code changes which are leftover from riscv port)
- https://github.com/openjdk/riscv-port-jdk11u/pull/13 (8283865: riscv: Break down -XX:+UseRVB into seperate options for each bitmanip extension)
- https://github.com/openjdk/riscv-port-jdk11u/pull/16 (8291893: riscv: remove fence.i used in user space)
- https://github.com/openjdk/riscv-port-jdk11u/pull/17 (8284937: riscv: should not allocate special register for temp)
- https://github.com/openjdk/riscv-port-jdk11u/pull/18 (8285303: riscv: Incorrect register mask in call_native_base)
- https://github.com/openjdk/riscv-port-jdk11u/pull/19 (8297697: RISC-V: Add support for SATP mode detection)

3. CFV: New RISC-V Port Committer: Gui Cao

- https://mail.openjdk.org/pipermail/riscv-port-dev/2024-April/001345.html
- https://mail.openjdk.org/pipermail/riscv-port-dev/2024-April/001367.html

## V8

1. 新增 fastcall 特性的 JavaScript 可重入特性。
2. 修复内置模拟器 RVV 寄存器内容未初始化、指针压缩开启后，32 位模式下指针判零等 bug。

## 官网

[RuyiSDK 社区首次线下 Meetup 来啦，5 月 18 日软件所见！](https://mp.weixin.qq.com/s/NAWuUF4ggmmDvPvKkznkOw)

为了完善国内注册功能，如意官网在进一步的完善后端服务端和推进 ruyisdk.cn 域名备案。

## 操作系统支持矩阵

新增部分全志、芯来开发板的系统支持情况调研；基于现有开发板和相关文档展开测试验证，产出测试报告。

- Milk-V Duo S
  - NuttX
    - 新版本重新测试
  - BuildRoot
  - Debian
- CanMV / Kendryte K230
  - NuttX
  - RT-Thread
- StarFive VisionFive 2
  - NuttX
- Maix-I K210
  - NuttX
- Nuclei DDR200T
  - FreeRTOS
  - RT-Thread
- Longan Nano
  - RT-Thread
- RV Star
  - FreeRTOS
  - RT-Thread
- 100ASK-V853-PRO (Allwinner V853)
  - Melis
- CM32M433R-START
  - FreeRTOS
  - RT-Thread
- TinyVision
  - Melis
- Allwinner V853
  - Melis
- Youmu Pi
  - Melis

内容请详见：[ruyisdk/support-matrix](https://github.com/ruyisdk/support-matrix)
