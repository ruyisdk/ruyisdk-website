# 第 059 期·2025 年 12 月 30 日

## 卷首语
各位 RuyiSDK 的小伙伴们，大家好！辞旧迎新之际，先祝福大家元旦快乐，万事如意！

Ruyi 包管理器 0.44.0 版本已于今日发布，我们新增Milk-V Megrez设备支持并完善RV32的manual profile命名，修复了遥测功能的若干细节，旨在提供更多设备支持和更好的服务。

同时，RuyiSDK VS Code 插件和 Eclipse 插件也均发布了 0.1.0 版本。目前这两个插件已集成了包管理器，支持软件包的查询、安装与卸载，以及虚拟环境和新闻等功能，希望能为使用不同 IDE 的开发者在工具链配置和环境管理上提供一些便利。

我们诚挚邀请您常来 [RuyiSDK 技术社区](https://ruyisdk.cn/) 交流想法，共同成长。

每一次版本的迭代，都离不开社区伙伴的反馈与贡献。下个版本计划在 1 月底与大家见面，让我们一起期待 RuyiSDK 在新的一年里带来更多惊喜吧！

## 包管理器

RuyiSDK 0.44 已于今日发布，对应的包管理器版本也为 0.44.0。您可前往以下位置之一下载 RuyiSDK 包管理器：

* [PyPI](https://pypi.org/project/ruyi/0.44.0/): `pip install ruyi`
* https://github.com/ruyisdk/ruyi/releases/tag/0.44.0
* https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.44.0/

> [!NOTE]
> RISC-V 用户可以使用 `pip` 安装 `ruyi`，但由于 `ruyi` 依赖的部分 Python
> 库暂未在 PyPI 上提供 RISC-V 架构的预编译包，安装 `ruyi` 时 Python
> 包管理器会尝试从源代码编译安装这些依赖，可能非常耗时或编译失败。
>
> 如果您在 RISC-V 设备上安装 `ruyi` 时遇到问题，建议使用其他安装方法。

> [!NOTE]
> 请注意：[已知][ruyi-pipx]使用 `pipx` 安装 `ruyi` 会导致随后创建的 Ruyi
> 虚拟环境不可用，将在下个版本修复。在此之前，请不要使用 `pipx` 安装 `ruyi`。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 遥测功能变更：
    * 修复了遥测模式为 `local` 时，主动进行的 `ruyi telemetry upload` 不生效的问题。
    * 出于 RuyiSDK 运营需要，如您的遥测模式为 `on` 且距离上次上传遥测数据至少 7 天，`ruyi`
      则会在您下一次调用时上传遥测数据，不论预定的上传日为星期几。
    * 出于 RuyiSDK 运营需要，如您在首次运行 `ruyi` 时选择了禁用数据收集与上传，`ruyi`
      仍然会进行一次上传，仅此一次，内容为不被保存的随机 ID 与当前 `ruyi` 版本号。
      如您不希望进行此类上传，请确保您使用 `ruyi` 前为其设置了环境变量 `RUYI_TELEMETRY_OPTOUT=1`。

对于低频使用 `ruyi` 的用户而言，本次更新包含的变更可能允许 RuyiSDK 团队就您的安装
ID 而言观测到比先前更具体的行为模式。截至目前 RuyiSDK 团队未进行过任何有关数据挖掘。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 新增设备支持：
    * Milk-V Megrez: 兼容 RockOS。感谢 [@weilinfox] 的贡献！
* 完善设备支持：
    * 重命名 RV32 的 `manual` profile（用于手工管理编译参数）为 `manual-rv32` 以避免与 RV64 同名 profile 冲突。感谢 [@Cyl18] [报告][issue149]！

[@Cyl18]: https://github.com/Cyl18
[@weilinfox]: https://github.com/weilinfox
[issue149]: https://github.com/ruyisdk/packages-index/issues/149
[ruyi-pipx]: https://github.com/ruyisdk/ruyi/issues/414

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK 基于VSCode 和 Eclipse 均开发了插件以集成 Ruyi 包管理器方便开发者在 IDE 中快速完成环境准备，VSCode 插件 0.1.0 版本和 Eclipse 插件 0.1.0 版本均于今日发布。您可前往以下位置之一下载：
* RuyiSDK VSCode Extension：
   * https://github.com/ruyisdk/ruyisdk-vscode-extension/releases/tag/0.1.0/
   * https://mirror.isrc.ac.cn/ruyisdk/ide/plugins/vscode/
* RuyiSDK Eclipse Plugins：
   * https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/v0.1.0/
   * https://mirror.isrc.ac.cn/ruyisdk/ide/plugins/eclipse/

**近期更新：**
   * VSCode 插件：
      - 优化虚拟环境模块的逻辑
      - 修复重复的命令
      - 发布beta1版本

   * Eclipse 插件：
      - 发布：准备版本 0.1.0 。
      - 菜单栏：在 "RuyiSDK" 下添加新闻和虚拟环境模块的入口。
      - 新闻：使较新的新闻位于更高位置。
      - 虚拟环境：可一键配置工具链到已打开的项目中。
      - 日志：为新闻和虚拟环境模块添加必要的日志。
      - 构建：修复第三方库缺失的问题；整理 .target 目标文件，为使用其他 IDE 开发本插件做初步准备。
      - 编码：使用现代 Java 的特性并统一类名、变量名等代码风格。

## GCC
修复了Zilsd扩展回归测试中发现的错误，更新了B扩展优化补丁。

## LLVM

- [[LLVM][XTHeadVector] Implement th.vwcvt\{u}.x.x.v](https://github.com/ruyisdk/llvm-project/pull/165)
- [[LLVM][XTHeadVector] fix vadd, vsub, vrsub masked intrinsics](https://github.com/ruyisdk/llvm-project/pull/166)

## V8
本期提交的patch：
1. **[riscv] Enable CanUseGenericJsToWasmWrapper** [RISCV] 启用 GenericJsToWasmWrapper 功能，节省Wasm Import function的调用开销（https://chromium-review.googlesource.com/c/7268664） 
2. **[riscv][heap] Make read-only MemoryChunk field conditionally optional** [RISCV][堆内存] 使能只读 MemoryChunk 字段的可选配置（https://chromium-review.googlesource.com/c/7271945） 
3. **[riscv] Skip message/wasm-debug-trace-minimal** [RISCV] 跳过 message/wasm-debug-trace-minimal 测试用例（https://chromium-review.googlesource.com/c/7274736） 
4. **[riscv64] Protect return addresses stored on stack.** [RISCV64] 保护存储在栈上的返回地址（https://chromium-review.googlesource.com/c/7039660）
5. **[riscv] Implement FP16 in simulator** [RISCV] 在模拟器中实现FP16（半精度浮点）功能（https://chromium-review.googlesource.com/c/7266607） 
6. **[riscv] Fix build failed on v8_unittests** [RISCV] 修复 v8_unittests 构建失败的问题（https://chromium-review.googlesource.com/c/7304885） 
7. **[Turbofan] optimize ChangeUint32ToUint64(BitcastFloat32ToUint32)** [Turbofan编译器] 优化 ChangeUint32ToUint64(BitcastFloat32ToUint32) 操作（https://chromium-review.googlesource.com/c/7271804） 
8. **[riscv][builtins] Refactor CallApiGetter builtin** [RISCV][内置函数] 重构 CallApiGetter 内置函数（https://chromium-review.googlesource.com/c/7274581）

本期审阅的patch：
1. **[maglev] Do not use condition flags on loong64 and riscv64** [Maglev编译器] 取消loong64和riscv64架构条件标志位在IR上的使用（https://chromium-review.googlesource.com/c/7273937）

## 版本测试及遗留问题

RuyiSDK 0.44.0 版本已通过[发版测试](https://gitee.com/yunxiangluo/ruyisdk-test/blob/master/20251222/README.md)。该版本测试是基于 0.44.0-beta.20251219 版本开展的，0.44.0
版本将基于 0.44.0-beta.20251219 版本代码发版。下面的表格记录了当前版本新增未修复缺陷：

| 缺陷      | 问题等级 |判定依据 |
| ----------- | ----------- | --- |
| [Occasional pygit2 failures during testing #415](https://github.com/ruyisdk/ruyi/issues/415) | 一般 | 已有 issue 回复 |

VSCode 插件版本测试基于 ruyisdk-vscode-extension [0.1.0](https://github.com/ruyisdk/ruyisdk-vscode-extension/releases/tag/0.1.0) 前的测试版本开展多轮手动测试，并以经过测试的
最新 commit 发版。下面的表格记录了当前版本新增待改进内容：

| 缺陷 | 问题等级 | 备注 |
| ----- | ----- | ----- |
| [激活虚拟环境时图标未正确显示 #94](https://github.com/ruyisdk/ruyisdk-vscode-extension/issues/94) | 建议 |  |
| [安装包时弹窗中的进度条不动 #95](https://github.com/ruyisdk/ruyisdk-vscode-extension/issues/95) | 建议 |  |
| [新闻的搜索功能中的使用id搜索应如何使用？ #96](https://github.com/ruyisdk/ruyisdk-vscode-extension/issues/96) | 建议 |  |

Eclipse 插件版本测试基于 ruyisdk-eclipse-plugins [v0.1.0](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/v0.1.0) 前的测试版本开展多轮手动测试，并以经过测试的
最新 [Continuous](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/continuous) tag 发版。下面的表格记录了当前版本新增待改进内容：

| 缺陷      | 问题等级 | 备注 |
| ----------- | ----------- | --- |
| [命令执行提示框可以任意关闭且无法重新打开 #82](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/82)   | 建议 |   |
| [开发板选择框中开发板型号未排序 #83](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/83) | 建议 |  |
| [虚拟环境建立的项目绑定问题 #84](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/84) | 建议 |  |
| [安装插件时 Eclipse 提示未签名 #85](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/85) | 建议 |  |
| [打开 Ruyi Package Explorer 时必须选择某款开发板 #86](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/86) | 建议 |  |
| [虚拟环境建立的 quirks 过滤问题 #87](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/87) | 建议 |  |
| [虚拟环境建立的 ruyi update 错误处理问题 #88](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/88) | 建议 |  |
| [虚拟环境建立的 profile 排序问题 #89](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/89) | 建议 |  |
| [有一些可以自动获取的东西，不需要手动填写 #90](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/90) | 建议 |  |
| [RuyiSDK IDE 主文档的更新 #123](https://github.com/ruyisdk/docs/issues/123) | 一般 | 已有修复计划 |

参与当前版本测试的实习生：

+ [@Cyl18](https://github.com/Cyl18)
+ [@YXCZS](https://github.com/YXCZS)
