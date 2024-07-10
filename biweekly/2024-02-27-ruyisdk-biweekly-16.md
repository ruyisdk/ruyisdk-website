---
authors: [jing, arch]
---

# 第 016 期·2024 年 02 月 27 日

## 卷首语

RuyiSDK V0.5 版本如期发布，此版本集成并发布了 PLCT GNU 小队新发布的 GNU RV64ILP32 工具链，并更新了适用 th1520 的 plctxthead-linux-gnu 工具链。继续扩展了系统安装器支持的 RISC-V 开发板，添加了对 SiFive HiFive Unmatched 、Canaan Kendryte K230 两款 RISC-V 开发板的支持，包括镜像信息的维护与下载、开发板系统的安装引导。
此外，在 RuyiSDK 集成到 RISC-V 笔记本方面，完成 ruyi 包管理工具的安装和使用验证，各功能运行正常。还完成了基于 oerv23.09 软件包依赖的 ruyi 包管理器工具的 rpm 打包工作，在 openEuler 上可以通过 yum install python3-ruyi 方式完成安装。

更多更新详见下方详情，欢迎大家试用并提供反馈和建议。下一个开发版本 RuyiSDK V0.6 版本将在 3 月 12 日发布。

## 包管理器

RuyiSDK 0.5 对应的包管理器版本也为 0.5.0，已于今日发布。您可移步
[GitHub Releases][GitHub Releases] 或 [ISCAS 镜像源][iscas]下载体验。

本次更新主要包含了以下内容：

- 新增了 RV64ILP32 ABI 的裸机工具链实验性支持。详见 `ruyi news`。
- 修复了 `toolchain/gnu-plct-xthead` 工具链输出的可执行程序无法在 RevyOS 运行的问题。
- Ruyi 设备安装器：新增支持了 Canaan Kendryte K230 与 SiFive HiFive Unmatched 两款板卡。
- Ruyi 设备安装器现在完全从 RuyiSDK 软件源拉取配置数据了。这意味着您只需运行
  `ruyi update` 便可让 Ruyi 设备安装器支持后续新增的板卡、系统组合。
- 包管理器在下载文件失败后的断点续传现在更加可靠了。
- 可以自定义 RuyiSDK 软件源的本地存储位置、远端 URL 以及所用分支了，方便您的测试或其他高级使用场景。详见 `ruyisdk/ruyi` 项目的 README。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

IDE 部分主要开展了 Dart 、Chisel RISC-V 架构上编译和调试现有插件的调研。Dart 目前可以借助 JIT 或 AOT 在 linux 系统本机编译或运行 RISC-V 目标的程序 (实验性)，不能在本机进行交叉编译 (除 flutter)。

Chisel 所需的 Verilog 仿真器 Verilator 目前在部分 Linux（如 openEuler）发行版支持还需完善，此外运行过程中遇到一些问题还在继续了解中。Chisel 对 RISC-V 项目的支持目前比较普及，国内很多 RISC-V 处理器设计相关项目均采用的 Chisel，如香山。

## GCC

更新了 RV64ILP32 的[工具链仓库](https://github.com/ruyisdk/riscv-gnu-toolchain-rv64ilp32)，同步更新了各个子模块的实现与构建，补充了中文构建使用说明测试文档

## LLVM

### T-Head Vector 拓展

首先是常规进度更新，RuyiSDK 分支中的 T-Head Vector 拓展的进度如下：

- 继续完善 LLVM intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 12.7. Vector Integer Comparison Operations
  - 12.8. Vector Integer Min/Max Operations
  - 12.9. Vector Single-Width Integer Multiply Operations
  - 12.10. Vector Integer Divide Operations
  - 12.11. Vector Widening Integer Multiply Operations
  - 12.12. Vector Single-Width Integer Multiply-Add Operations
  - 12.13. Vector Widening Integer Multiply-Add Operations
- 继续完善 Clang intrinsic 函数，自上次更新以来，新支持了这些类别下的函数：
  - 12.1. Vector Single-Width Integer Add and Subtract
  - 12.2. Vector Widening Integer Add/Subtract Operations
  - 12.3. Vector Integer Add-with-Carry / Subtract-with-Borrow Operations
  - 12.4. Vector Bitwise Logical Operations
  - 12.5. Vector Single-Width Bit Shift Operations

此外，从年后开始，我们已经开始将 RuyiSDK 中的 T-Head Vector 拓展的代码与 LLVM 上游仓库合并，
并准备在近期向上游提交 PR。计划中初次 PR 的内容包含如下：

- 注册 T-Head Vector 拓展的名字，版本，依赖拓展，以及对应的拓展冲突检测和相关测试（已完成）
- 包括所有 T-Head Vector 中的汇编指令，即 LLVM MC 支持，以及对应的测试（正在进行）
  - 这部分工作基本以及完成，目前正在进行测试的移植。主要问题为 llvm-objdump 对部分操作数的输出采用了 16 进制格式，但是汇编器的输出是 10 进制格式，导致测试字符串对比不通过。目前正在进行修复。

相关参考链接：https://gcc.gnu.org/pipermail/gcc-patches/2024-January/643490.html

## OpenJDK

OpenJDK RV64 继续持续负责 OpenJDK RISC-V 相关代码的日常开发、测试、代码检视和架构看护。

1. 完成阿里提交的 jdk11u linux-riscv64 代码检视和测试, 目前已经合并到了 riscv-port-jdk11u 仓库
2. 为 OpenJDK 主线 linux-riscv64 后端轻量级锁进行了重入锁实现等
3. 检视/测试 OpenJDK 社区关于加解密 intrinsic 的实现等

## V8

1. 向 V8 上游提交了 RISCV64 Android 构建的支持，已合并；
2. 实现了 WebAssembly 的新特性 Out of Bounds Trap Handling 在 RISC-V 后端的支持。

## RuyiSDK 集成到 RISC-V 笔记本电脑

1. 在 RISC-V 笔记本上安装和运行了包管理工具 ruyi，运行正常。
2. 基于 openEuler 23.09 版本的软件包基础依赖情况，实现了 ruyi 包管理器工具的打包，目前已经将相关 rpm 包提交给 RISC-V 笔记本组。详见：https://gitlab.inuyasha.love/weilinfox/plct-working/-/blob/master/Done/Month08/Week1/ruyi-rpm.md

[GitHub Releases]: https://github.com/ruyisdk/ruyi/releases/tag/0.5.0
[iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.5.0/
