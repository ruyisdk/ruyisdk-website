---
authors: [jing, arch]
---

# 第 020 期·2024 年 04 月 23 日

## 卷首语

RuyiSDK V0.9 版本已于今日发布。 **RuyiSDK 完成了对矽速现有 RISC-V 全产品线的调研，并在设备系统安装器中添加支持**，除 RISCV FPGA 系列中无 RISC-V 硬核的开发板，均已集成到 RuyiSDK 中。同时，**完成了对 嘉楠勘智 K510 的支持**。

近期提交了[**基于 17.0.6 版本添加 xtheadvector 支持的 LLVM 工具链**](https://github.com/ruyisdk/llvm-project/tree/rebase-17.0.6)，这一支持后续也将集成到 RuyiSDK 中。此外，包管理器工具针对开发板镜像或 SDK 格式多元化的特点，修复了多文件压缩包下载时的 bug，增加 lz4 压缩格式解包等。RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。

下一个开发版本 RuyiSDK V0.10 版本将在 5 月 14 日发布。

## 包管理器

RuyiSDK 0.9 对应的包管理器版本也为 0.9.0，已于今日发布。您可移步
[GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.9.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.9.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 支持解包 LZ4 格式的压缩文件了。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

- 支持矽速（Sipeed）全线 RISC-V 产品。Ruyi 设备安装器现已新增支持以下设备型号：
  - Sipeed LicheeRV Nano
  - Sipeed Lichee Cluster 4A
  - Sipeed Lichee Console 4A
  - Sipeed Maix-I
  - Sipeed Tang Mega 138K Pro

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期暂无进展。

## GCC

继续维护 RUYISDK GCC 的版本支持，修复了 gcc12 构建时的一些问题，正在同步最新的 GCC14 release 特性。

## LLVM

### T-Head Vector 拓展

- 继续完善 LLVM intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 15.1. Vector Single-Width Integer Reduction Operations
  - 15.2. Vector Widening Integer Reduction Operations
  - 15.3. Vector Single-Width Floating-Point Reduction Operations
  - 15.4. Vector Widening Floating-Point Reduction Operations
  - 16.1. Vector Mask-Register Logical Operations
  - 16.2. Vector mask population count vpopc
  - 16.3. vfirst find-first-set mask bit
  - 16.4. vmsbf.m set-before-first mask bit
  - 16.5. vmsif.m set-including-first mask bit
  - 16.6. vmsof.m set-only-first mask bit
  - 16.7. Vector Iota Operations
  - 16.8. Vector Element Index Operations
- 继续完善 Clang intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 16.1. Vector Mask-Register Logical Operations
  - 16.2. Vector mask population count vpopc
  - 16.3. vfirst find-first-set mask bit
  - 16.4. vmsbf.m set-before-first mask bit
  - 16.5. vmsif.m set-including-first mask bit
  - 16.6. vmsof.m set-only-first mask bit
  - 16.7. Vector Iota Operations
  - 16.8. Vector Element Index Operations

## OpenJDK

1. Proposed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/18558 (8329355: Test compiler/c2/irTests/TestIfMinMax.java fails on RISC-V)
- https://github.com/openjdk/jdk/pull/18611 (8329641: RISC-V: Enable some tests related to SHA-2 instrinsic)
- https://github.com/openjdk/jdk/pull/18668 (8329823: RISC-V: Need to sync CPU features with related JVM flags)
- https://github.com/openjdk/jdk22u/pull/135 (8329823: RISC-V: Need to sync CPU features with related JVM flags)
- https://github.com/openjdk/jdk21u-dev/pull/472 (8315652: RISC-V: Features string uses wrong separator for jtreg)
- https://github.com/openjdk/jdk17u-dev/pull/2377 (8315652: RISC-V: Features string uses wrong separator for jtreg)
- https://github.com/openjdk/riscv-port-jdk11u/pull/16 (8291893: riscv: remove fence.i used in user space)
- https://github.com/openjdk/riscv-port-jdk11u/pull/17 (8284937: riscv: should not allocate special register for temp)
- https://github.com/openjdk/riscv-port-jdk11u/pull/18 (8285303: riscv: Incorrect register mask in call_native_base)

2. Reviewed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/17745 (8321010: RISC-V: C2 RoundVF)
- https://github.com/openjdk/jdk/pull/18040 (8321021: RISC-V: C2 VectorUCastB2X)
- https://github.com/openjdk/jdk/pull/18175 (8327716: RISC-V: Change type of vector_length param of several assembler functions from int to uint)
- https://github.com/openjdk/jdk/pull/18191 (8327794: RISC-V: enable extension features based on impid (Rivos specific change))
- https://github.com/openjdk/jdk/pull/18370 (8328404: RISC-V: Fix potential crash in C2_MacroAssembler::arrays_equals)
- https://github.com/openjdk/jdk/pull/18435 (8326960: GHA: RISC-V sysroot cannot be debootstrapped due to ongoing Debian t64 transition)
- https://github.com/openjdk/jdk/pull/18382 (8317720: RISC-V: Implement Adler32 intrinsic)
- https://github.com/openjdk/jdk/pull/18599 (8329083: RISC-V: Update profiles supported on riscv)
- https://github.com/openjdk/jdk/pull/18611 (8329641: RISC-V: Enable some tests related to SHA-2 instrinsic)
- https://github.com/openjdk/jdk/pull/18668 (8329823: RISC-V: Need to sync CPU features with related JVM flags)
- https://github.com/openjdk/jdk/pull/18445 (8327743: JVM crash in hotspot/share/runtime/javaThread.cpp - failed: held monitor count should be equal to jni: 0 != 1)

## V8

解决了指针压缩开启后，32 位指针与 0 比较时依然使用 64 位比较指令的 bug。
使用 RISC-V 提供的 sys_riscv_hwprobe 系统调用来进行运行时指令集的探测。

## 官网

本期暂无进展。

## 操作系统支持矩阵

新增对 Canaan Kendryte K510、Sipeed Tang Mega 138K Pro 等开发板的系统支持情况调研。基于矽速各开发板展开测试验证，输出测试报告。
内容详见：https://github.com/ruyisdk/support-matrix
