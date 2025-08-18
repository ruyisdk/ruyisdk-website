---
authors: [jing, white, fox]
---
# 第 050 期·2025 年 08 月 12 日

## 卷首语

欢迎阅读第50期《RuyiSDK双周进展》！

本期，值得欣喜的是：`ruyi` 现已在 PyPI [同步发布](https://pypi.org/project/ruyi/)！您只需在 Python 环境中执行 `pip install ruyi` 命令，即可轻松安装 RuyiSDK 包管理器，开启您的 RISC-V 开发之旅。

如果您在使用过程中遇到任何问题，还可以通过以下方式获得支持：

- 参与 8月14日（周四）15:00 举办的 [第十一次 RuyiSDK Office Hours](https://github.com/ruyisdk/ruyisdk/discussions/19)，我们将提供在线答疑服务。

- 在 [ruyisdk.cn RuyiSDK](https://ruyisdk.cn/c/ruyisdk/9)板块 或者 [RuyiSDK GitHub 讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 留言交流。

根据当前规划，下一个开发版本将于 8月26日 发布，我们将持续优化功能体验，为大家带来更多惊喜。期待与您共同见证 RuyiSDK 的成长！

## 包管理器

RuyiSDK 0.39 对应的包管理器版本也为 0.39.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.39.0-gh]、[PyPI][ruyi-0.39.0-pypi] 或 [ISCAS 镜像源][ruyi-0.39.0-iscas]下载体验。

[ruyi-0.39.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.39.0
[ruyi-0.39.0-pypi]: https://pypi.org/project/ruyi/0.39.0/
[ruyi-0.39.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.39.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* `ruyi` 现已在 PyPI [同步发布](https://pypi.org/project/ruyi/)。只要您有 Python 环境，您就可以使用 `pip install ruyi` 或类似的命令安装 RuyiSDK 包管理器了。
* 如用户自定义了软件源 Git 仓库的存放路径，当该仓库当前分支的远端 URL 与 `ruyi` 的相应配置项不同时，`ruyi update` 会报错退出了，而不再将用户配置覆盖。
* 继续打磨 Shell 自动补全：
    * 优化了常规（非自动补全）模式下的 `ruyi` 启动延迟；
    * 如本地没有同步过软件源，不会在补全命令行时尝试同步了。
* 工程化迭代：
    * 现在会给每个 PR 进行端到端的集成测试了，以确保常规命令行使用方式不被破坏。
    * 将 Shell 自动补全脚本整合进了 `ruyi` 源码发行：位于 `contrib/shell-completions` 目录。发行版打包人员可进行集成了。
    * 为给 Ubuntu 22.04 LTS 打包做好准备：支持以 pytest 6.2.5 运行测试套件了。
    * 在构建 `ruyi` 的单文件发行版时，为 RISC-V 架构使用了预制的 `cffi` 与 `pygit2`，以节省构建时间。
    * 简化了 `ruyi` 的发版工作：支持了自助打 tag 并触发发版流程。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 更新软件包：
    * `source/milkv-duo-examples`: Milk-V Duo 示例代码，20241219 版本。
* 完善了设备支持：
    * Milk-V Meles（4/8/16G 变体）的 RevyOS U-Boot：补齐了上游版本。
    * Milk-V Pioneer、Milk-V Meles 的 RevyOS：补齐缺失版本
    * Sipeed LicheeRV Nano 的 buildroot SDK：补齐了上游版本。
* 工程化迭代：
    * 自动格式化了所有包版本描述，并以 CI 形式确保了新增的包遵循统一格式。

感谢 [@Cyl18]、[@weilinfox] 的贡献！

[@Cyl18]: https://github.com/Cyl18
[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
为了方便开发协作，RuyiSDK IDE 插件项目（[ruyisdk-eclipse-plugins](https://github.com/ruyisdk/ruyisdk-eclipse-plugins)） 近期进行了一些代码规范化改进，制定了[Java Code 规范指南](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/blob/main/docs/developer/coding-guidelines/index.md)，明确代码样式要求，并对部分代码进行了格式规范化调整。

此外，欢迎对Eclipse插件开发有兴趣的小伙伴加入开发团队，详情参考 [J159 RuyiSDK IDE 开发实习生](https://github.com/lazyparser/weloveinterns/blob/master/open-internships.md) ，期待您的加入。

## GCC

根据社区review建议，修复了部分指令的立即数编码问题，已同步至ruyisdk-binutils仓库

正在实现p扩展的gcc支持，预计本月底完成初步实现

## LLVM

根据社区的建议，在 XTHeadVector 拓展开启时一同开启 zfh 拓展，解决 intrinsic 遇到 float16 无法提升的问题。
- xtheadvector: [LLVM][XTHeadVector] xtheadvector implies zfh by default: https://github.com/ruyisdk/llvm-project/pull/162

## V8
PLCT 提交并合入的代码：

1. **Add Kasper Lund to RISC-V owners list**  
   将 RIVOS 贡献者（V8 创始阶段参与者之一）Kapser 加入 V8 RISCV 后端维护者列表  
   [chromium-review.googlesource.com/c/6826483](https://chromium-review.googlesource.com/c/6826483)

2. **[riscv] Optimize SignExtend Opcode emit**  
   优化 SignExtend 操作码的生成  
   [chromium-review.googlesource.com/c/6774564](https://chromium-review.googlesource.com/c/6774564)

3. **[risc-v] Use sign-extension (via sext.w) to replace slliw when the shift amount is zero**  
   当移位量为零时（即 slliw rd, rs, 0），使用符号扩展（通过 sext.w）替代 slliw，使代码更规范  
   [chromium-review.googlesource.com/c/6726075](https://chromium-review.googlesource.com/c/6726075)

4. **[riscv][wasm][growable-stacks] Record missing safepoint entry**  
   实现 wasm 可增长栈功能，记录缺失的安全点入口  
   [chromium-review.googlesource.com/c/6808523](https://chromium-review.googlesource.com/c/6808523)

5. **[riscv][wasm][jspi][sandbox] Avoid writes to StackMemory from sandboxed code**  
   避免沙箱代码对栈内存进行写入  
   [chromium-review.googlesource.com/c/6808522](https://chromium-review.googlesource.com/c/6808522)

6. **[riscv] Optimize Change [Truncate] and Change [SignExtend] IR emit.**  
   优化 Change [Truncate] 和 Change [SignExtend] 的中间表示（IR）生成  
   [chromium-review.googlesource.com/c/6795158](https://chromium-review.googlesource.com/c/6795158)

7. **[riscv] Optimize emit of sext.w when CompareZero/WordShl/Word32Shr/Word32Sar**  
   在 CompareZero/WordShl/Word32Shr/Word32Sar 时优化 sext.w 的生成  
   [chromium-review.googlesource.com/c/6780050](https://chromium-review.googlesource.com/c/6780050)

PLCT 审核并合入的代码：

1. **[riscv][maglev] Fix compilation**  
   修复 maglev 新特性引起的编译问题  
   [chromium-review.googlesource.com/c/6831542](https://chromium-review.googlesource.com/c/6831542)

2. **[riscv] Handle indirect pointer slots when recording writes**  
   记录写入操作时处理间接指针槽  
   [chromium-review.googlesource.com/c/6818368](https://chromium-review.googlesource.com/c/6818368)

3. **[riscv] Clean up MacroAssembler::StoreReturnAddressAndCall**  
   整理 MacroAssembler::StoreReturnAddressAndCall 方法  
   [chromium-review.googlesource.com/c/6818339](https://chromium-review.googlesource.com/c/6818339)

4. **[riscv] Restore status registers after tests**  
   在测试后恢复状态寄存器  
   [chromium-review.googlesource.com/c/6827265](https://chromium-review.googlesource.com/c/6827265)

5. **[riscv] Fail in the simulator if the vector unit wasn't initialized**  
   若向量单元未初始化则使模拟器运行失败  
   [chromium-review.googlesource.com/c/6826963](https://chromium-review.googlesource.com/c/6826963)

6. **[riscv] Fix load-transforms to setup the vector unit first**  
   修复加载转换以先设置向量单元  
   [chromium-review.googlesource.com/c/6826962](https://chromium-review.googlesource.com/c/6826962)

7. **[riscv] Fix duplicated comment**  
   修复重复的注释  
   [chromium-review.googlesource.com/c/6827141](https://chromium-review.googlesource.com/c/6827141)

8. **[riscv] Implement register constraints for more operations**  
   为更多操作实现寄存器约束  
   [chromium-review.googlesource.com/c/6760111](https://chromium-review.googlesource.com/c/6760111)

9. **[riscv] Don't use kSimd128RegZero in the code-generator**  
   在代码生成器中不使用 kSimd128RegZero，避免当 kSimd128RegZero 未正确初始化时产生错误  
   [chromium-review.googlesource.com/c/6760119](https://chromium-review.googlesource.com/c/6760119)

10. **[riscv] Avoid unnecessary moves**  
    避免不必要的 move 操作  
    [chromium-review.googlesource.com/c/6760118](https://chromium-review.googlesource.com/c/6760118)

11. **[riscv] Use register constraints for I8x16Shuffle**  
    为 I8x16Shuffle 使用寄存器约束  
    [chromium-review.googlesource.com/c/6760117](https://chromium-review.googlesource.com/c/6760117)

12. **[riscv] Avoid temp and unique registers for ExtAddPairwise**  
    为 ExtAddPairwise 避免使用临时和唯一寄存器  
    [chromium-review.googlesource.com/c/6760116](https://chromium-review.googlesource.com/c/6760116)

13. **[riscv] Remove register uniqueness constraints for some instructions**  
    移除部分指令的寄存器唯一性约束  
    [chromium-review.googlesource.com/c/6760115](https://chromium-review.googlesource.com/c/6760115)

14. **[riscv] Avoid unique register in VisitRRIR**  
    在 VisitRRIR 中避免使用唯一寄存器  
    [chromium-review.googlesource.com/c/6760114](https://chromium-review.googlesource.com/c/6760114)

15. **[riscv] Add register constraints**  
    添加寄存器约束，简化 codegen 逻辑  
    [chromium-review.googlesource.com/c/6760110](https://chromium-review.googlesource.com/c/6760110)

16. **[riscv] Move forward declarations of Set Hi20/Lo12 Offset**  
    移动 Set Hi20/Lo12 Offset 的前置声明  
    [chromium-review.googlesource.com/c/6760071](https://chromium-review.googlesource.com/c/6760071)

17. **[riscv] Implement register constraints for I32x4DotI8x16I7x16AddS**  
    为 I32x4DotI8x16I7x16AddS 实现寄存器约束  
    [chromium-review.googlesource.com/c/6760113](https://chromium-review.googlesource.com/c/6760113)

18. **[riscv] Implement more register constraints**  
    实现更多 opcode 代码生成的寄存器约束  
    [chromium-review.googlesource.com/c/6760112](https://chromium-review.googlesource.com/c/6760112)


## 操作系统支持矩阵

- 支持矩阵
   - [Dump RT-Thread@DuoS: 5.2.0->5.2.1](https://github.com/ruyisdk/support-matrix/pull/346)
   - [fix dead link for deepin](https://github.com/ruyisdk/support-matrix/pull/347)
   - [metadata: use vendor to mark board manufacturer](https://github.com/ruyisdk/support-matrix/pull/348)
   - [LicheePi4A: Add openEuler RISC-V 24.03 LTS-SP2 test report (good).](https://github.com/ruyisdk/support-matrix/pull/349)
   - [docs(treewide): unify case of distro names & fix typo](https://github.com/ruyisdk/support-matrix/pull/351)
   - [LiP3A: Add irradium test report (good).](https://github.com/ruyisdk/support-matrix/pull/352)
- 前端网站
   - [修复测试报告页面跳转](https://github.com/QA-Team-lo/support-matrix-frontend/commit/0a70f776a25579f6b5e3723516873dd4a626145e)
   - [修复系统表格排版](https://github.com/QA-Team-lo/support-matrix-frontend/commit/a076852f3d21cdd70ef1c3589ee6f0a269a82041)
