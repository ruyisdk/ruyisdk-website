# 第 056 期·2025 年 11 月 18 日

## 卷首语
各位 RuyiSDK 的小伙伴们，大家好！欢迎阅读第 56 期《RuyiSDK 双周进展》！

本期，开发团队的主要工作集中在以下几个方面：

- 为加强 ruyi 的质量保障，覆盖更多常见及特殊使用场景，我们正在为其构建一套集成测试套件。

- 持续扩展 packages-index，增加对更多 RISC-V 设备的支持。

- IDE 插件的功能开发与优化也在同步进行中，目前第一版 VSCode 插件已开始进入内部测试。

下个版本计划在 11 月 25 发布，敬请期待！也欢迎大家随时来 [RuyiSDK 技术社区](https://ruyisdk.cn/) 交流想法、提出建议～

## 包管理器

由于 RuyiSDK 发版周期调整，RuyiSDK 包管理器的 0.43.0
版本预期将在 11 月底正式发布。您仍可通过以下渠道下载 RuyiSDK 包管理器的 0.42.0 版本：

* [PyPI][ruyi-0.42.0-pypi]: `pip install ruyi`
* [GitHub Releases][ruyi-0.42.0-gh]
* [ISCAS 镜像源][ruyi-0.42.0-iscas]

[elexcon]: https://www.elexcon.com/
[ruyi-0.42.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.42.0
[ruyi-0.42.0-pypi]: https://pypi.org/project/ruyi/0.42.0/
[ruyi-0.42.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.42.0/

RuyiSDK 团队仍在常态化维护 RuyiSDK 软件源。如您已有 RuyiSDK 包管理器了，您可通过 `ruyi update` 获取近两周的更新：我们保证这些内容兼容 RuyiSDK 包管理器的近 3 个正式版本。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 新增软件包：
    * `source/riscv-gnu-toolchain-plct`: `toolchain/gnu-plct` 的源码仓库集合。
* 新增设备支持：
    * Milk-V Jupiter: 兼容各类 Bianbu 镜像。
    * Sipeed LicheePi 3A: 兼容各类 Bianbu 镜像。
    * SpacemiT MUSE Book: 兼容各类 Bianbu 镜像。
    * SpacemiT MUSE Box: 兼容各类 Bianbu 镜像。
    * 香山南湖笔记本: 兼容 RedleafOS。
* 完善了设备支持：
    * 移除 Pine64 Star64 的 Armbian 支持: 上游已停止维护并不再提供系统镜像下载。
    * 适用各类 SpacemiT K1 设备的 Bianbu Desktop 与 Bianbu Minimal: 新增适用于 eMMC 存储设备的镜像。
    * 新增适用各类 SpacemiT K1 设备的 Bianbu Desktop Lite。

感谢 [@weilinfox] 的贡献！

[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

**VS Code插件：**
 - 添加解压 source 功能
 - 添加下载进度
 - 添加虚拟环境管理图形化入口
 - 将配置项（Ruyi 包管理器目录、遥测信息）移动至插件设置
 - 交付测试团队准备上架 vscode marketplace

**Eclipse 插件：**
 - 引入 CI 检查 DCO 规范并在 GitHub Pages 自动发布插件
 - 重构插件目录、优化现有文档
 - 解决 Eclipse SDK IDE 中的开发、调试问题

## GCC
修复了回归测试中发现的一些BUG，对仓库说明文档添加了中文支持，对Binutils测试模块进行了更新。

## V8
提交并合入的patch：
1. **[riscv][wasm][liftoff][growable-stacks] Do not change cache state in branch**  
   [RISC-V][WebAssembly][Liftoff编译器][可增长栈] 不在分支中修改缓存状态（https://chromium-review.googlesource.com/c/7123119）
2. **[riscv][cctest] Make max_heap_size larger in cctest/SetStackLimitInThreadAndStackOverflow**  
   [RISC-V][C++测试] 增大 cctest/SetStackLimitInThreadAndStackOverflow 中的最大堆大小（https://chromium-review.googlesource.com/c/7123484）
3. **[riscv][simulator] Only use read/write mutexes if we're multithreaded**  
   [RISC-V][模拟器] 仅在多线程场景下使用读写互斥锁（https://chromium-review.googlesource.com/c/7116238）
4. **[riscv][maglev] Cache the DataView's byteLength for the bounds check**  
   [RISC-V][Maglev编译器] 缓存 DataView 的 byteLength 用于边界检查（https://chromium-review.googlesource.com/c/7129740）
5. **[riscv] Fix native build failed**  
   [RISC-V] 修复原生构建失败问题（https://chromium-review.googlesource.com/c/7090433）
6. **[riscv] Use normal fp semantics in JSEntry**  
   [RISC-V] 在 JSEntry 中使用标准浮点语义（https://chromium-review.googlesource.com/c/7130358）
7. **[riscv] Catch wasm mem trap in amoswap**  
   [RISC-V] 在 amoswap 指令中捕获 WebAssembly 内存陷阱（https://chromium-review.googlesource.com/c/7144820）
8. **[riscv] Use amo instr in codegen**  
   [RISC-V] 在代码生成中使用 amo 系列指令（https://chromium-review.googlesource.com/c/7138845）
9. **[riscv][maglev] No implicit Float64 \<=> HoleyFloat64 conversion**
   [RISC-V][Maglev编译器] 不允许 Float64 与 HoleyFloat64 的隐式转换（https://chromium-review.googlesource.com/c/7149258）
10. **[riscv] Enable v8_enable_external_code_space**  
    [RISC-V] 启用 v8_enable_external_code_space（外部代码空间）功能（https://chromium-review.googlesource.com/c/7149198）
11. **[riscv] Fix missing AccessModeField encode**  
    [RISC-V] 修复缺失的 AccessModeField 编码逻辑（https://chromium-review.googlesource.com/c/7154551）
12. **[maglev][riscv] Replace the DataViewElementOperand with StoreDataViewElement/LoadDataViewElement**  
    [Maglev编译器][RISC-V] 将 DataViewElementOperand 替换为 StoreDataViewElement/LoadDataViewElement（https://chromium-review.googlesource.com/c/7155968）

审阅并合入的patch：
1. **[riscv] Fix deoptimization failure due to register clobbering**  
   [RISC-V] 修复因寄存器被破坏导致的去优化失败问题（https://chromium-review.googlesource.com/c/7139894）
2. **[riscv] Fix kIndirectPointer issue in store node selection**  
   [RISC-V] 修复存储节点选择中 kIndirectPointer 相关问题（https://chromium-review.googlesource.com/c/7123745）
3. **[riscv] Fix loading of is_marking_flag**  
   [RISC-V] 修复 is_marking_flag 的加载逻辑（https://chromium-review.googlesource.com/c/7126739）
4. **[riscv] Fix loading of ParameterCount**  
   [RISC-V] 修复 ParameterCount 的加载逻辑（https://chromium-review.googlesource.com/c/7134140）
5. **[riscv] Add right shift to extract the true ExternalPointerTag**  
   [RISC-V] 添加右移操作以提取真实的 ExternalPointerTag（https://chromium-review.googlesource.com/c/7123565）  
6. **[riscv] Use ToSimd128Register directly.**  
   [RISC-V] 直接使用 ToSimd128Register 方法（https://chromium-review.googlesource.com/c/7137621）
7. **[riscv] Use tail-undisturbed and avoid overwriting inputs**  
   [RISC-V] 采用RVV的tail-undisturbed模式，避免覆盖输入数据（https://chromium-review.googlesource.com/c/6989490）
8. **[riscv] Fix uintptr_t format specifiers in simulator**  
[RISC-V] 修复模拟器中 uintptr_t 类型的格式说明符问题（https://chromium-review.googlesource.com/c/7117264）
