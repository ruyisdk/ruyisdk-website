---
authors: [jing, white, fox]
---
# RuyiSDK 双周进展汇报  第 052 期·2025 年 09 月 11 日

## 卷首语

各位 RuyiSDK 的小伙伴们，大家好！

欢迎阅读第 52 期《RuyiSDK 双周进展》！

本期我们重点优化了发版测试流程，进一步加强了版本发布前的兼容性与文档测试。经过 2 天集中修复，RuyiSDK 0.40 现已正式发布。该版本存在一些已知问题（详见文档末尾），但不影响核心功能。请您在下载和使用前仔细阅读相关说明。

我们计划在 9 月 30 日发布 RuyiSDK 0.41，为您的假期折腾奉上额外一周的更新。我们将持续为大家带来更多新特性与体验优化，敬请期待～也欢迎大家随时来 [RuyiSDK 技术社区](https://ruyisdk.cn/) 找我们交流想法、提出建议！

此外，别忘了我们的 [RuyiSDK Office Hours](https://ruyisdk.cn/c/ruyisdk/9) 每双周四都会定期举办，欢迎一起来聊聊技术、聊聊进展～

## 包管理器

RuyiSDK 0.40 对应的包管理器版本也为 0.40.0，已于 9 月 9 日发布。您可移步
[GitHub Releases][ruyi-0.40.0-gh]、[PyPI][ruyi-0.40.0-pypi] 或 [ISCAS 镜像源][ruyi-0.40.0-iscas]下载体验。

* [PyPI][ruyi-0.40.0-pypi]: `pip install ruyi`
* [GitHub Releases][ruyi-0.40.0-gh]
* [ISCAS 镜像源][ruyi-0.40.0-iscas]

[ruyi-0.40.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.40.0
[ruyi-0.40.0-pypi]: https://pypi.org/project/ruyi/0.40.0/
[ruyi-0.40.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.40.0/

> [!NOTE]
> RISC-V 用户可以使用 `pip` 安装 `ruyi`，但由于 `ruyi` 依赖的部分 Python
> 库暂未在 PyPI 上提供 RISC-V 架构的预编译包，安装 `ruyi` 时 Python
> 包管理器会尝试从源代码编译安装这些依赖，可能非常耗时或编译失败。
>
> 如果您在 RISC-V 设备上安装 `ruyi` 时遇到问题，建议使用其他安装方法。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 完善了设备支持：
    * Sipeed LicheeRV Nano 的 fishwaldo 构建的 Debian：新增了历史版本 1.2.0 与 1.3.0。
    * Milk-V Pioneer 的 RevyOS：更新了 0.20250901.0 版本。
* 工程化迭代：
    * 修复了 `board-image/debian-desktop-sdk-milkv-mars-cm-sd` 的数据结构，并以 CI 形式确保了类似问题不会再发生。

感谢 [@weilinfox] 的贡献！

[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
Eclipse 插件本期无新增特性，欢迎对Eclipse插件开发有兴趣的小伙伴加入开发团队，详情参考 [J159 RuyiSDK IDE 开发实习生](https://github.com/lazyparser/weloveinterns/blob/master/open-internships.md) ，期待您的加入。

## GCC
为官方工具链添加了'--with-profiles'选项用来指定构建时默认使能的RISC-V Profiles, 将GCC上游中Profiles定义整理至'riscv-profiles.def'中,
更新了RVP的Intrinsics文档，GCC同步实现中。

## V8
PLCT提交并合入的patch：
1. **[riscv] Optimize Overflow check when right operand is Immediate**  
   [RISC-V] 当右操作数为立即数时优化溢出检查  
   [chromium-review.googlesource.com/c/6732519](https://chromium-review.googlesource.com/c/6732519)
2. **[riscv][sandbox] Bottleneck kUnknownIndirectPointerTag**  
   [RISC-V][sandbox] 处理 kUnknownIndirectPointerTag的性能瓶颈  
   [chromium-review.googlesource.com/c/6907272](https://chromium-review.googlesource.com/c/6907272)
3. **[riscv][wasm, codegen] Add skipped write barrier verification to Liftoff**  
   [RISC-V][WebAssembly，codegen] 向 Liftoff 添加跳过的写屏障验证  
   [chromium-review.googlesource.com/c/6914315](https://chromium-review.googlesource.com/c/6914315)
4. **[riscv] Revert "Reland "Reland "[turboshaft] Direct call for known functions"""**  
   [RISC-V] 撤销 "Reland"Reland "[turboshaft] Direct call for known functions"""  
   [chromium-review.googlesource.com/c/6907270](https://chromium-review.googlesource.com/c/6907270)
5. **[riscv][wasmfx] Implement the resume instruction**  
   [RISC-V][wasmfx] 实现 resume 指令  
   [chromium-review.googlesource.com/c/6908524](https://chromium-review.googlesource.com/c/6908524)

审阅并合入的patch:
1. **[riscv] Remove branch instrution in AssembleReturn**  
   [RISC-V] 移除 AssembleReturn 中的分支指令  
   [chromium-review.googlesource.com/c/6873604](https://chromium-review.googlesource.com/c/6873604)
2. **[risc-v] Use bexti for kRiscvCvtDS**  
   [RISC-V] 对 kRiscvCvtDS 使用 bexti 指令  
   [chromium-review.googlesource.com/c/6873191](https://chromium-review.googlesource.com/c/6873191)
3. **[riscv] Hoisting sign extension for switch table**  
   [RISC-V] 为切换表提升符号扩展操作  
   [chromium-review.googlesource.com/c/6873189](https://chromium-review.googlesource.com/c/6873189)
4. **[risc-v] Remove sll32 instruction if r2 is less than 0x7FFFFFFF**  
   [RISC-V] 若 r2 小于 0x7FFFFFFF 则移除 sll32 指令  
   [chromium-review.googlesource.com/c/6873603](https://chromium-review.googlesource.com/c/6873603)
5. **[riscv] Use zextw in DecompressTagged to reduce the number of instructions**  
   [RISC-V] 在 DecompressTagged 中使用 zextw 以减少指令数量  
   [chromium-review.googlesource.com/c/6873192](https://chromium-review.googlesource.com/c/6873192)
6. **[riscv] Handle kRiscvPeek with simd128 output**  
   [RISC-V] 处理带有 simd128 输出的 kRiscvPeek  
   [chromium-review.googlesource.com/c/6879783](https://chromium-review.googlesource.com/c/6879783)
7. **[risc-v] Only save clobbered registers when calling RecordWrite**  
   [RISC-V] 调用 RecordWrite 时仅保存被破坏的寄存器  
   [chromium-review.googlesource.com/c/6873602](https://chromium-review.googlesource.com/c/6873602)
8. **[riscv] Don't round to zero when doing an i32x4-mul operation**  
   [RISC-V] 执行 i32x4-mul 操作时不向零舍入  
   [chromium-review.googlesource.com/c/6916101](https://chromium-review.googlesource.com/c/6916101)
9. **[riscv] Use a function to save and restore Wasm params**  
   [RISC-V] 使用函数来保存和恢复 WebAssembly 参数  
   [chromium-review.googlesource.com/c/6842159](https://chromium-review.googlesource.com/c/6842159)
10. **[riscv][compiler] Support skipped skipped write barrier verification in Turbofan**  
    [RISC-V][compiler] 在 Turbofan 中支持跳过的写屏障验证  
    [chromium-review.googlesource.com/c/6917460](https://chromium-review.googlesource.com/c/6917460)
11. **[riscv][maglev] Reset last young allocation in stack checks**  
    [RISC-V][Maglev] 在栈检查中重置最后的年轻代分配  
    [chromium-review.googlesource.com/c/6904549](https://chromium-review.googlesource.com/c/6904549)
12. **[riscv] Use shxadd instruction to calculate address for load & store**  
    [RISC-V] 使用 shxadd 指令计算加载和存储的地址  
    [chromium-review.googlesource.com/c/6873190](https://chromium-review.googlesource.com/c/6873190)

## 操作系统支持矩阵

- [Dump ArchLinux@Duo\_S](https://github.com/ruyisdk/support-matrix/pull/365)
- [Fix OrangePi-RV metadata](https://github.com/ruyisdk/support-matrix/pull/366)

## 版本测试及遗留问题

RuyiSDK 0.40 已通过[发版测试](https://gitee.com/yunxiangluo/ruyisdk-test/blob/master/20250903/README.md)。该
RuyiSDK 版本存在部分不影响核心功能的已知问题，请您在下载使用前务必了解相关情况，审慎评估，以避免可能的不良体验或损失。

| 缺陷      | 问题等级 | 备注 |
| ----------- | ----------- | --- |
| [文档代码块格式不统一 #93](https://github.com/ruyisdk/docs/issues/93)       | 修复 | 见 issue 下方更新 |
| [链接中的 RuyiSDK 大小写问题 #94](https://github.com/ruyisdk/docs/issues/94)   | 修复 | 见 issue 下方更新      |
| [关于 fastboot 的文档提示 #95](https://github.com/ruyisdk/docs/issues/95)   | 严重 | 建立新的 [issue](https://github.com/ruyisdk/ruyisdk/issues/52) 进行更新，且已拟订相关修复版本号为 0.42.0 版本  |
| [关于使用 pip 安装 ruyi 的文档提示 #96](https://github.com/ruyisdk/docs/issues/96)   | 严重 | 已有文档整体更新计划，已有具体时间节点和时间表安排  |
| [有一部分包无法下载 #37](https://github.com/ruyisdk/packages-index/issues/37)     | 一般 | 已有相关 issue 回复且已经在修复中 |
| [BananaPi BPI-F3 eMMC storage variant did not refer to any combo #101](https://github.com/ruyisdk/packages-index/issues/101)     | 一般 | 软件自带修复功能，且已有相关 issue 回复 |
