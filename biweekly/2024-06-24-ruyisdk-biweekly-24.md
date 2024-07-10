---
authors: [jing, arch]
---

# 第 024 期·2024 年 06 月 24 日

## 卷首语

RuyiSDK V0.13 版本已于今日发布。 在这个版本中，操作系统支持矩阵**增加了开发板的 IP Core 信息**，同时完成了**英文版本**的支持。RuyiSDK 包管理器修复并完善了一些缺陷，同时**为引入插件架构做了准备**，以达到后续更新不需要每次都必须下载最新版的 ruyi 工具。同时 ruyi 包管理器**增加了新发布的 openEuler 24.03 LTS 系统的支持和测试**；

此外，RuyiSDK 还参加了两期活动：[MoonBit Meetup 第三期](https://mp.weixin.qq.com/s/nA4fSeVAFk_whbjdC2tmig) 和 [2024 上海国际嵌入式展](https://mp.weixin.qq.com/s/4Kae99_wTPgQBPqJTwh9mg) ，在这两个活动中介绍了 RuyiSDK 包管理器。

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.14 版本将在 7 月 9 日发布。

## 包管理器

RuyiSDK 0.13 对应的包管理器版本也为 0.13.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.13.0-gh] 或 [ISCAS 镜像源][ruyi-0.13.0-iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 修复了 [issue #158](https://github.com/ruyisdk/ruyi/issues/158): `coremark` 包的两个版本，解压后的目录布局不统一。现在都会在当前工作目录下“摊开”了。
- 修复了 [issue #159](https://github.com/ruyisdk/ruyi/issues/159): 对“预发布版本”判断方式的不统一。
- 随着 Python 3.12 的正式发布，官方 `ruyi` 二进制也在 Python 3.12 环境构建了。
- 为引入插件架构做好准备：引入了 Starlark 语言支持，并支持在 CI 自动化构建。[Starlark][Starlark]
  是一种极度简化的 Python 方言，被 Bazel、BUCK 等构建系统广泛采用；这是为了让所有了解
  Python 语言的开发者都可使用熟悉的语法撰写 RuyiSDK 包管理器插件。

为了支持刷写方式复杂、需要夹杂人工干预、镜像文件需要手工下载等复杂情况下的设备初始化，我们正在将设备安装器重构为基于插件架构的形式，预计将于下个版本付诸测试。届时旧版
`ruyi` 的设备安装器功能将不可用，请先升级再进行体验。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期暂无进展。

## GCC

- 发布了新的 rv64ilp32 release 版本，修复了 gdb 在 rv64ilp32 调试时的问题。
- 完成了 P 扩展在 GCC14 上的 Rebase 工作，已合入 RUYISDK GCC14 分支。
- 添加了 Sm/scsrind 扩展的支持。
- 正在添加 Ssccft/Smcdeleg 扩展的支持中。

## LLVM

修复了如下问题：

- 支持了 `vlmul_trunc` 和 `vlmul_ext` 等 bitcast 操作
- 支持 `vreinterpret` 在向量布尔值和整数之间的转换
- LLVM 对向量 Mask 操作支持使用 `nvx1i1/nvx2i1/nvx4i1` 类型的操作数
- Clang 对向量 Mask 操作支持了 `vbool16/32/64_t` 类型的操作数
- 修复了 `RISCVInsertVSETVLI` 中对 `handleAVLImm` 的处理
- 修复了对 XTHeadVector 中支持的 `VSETIVLI` 指令的模拟的过程

## V8

1. 添加 RISC-V 平台的 TurboShaft SIMD IR 支持。
2. 添加 CallApi 支持。

## OpenJDK

1. Proposed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/19448 (8333154: RISC-V: Add support for primitive array C1 clone intrinsic)
- https://github.com/openjdk/jdk/pull/19481 (8333276: RISC-V: client VM build failure after JDK-8241503)
- https://github.com/openjdk/jdk/pull/19564 (8333652: RISC-V: compiler/vectorapi/VectorGatherMaskFoldingTest.java fails when using RVV)
- https://github.com/openjdk/jdk/pull/19473 (8333248: VectorGatherMaskFoldingTest.java failed when maximum vector bits is 64)

2. Reviewed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/18226 (8327964: Simplify BigInteger.implMultiplyToLen intrinsic)
- https://github.com/openjdk/jdk/pull/18967 (8330685: ZGC: share barrier spilling logic)
- https://github.com/openjdk/jdk/pull/19026 (8331418: ZGC: generalize barrier liveness logic)
- https://github.com/openjdk/jdk/pull/19011 (8331393: AArch64: u32 \_partial_subtype_ctr loaded/stored as 64)
- https://github.com/openjdk/jdk/pull/18919 (8321008: RISC-V: C2 MulAddVS2VI)
- https://github.com/openjdk/jdk/pull/18942 (8326306: RISC-V: Re-structure MASM calls and jumps)
- https://github.com/openjdk/jdk/pull/19246 (8332265: RISC-V: Materialize pointers faster by using a temp register)
- https://github.com/openjdk/jdk/pull/19010 (8331360: RISCV: u32 \_partial_subtype_ctr loaded/stored as 64)
- https://github.com/openjdk/jdk/pull/19014 (8331399: RISC-V: Don't us mv instead of la)
- https://github.com/openjdk/jdk/pull/19065 (8320995: RISC-V: C2 PopCountVI)
- https://github.com/openjdk/jdk/pull/19153 (8331577: RISC-V: C2 CountLeadingZerosV)
- https://github.com/openjdk/jdk/pull/19325 (8320999: RISC-V: C2 RotateLeftV)

## 官网

以用户视角，调整并更新了部分使用文档。
截止今日 6 月 25 日，订阅人数一共 36 人（增加 3 人）。RuyiSDK 网站访问人数 399 人（增加 108 人），访问页面 1085 次（增加 237 次）。RuyiSDK 微信交流群 57 人（ruyisdk meetup 和 展会吸引）。

## 操作系统支持矩阵

操作系统支持矩阵本次更新：

- Ubuntu
  - Nezha D1: 更新至 24.04 版本
  - Lichee RV D1: 更新至 24.04 版本
- Arch Linux
  - D1h（新增）

以及最重要的：我们终于有 i18n / 英文翻译啦 🎉

共计 448 个文件修改，数十次 Review，这可能是支持矩阵创立以来最大的一次修改，在此感谢各位贡献者的参与~

[ruyi-0.13.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.13.0
[ruyi-0.13.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.13.0/
[Starlark]: https://github.com/bazelbuild/starlark
