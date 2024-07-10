---
authors: [jing, arch]
---

# 第 019 期·2024 年 04 月 09 日

## 卷首语

RuyiSDK V0.8 版本已于今日发布。**RuyiSDK 官网已正式上线**；RuyiSDK 软件源**已集成 PLCT 发布的支持香山南湖微处理器的 GNU**；

RuyiSDK 对 milkv 全产品线支持计划于上期基本完成，本期缺失待测设备还未就绪，因此仍需等待设备就绪后完成最后部分设备测试工作。对矽速全产品线支持计划本期完成了部分调研和集成准备工作，其 Linux RISC-V SBC 系列所有开发板、以及 Maix AI 视觉系列 RISC-V 设备的调研和集成准备工作基本就绪，RISCV FPGA 系列相关开发板还在调研了解中。

此外，包管理器工具完成了若干功能的完善和优化，更多进展详见下方详情，欢迎大家试用并提供反馈和建议。

下一个开发版本 RuyiSDK V0.9 版本将在 4 月 23 日发布。

## 包管理器

RuyiSDK 0.8 对应的包管理器版本也为 0.8.0，已于今日发布。您可移步
[GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.8.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.8.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 默认禁止了以 `root` 身份运行 `ruyi`，以提升安全性。如确有需要，可按程序提示设置环境变量以绕过检查，但我们不推荐这么做。
- 迭代了软件源格式：
  - 支持以 TOML 格式撰写软件源全局配置及包定义文件。相比先前采用的 JSON 格式，更便于手工编辑、添加注释、标记文件格式版本等，有利于维护。
  - 支持定义上游镜像了。后续对那些本身也通过镜像分发的软件包，也能借助此功能，利用上它们的镜像了，有利于提高用户一侧的下载速度与可靠性。
- 支持在 `wget` 与 `curl` 均不可用的系统上下载文件了。
- 安装软件包时的解包操作现在具备原子性了。这意味着一旦解包被中断，重试时，`ruyi` 不会错误以为该包已经安装完成了。
- 持续优化工程实践：
  - 目前所有代码贡献都会在代码风格、类型注解、开源许可证遵守方面接受检查了。
  - 改进了打包流程，使 `ruyi` 官方二进制的包体得到了一定的瘦身。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期暂无显著进展。

## GCC

修复了 Zicond 扩展与新版本 newlib 不兼容的问题，协助解决了 B-type 指令的添加问题，
补充了香山 Branch 流水线的指令支持类型，继续集成新的 RISC-V 特性到 RUYISDK GNU 工具链中。

## LLVM

### T-Head Vector 拓展

- 继续完善 LLVM intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 14.1. Vector Single-Width Floating-Point Add/Subtract Operations
  - 14.3. Vector Single-Width Floating-Point Multiply/Divide Operations
- 继续完善 Clang intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 13.1. Vector Single-Width Saturating Add and Subtract
  - 13.5. Vector Narrowing Fixed-Point Clip Operations

此外，本次将 T-Head Vector 分支 rebase 到了 LLVM 17.0.6 版本。

## OpenJDK

1. Get familar with virtual thread pinning issue (Virtual Thread’s Next Steps: https://fosdem.org/2024/schedule/event/fosdem-2024-3255-virtual-thread-s-next-steps/ )

2. Proposed riscv-port-jdk11u backport PRs to fix GHA linux-cross-build (linux-riscv64) failure:

- https://github.com/openjdk/riscv-port-jdk11u/pull/14 (8326960: GHA: RISC-V sysroot cannot be debootstrapped due to ongoing Debian t64 transition)
- https://github.com/openjdk/riscv-port-jdk11u/pull/15 (8328948: GHA: Restoring sysroot from cache skips the build after JDK-8326960)

3. Reviewed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/17698 (8320646: RISC-V: C2 VectorCastHF2F)
- https://github.com/openjdk/jdk/pull/17820 (8321282: RISC-V: SpinPause() not implemented)
- https://github.com/openjdk/jdk/pull/17889 (8321075: RISC-V: UseSystemMemoryBarrier lacking proper OS support)
- https://github.com/openjdk/jdk/pull/17924 (8326235: RISC-V: Size CodeCache for short calls encoding)
- https://github.com/openjdk/jdk/pull/17750 (8324124: RISC-V: implement \_vectorizedMismatch intrinsic)
- https://github.com/openjdk/jdk/pull/17964 (8322962: Upcall stub might go undetected when freezing frames)
- https://github.com/openjdk/jdk/pull/17554 (8319900: Recursive lightweight locking: riscv64 implementation)
- https://github.com/openjdk/jdk/pull/18039 (8326936: RISC-V: Shenandoah GC crashes due to incorrect atomic memory operations)
- https://github.com/openjdk/jdk/pull/18070 (8327058: RISC-V: make Zcb experimental)
- https://github.com/openjdk/jdk/pull/18114 (8327283: RISC-V: Minimal build failed after JDK-8319716)
- https://github.com/openjdk/jdk/pull/18131 (8327426: RISC-V: Move alignment shim into initialize_header() in C1_MacroAssembler::allocate_array)
- https://github.com/openjdk/jdk/pull/18169 (8327689: RISC-V: adjust test filters of zfh extension)
- https://github.com/openjdk/jdk/pull/18075 (8326983: Unused operands reported after JDK-8326135)

4. Reviewed JDK21u upstream PRs:

- https://github.com/openjdk/jdk21u-dev/pull/294 (8321075: RISC-V: UseSystemMemoryBarrier lacking proper OS support)

5. Reviewed JDK11u upstream PRs:

- https://github.com/openjdk/jdk11u-dev/pull/2549 (8307955: Prefer to PTRACE_GETREGSET instead of PTRACE_GETREGS in method 'ps_proc.c::process_get_lwp_regs')

6. Reviewed riscv-port-jdk11u backport PRs:

- https://github.com/openjdk/riscv-port-jdk11u/pull/6 (8283929: GHA: Add RISC-V build config)
- https://github.com/openjdk/riscv-port-jdk11u/pull/7 (8290496: riscv: Fix build warnings-as-errors with GCC 11)
- https://github.com/openjdk/riscv-port-jdk11u/pull/9 (JDK-8327284: Use correct register in riscv_enc_fast_unlock())
- https://github.com/openjdk/riscv-port-jdk11u/pull/10 (8316645: RISC-V: Remove dependency on libatomic by adding cmpxchg 1b)

7. OpenJDK PRs

- https://github.com/openjdk/jdk/pull/18370 (8328404: RISC-V: Fix potential crash in C2_MacroAssembler::arrays_equals)
- https://github.com/openjdk/riscv-port-jdk11u/pull/9 (8327284: Use correct register in riscv_enc_fast_unlock())
- https://github.com/openjdk/riscv-port-jdk11u/pull/11 (8328065: RISC-V: Add isolation for shared code changes)
- https://github.com/openjdk/riscv-port-jdk11u/pull/12 (8328580: Remove trivial shared code changes which are leftover from riscv port)
- https://github.com/openjdk/riscv-port-jdk11u/pull/13 (8283865: riscv: Break down -XX:+UseRVB into seperate options for each bitmanip extension)

## V8

1. 修复沙盒 SandBox 支持的 BUG，在 RISC-V 架构上开启该功能，加强 V8 的安全特性。
2. 移植 TurboShaft IR 的单元测试集到 RISC-V 架构。
3. 在 V8 中实现相应的支持，以适配 openEuler RISC-V 新版本中的 SV57 虚拟内存特性。

## 官网

RuyiSDK 官网正式上线了！欢迎访问官网，了解更多关于 RuyiSDK 的信息，点击网站下方的订阅，获得我们的最新消息或者加入社区。

官网访问地址：https://ruyisdk.org/

官网仓库：https://github.com/ruyisdk/ruyisdk-website

## 操作系统支持矩阵

完成了对绝大多数市面常见 RISC-V 开发板操作系统支持情况的调研，并编写了测试报告。新增了对 Lichee Cluster 4A、Lichee Console 4A、Sipeed Maix-I、Lichee RV Nano 的系统支持情况调研。

内容详见：https://github.com/ruyisdk/support-matrix
