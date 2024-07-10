---
authors: [jing, arch]
---

# 第 025 期·2024 年 07 月 09 日

## 卷首语

RuyiSDK V0.14 版本已于今日发布。 在这个版本中，**包管理器正式引入插件架构**，`ruyi` 虚拟环境的 profile 相关处理现在完全由插件负责了。此外 PLCT 完成了 Box64 的 RISC-V 架构适配，并将代码合入上游，**RuyiSDK 软件源此次增加了 Box64 模拟器并初步实现了在 Box64 中打开 wps-linux-x86_64 writer。**

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.15 版本将在 7 月 23 日发布。

## 包管理器

RuyiSDK 0.14 对应的包管理器版本也为 0.14.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.14.0-gh] 或 [ISCAS 镜像源][ruyi-0.14.0-iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 正式引入插件架构：`ruyi` 虚拟环境的 profile 相关处理现在完全由插件负责了。
- 支持了 Debian 软件包格式 `*.deb` 的解包操作。
- 再次完善了对“预发布版本”的判断：先前会对非完全由数字结尾的该类版本号判断错误。
  但该潜在问题不会被当前的 RuyiSDK 软件源内容触发。
- 修复了 riscv64 Python 3.12 环境下 `pygit2` 的构建失败问题：先前需要在
  `pygit2` 构建开始之后、试图在其虚拟环境中执行 `setup.py` 前，人工干预，在该环境中安装
  `setuptools`——从 Python 3.12 起该包已经不会被自动安装。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

- 增加了从上游源码打包的 Box64 架构模拟器：`emulator/box64-upstream`。
- 增加了办公套件 `extra/wps-office`。请注意：由于是商业软件的缘故，首次运行该软件包时需要操作接受一份《最终用户许可协议》。
- 您可按照 `ruyi news` 的指引，在您的 RISC-V 桌面设备上用 Box64 运行
  WPS Office 进行办公了。

为了支持刷写方式复杂、需要夹杂人工干预、镜像文件需要手工下载等复杂情况下的设备初始化，我们正在将设备安装器重构为基于插件架构的形式。
由于本开发周期临时加入了 Box64 运行 WPS Office 的 PoC 内容，设备安装器的插件化重构工作暂缓，但仍将在未来的版本上线。届时旧版
`ruyi` 的设备安装器功能将不可用，请先升级再进行体验。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

本期无进展。

## GCC

- 提交了 gprofng 的 patch，目前已通过 review 修改，正在等待合并。
- 更新了 profiles 的支持。

## LLVM

- 新建 [Tuning-SPEC-CPU](https://github.com/ruyisdk/llvm-project/tree/Tuning-SPEC-CPU) 分支，用于 Spec CPU 较高性能的优化
- 支持了使用 `vget` 和 `vset` 在不同 LMUL 的寄存器组上进行操作
- 完善相关测试用例，增加更多真实世界的代码片段作为测试

## V8

1. 新增 RISCV32 的 Turboshaft 单元测试支持。
2. 新增 RISC-V SV39 支持。

## OpenJDK

1. Proposed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/19649 (8333964: RISC-V: C2: Check "requires_strict_order" flag for floating-point add reduction)
- https://github.com/openjdk/jdk/pull/19686 (8334078: RISC-V: TestIntVect.java fails after JDK-8332153 when running without RVV)
- https://github.com/openjdk/jdk/pull/19785 (8334505: RISC-V: Several tests fail when MaxVectorSize does not match VM_Version::\_initial_vector_length)
- https://github.com/openjdk/jdk/pull/19852 (8334843: RISC-V: Fix wraparound checking for r_array_index in lookup_secondary_supers_table_slow_path)

2. Reviewed JDK-mainline PRs:

- https://github.com/openjdk/jdk/pull/19473 (8333248: VectorGatherMaskFoldingTest.java failed when maximum vector bits is 64)
- https://github.com/openjdk/jdk/pull/19459 (8332900: RISC-V: refactor nativeInst_riscv.cpp and macroAssembler_riscv.cpp)
- https://github.com/openjdk/jdk/pull/19472 (8333245: RISC-V: UseRVV option can't be enabled after JDK-8316859)
- https://github.com/openjdk/jdk/pull/19481 (8333276: RISC-V: client VM build failure after JDK-8241503)
- https://github.com/openjdk/jdk/pull/19431 (8332899: RISC-V: add comment and make the code more readable (if possible) in MacroAssembler::movptr)
- https://github.com/openjdk/jdk/pull/19564 (8333652: RISC-V: compiler/vectorapi/VectorGatherMaskFoldingTest.java fails when using RVV)
- https://github.com/openjdk/jdk/pull/19453 (8332689: RISC-V: Use load instead of trampolines)
- https://github.com/openjdk/jdk/pull/19320 (8332587: RISC-V: secondary_super_cache does not scale well)
- https://github.com/openjdk/jdk/pull/19649 (8333964: RISC-V: C2: Check "requires_strict_order" flag for floating-point add reduction)
- https://github.com/openjdk/jdk/pull/19679 (8334135: RISC-V: check vector support in VM_Version::os_aux_features)
- https://github.com/openjdk/jdk/pull/19686 (8334078: RISC-V: TestIntVect.java fails after JDK-8332153 when running without RVV)
- https://github.com/openjdk/jdk/pull/19750 (8334396: RISC-V: verify perf of ReverseBytesI/L)

## 官网

[RuyiSDK 社区参与的 MoonBit 第三次 Meetup 活动回顾来了！🎉](https://mp.weixin.qq.com/s/7JuZMKcxpENoygn1YfnCLA)

由 MoonBit 联合 RuyiSDK 和 Intel 举办的第三次 Meetup 活动圆满结束啦！本次活动嘉宾云集，涵盖了从云原生开发平台到 WebAssembly 模块化技术、编程语言垃圾回收技术的最新进展、RuyiSDK 包管理器以及 RevyOS 最新进展多个热点话题。

截止今日 7 月 8 日，订阅人数一共 37 人（增加 1 人）。RuyiSDK 网站访问人数 502 人（增加 103 人），访问页面 1424 次（增加 339 次）。RuyiSDK 微信交流群 70 人（进群请微信加小助手 ruyisdk_helper）。

## 操作系统支持矩阵

- Ubuntu 24.04 LTS
  - StarFive VisionFive 2
  - HiFive Unmatched
- openEuler RISC-V 24.03 LTS
  - Sipeed Lichee Pi 4A
  - Milk-V Pioneer (v1.3)
- 一些小的 typo 修复

内容请详见：[ruyisdk/support-matrix](https://github.com/ruyisdk/support-matrix)

[ruyi-0.14.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.14.0
[ruyi-0.14.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.14.0/
