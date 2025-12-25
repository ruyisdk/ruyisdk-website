# 第 055 期·2025 年 11 月 04 日

## 卷首语
小伙伴们是不是在期待新的版本？按照我们上期公布的月度发版策略，下一个版本计划于 11 月 25 日与大家见面，我们的双周进展汇报仍会保持原有节奏，持续为大家同步最新动态。

目前，开发团队正在全力推进各项开发工作：

- 为加强 ruyi 的质量保障，覆盖更多常见及特殊使用场景，我们正在为其构建一套集成测试套件。

- 持续扩展 packages-index，增加对更多 RISC-V 设备的支持。

- IDE 插件的功能开发与优化也在同步进行中，我们期望能在年底为大家提供一个初步版本进行体验。

感谢大家的持续关注与支持，我们将继续努力，为大家带来更稳定、更强大的开发体验！

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

* 完善了设备支持：
    * Milk-V Meles 的 RevyOS: 更新到 20251025 版本。
    * Milk-V Pioneer 的 RevyOS: 更新到 20251030 版本。
    * Sipeed Laptop 4A 的 RevyOS: 新增支持，最新版本为 20251025。
    * Sipeed LicheePi 4A 的 RevyOS: 更新到 20251025 版本。
    * Sipeed LicheePi Console 4A 的 RevyOS: 更新到 20251025 版本。

感谢 [@weilinfox] 的贡献！

[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。


## IDE

**VSCode 插件：**
- 新闻:
  - 将新闻缓存到本地供离线查看
  - 新闻列表可手动刷新
  - 新闻列表由树状改为卡片式
- 虚拟环境:
  - 创建新的虚拟环境
  - 管理当前激活的虚拟环境
  - 删除虚拟环境
  - 发现已存在的虚拟环境
- 遥测: 提供配置选项
- 管理 Ruyi:
  - 检查 Ruyi 版本更新
  - 提供多种安装 Ruyi 的方式
- 优化代码结构，更新依赖，更新 linter

**Eclipse 插件：**
- 支持构建包含 RuyiSDK 插件的 RuyiSDK IDE

## GCC
更新了RVP测试中发现的构建问题，修复了zpsfoperand命名不一致的问题

## LLVM

Upstream:
- [LLDB][Editline] empty current line before el_wgets 
 lldb (https://github.com/llvm/llvm-project/pull/165830)
- [LLDB][DWARF] Use the same qualified name computation for Rust 
 lldb (https://github.com/llvm/llvm-project/pull/165840)

## V8
**提交的patch：**
1. **[riscv] Fix incorrect check supports_wasm_simd_128**  
   [RISC-V] 修复 supports_wasm_simd_128 的错误检查逻辑（https://chromium-review.googlesource.com/c/v8/v8/+/7087478）
2. **[riscv][simulator] Only use read/write mutexes if we're multithreaded**  
   [RISC-V][模拟器] 仅在多线程场景下使用读写互斥锁（https://chromium-review.googlesource.com/c/v8/v8/+/7116238）
3. **[riscv] Fix native build failed**   
   [RISC-V] 修复原生构建失败问题（https://chromium-review.googlesource.com/c/v8/v8/+/7090433）
