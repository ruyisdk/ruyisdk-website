---
authors: [jing, arch]
---

# 第 023 期·2024 年 06 月 11 日

## 卷首语

RuyiSDK V0.12 版本已于今日发布。 在这个版本中，操作系统支持矩阵为**3 款开发板新增了其支持的操作系统**，RuyiSDK 包管理器本期重点修复并完善了一些缺陷，并**增加了 Ubuntu 24.04 LTS 系统的支持和测试**；官网建设方面申请了公用邮箱contact@ruyisdk.cn，优化了订阅体验。

RuyiSDK 目前采用先调研摸底、然后包管理器集成支持（含设备安装器集成支持）、再 IDE 集成支持的大致路线推进。前期初步完成了首批 RISC-V 开发板的初步调研（50 款），并优先在包管理器和安装器中提供了集成化的系统镜像安装服务。随着 RuyiSDK 对开发板的深入支持，计划与厂商对接，一起合作推动相关工作的开展。

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.13 版本将在 6 月 25 日发布。

## 包管理器

RuyiSDK 0.12 对应的包管理器版本也为 0.12.0，已于今日发布。您可移步
[GitHub Releases][GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 修复了先前 Pine64 Star64 Armbian 镜像无法下载的问题。
- 对于部分必须由用户手工下载的文件，支持了相应的用户体验：按照当前系统语言设置，渲染相应的提示语。
- 升级了 pygit2 依赖库版本到 1.5.0，以支持 libgit2 的 1.8 版本。
- 修复了 `XDG_STATE_HOME` 环境变量被无视的问题。

为了支持刷写方式复杂、需要夹杂人工干预、镜像文件需要手工下载等复杂情况下的设备初始化，我们正在对设备安装器进行重构，预计将于下个版本付诸测试。届时旧版
`ruyi` 的设备安装器功能将不可用，请先升级再进行体验。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

基于 VSCode IDE，以及包管理器提供的数据接口，在 VSCode 中实现获取全部的 environment。

## GCC

支持了 Zimop, Zfbfmin 等多个新扩展，更新修复了 GCC14 的部分回归测试问题。

## LLVM

项目大部分 intrinsic 函数已经得到支持，目前正在完善测试流程和测试数据。
至上次更新依赖，新修复了如下问题：

- 修复了 `__riscv_v_elen` 和 `__riscv_v_elen_fp` 在开启 XTHeadVector 拓展时的定义缺失的问题
- 新增加了两个工具内建函数：`vundefined` 和 `vreinterpret`
- 将带 mask 的 RVV intrinsic 函数的 policy 从默认的 TAMA (tail agnostic and masked-off agnostic) 修改为 TAMU (tail agnostic and masked-off undisturbed)，
  使得这些内建函数符合 T-Head Vector 规范。
- 新增了更多测试用例：例如 `rvv_index.c`, `rvv_branch.c` 等。

## V8

1. 继续添加 TurboShaft IR 的指令选择支持。
2. 添加 WASM 新特性 JSPI 的支持。

## OpenJDK

1. Proposed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/18716 (8329258: TailCall should not use frame pointer register for jump target)
- https://github.com/openjdk/jdk/pull/19313 (8332533: RISC-V: Enable vector variable shift instructions for machines with RVV)
- https://github.com/openjdk/jdk/pull/19328 (8332615: RISC-V: Support vector unsigned comparison instructions for machines with RVV)
- https://github.com/openjdk/jdk/pull/19415 (8333006: RISC-V: C2: Support vector-scalar and vector-immediate arithmetic instructions)

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
- https://github.com/openjdk/jdk/pull/19448 (8333154: RISC-V: Add support for primitive array C1 clone intrinsic)
- https://github.com/openjdk/jdk/pull/18999 (8331281: RISC-V: C2: Support vector-scalar and vector-immediate bitwise logic instructions)
- https://github.com/openjdk/jdk/pull/19415 (8333006: RISC-V: C2: Support vector-scalar and vector-immediate arithmetic instructions)

## 官网

增加了contact@ruyisdk.cn邮箱，优化了订阅体验。

截止今日 6 月 11 日，订阅人数一共 33 人（增加 1 人）。RuyiSDK 网站访问人数 291 人（增加 114 人），访问页面 848 次（增加 440 次）。

## 操作系统支持矩阵

本周在支持矩阵中新增了更多开发板和操作系统：

- Milk-V Mars: BuildRoot
- Milk-V Duo/Duo S/Duo 256M: Zephyr
- D1: Arch Linux

内容请详见：[ruyisdk/support-matrix](https://github.com/ruyisdk/support-matrix)

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.12.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.12.0/
