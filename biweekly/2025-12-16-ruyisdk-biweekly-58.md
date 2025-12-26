# 第 058 期·2025 年 12 月 16 日

## 卷首语
各位 RuyiSDK 的小伙伴们，大家好！

本周我们迎来一场线下之约：[RISC-V校园行活动](https://ruyisdk.cn/t/topic/2211)将于2025年12月17日下午在 **上海海事大学（临港校区）** 举办，欢迎上海的小伙伴们前来交流学习 ！

线上生态同样精彩：IDE插件即将发布，软件源持续为更多设备提供支持，V8项目也获得了RISE基金会的关注。这些成就都离不开社区的每一位贡献者。感谢大家的参与和反馈，我们诚挚邀请您常来 [RuyiSDK 技术社区](https://ruyisdk.cn/) 交流想法，共同成长 。

下个版本计划在 12 月 30 发布，敬请期待！

## 包管理器

由于 RuyiSDK 发版周期调整，RuyiSDK 包管理器的 0.44.0
版本预期将在 12 月底正式发布。您仍可通过以下渠道下载 RuyiSDK 包管理器的 0.43.0 版本：

* [PyPI][ruyi-0.43.0-pypi]: `pip install ruyi`
* [GitHub Releases][ruyi-0.43.0-gh]
* [ISCAS 镜像源][ruyi-0.43.0-iscas]

[ruyi-0.43.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.43.0
[ruyi-0.43.0-pypi]: https://pypi.org/project/ruyi/0.43.0/
[ruyi-0.43.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.43.0/

RuyiSDK 团队仍在常态化维护 RuyiSDK 软件源。如您已有 RuyiSDK 包管理器了，您可通过 `ruyi update` 获取近两周的更新：我们保证这些内容兼容 RuyiSDK 包管理器的近 3 个正式版本。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 新增设备支持：
    * Milk-V Megrez: 搭载使用 SiFive P550 微架构的 ESWIN EIC7700X CPU，兼容各类 RockOS 镜像。
* 完善了设备支持：
    * OpenBSD: 更新到 7.8。
    * FreeBSD Mini Live: 更新到 15.0。
    * Milk-V Pioneer 的 RevyOS: 更新到 20251115。
    * SiFive Unmatched 的 OpenWrt: 更新到 24.10.4。
    * Sipeed Laptop 4A 的 RevyOS: 更新到 20251115。
    * Sipeed LicheePi 4A 的 RevyOS: 更新到 20251115。
    * Sipeed LicheePi Console 4A 的 RevyOS: 更新到 20251115。
    * Sipeed LicheeRV Nano 的 Buildroot SDK: 更新到 20251202。
    * Sipeed Meles 的 RevyOS: 更新到 20251115。

感谢 [@weilinfox] 的贡献！

[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
**VSCode 插件：**

- 添加 Release CI
- 预发布 1.0 版本

**Eclipse 插件：**
 - 将依赖库交由 Maven 管理，清理不需要的项目文件。
 - 添加并测试“虚拟环境”模块。
 - 进行发布前的测试。
 
## GCC
更新P扩展支持至018版本，正在修复gcc15.2回归测试中出现的问题。

## V8
本期亮点：
1. RISE基金会官网报道了V8的最新进展: https://riseproject.dev/2025/12/09/a-glimpse-into-v8-development-for-risc-v/

本期提交的patch：
1. **[riscv] rename x0 to tmp1 in ByteSwap**  
   [RISC-V] 在ByteSwap中将x0重命名为tmp1（https://chromium-review.googlesource.com/c/7220250）
2. **[frames] Track stack frame iteration depth in StackFrameIterator**  
   [栈帧实现] 在StackFrameIterator中跟踪栈帧迭代深度（https://chromium-review.googlesource.com/c/7206634）
3. **[riscv][maglev] Fix clobbering the data view length**  
   [RISC-V][Maglev编译器] 修复数据视图长度被覆盖的问题（https://chromium-review.googlesource.com/c/7250928）
4. **[riscv][maglev] Materialize undefined for undefined nan on exception**  
   [RISC-V][Maglev编译器] 针对异常场景下未定义的NaN，显式生成undefined值（https://chromium-review.googlesource.com/c/7252469）
5. **[riscv][wasmfx] Support return values in stack wrapper**  
   [RISC-V][WebAssemblyFx扩展] 在栈包装器中支持返回值（https://chromium-review.googlesource.com/c/7255074）
6. **[riscv][api] Flatten v8::FunctionCallbackInfo\<T>**
   [RISC-V][API] 扁平化v8::FunctionCallbackInfo\<T>结构（https://chromium-review.googlesource.com/c/7259655）

本期审阅的patch：
1. **[riscv] Change 'zextw + add' to 'add.uw'**  
   [RISC-V] 将“zextw + add”组合操作改为“add.uw”指令（https://chromium-review.googlesource.com/c/v8/v8/+/7255075）
