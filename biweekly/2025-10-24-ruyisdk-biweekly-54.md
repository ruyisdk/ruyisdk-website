# 第 054 期·2025 年 10 月 24 日

## 卷首语

各位 RuyiSDK 的小伙伴们，大家好！

欢迎阅读第 54 期《RuyiSDK 双周进展》！

经过多轮测试和打磨，RuyiSDK 0.42.0 终于和大家见面了！这个版本带来了多项重要改进，让您的使用体验更加顺畅和贴心。

我们特别关注了用户隐私和系统集成的需求，将遥测功能的默认模式调整为 local。现在，所有数据都会在本地记录，只有您主动选择时才会上传（请放心，所有数据均经过匿名化处理）。同时，首次运行 ruyi 时会贴心地询问您的数据收集偏好，帮您完成配置。

为了让大家的工作目录更加整洁，我们优化了 ruyi extract 命令的默认行为，现在会自动创建以软件包名和版本命名的独立目录。命令行界面也进行了多项细节优化，为您带来更友好的交互体验。

IDE 插件的开发团队也迎来了新成员，相关工作正在积极推进中，敬请期待！

由于一些变化，操作系统支持矩阵章节将从本期起移出双周进展的同步内容。关注该项目的小伙伴可以前往 [support-matrix 仓库](https://github.com/ruyisdk/support-matrix/) 关注其最新动态。

**【重要通知】从本期开始，我们将调整版本发布节奏，从双周发布改为月度发布。** 这能让我们有更充裕的时间进行深度测试、完善功能细节并提升整体质量，力求为每一位用户带来更稳定、更完善的使用体验。

下个版本计划在 11 月下旬发布（默认每月最后一周的周二），敬请期待！也欢迎大家随时来 [RuyiSDK 技术社区](https://ruyisdk.cn/)交流想法、提出建议～

## 包管理器

RuyiSDK 0.42 对应的包管理器版本也为 0.42.0，已于 10 月 24 日发布。您可移步
[PyPI][ruyi-0.42.0-pypi]、[GitHub Releases][ruyi-0.42.0-gh] 或 [ISCAS 镜像源][ruyi-0.42.0-iscas]下载体验。

* [PyPI][ruyi-0.42.0-pypi]: `pip install ruyi`
* [GitHub Releases][ruyi-0.42.0-gh]
* [ISCAS 镜像源][ruyi-0.42.0-iscas]

[ruyi-0.42.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.42.0
[ruyi-0.42.0-pypi]: https://pypi.org/project/ruyi/0.42.0/
[ruyi-0.42.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.42.0/

> [!NOTE]
> RISC-V 用户可以使用 `pip` 安装 `ruyi`，但由于 `ruyi` 依赖的部分 Python
> 库暂未在 PyPI 上提供 RISC-V 架构的预编译包，安装 `ruyi` 时 Python
> 包管理器会尝试从源代码编译安装这些依赖，可能非常耗时或编译失败。
>
> 如果您在 RISC-V 设备上安装 `ruyi` 时遇到问题，建议使用其他安装方法。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 默认遥测模式现已变更为 `local`——收集数据但不会自动上传。
    * 相应地，在终端界面首次运行 `ruyi` 时，`ruyi` 会询问您的数据收集偏好，并帮您写入用户配置文件。
* `ruyi extract` 命令的默认行为变更与其他改进：
    * `ruyi extract` 现在会将所请求的软件包内容解压到以软件包名、版本命名的独立目录下了。之前会直接解压到当前工作目录，如用户不提前阅读文档，可能会将用户的目录弄乱。如仍然需要先前的行为，可传入新增的 `--extract-without-subdir` 选项。
    * `ruyi extract` 现在支持 `--dest-dir` 或 `-d` 选项，以便指定解压到非当前工作目录的其他目录了。
    * `ruyi extract` 也新增了 `--fetch-only` 或 `-f` 选项，与 `ruyi install` 相应选项保持一致。
* 打磨了命令行用户体验：
    * 在受支持的终端下，`ruyi` 会把重要的手工操作用红色加粗样式体现了。
    * 首次运行 `ruyi` 前，当您尝试命令行自动补全时，不会错误地打印出提示信息了。
    * 用来下载软件包但不安装或解压的 `ruyi install -f` 现在支持下载源码类型的软件包了。
    * 若用户下载了 `ruyi` 的单二进制文件发行版，但忘记将其重命名为 `ruyi`，`ruyi` 会在运行时提醒用户这么做了。
* 修复了一些问题：
    * 当 `repo.local` 的值为空字符串或与默认值相等时，不会被判定为自定义了软件源本地路径了。
    * 修复了自动管理软件源远程分支时，变更了 `repo.remote` 之后需要两次 `ruyi update` 才会体现的问题。
    * `ruyi clean --all` 不会残留软件包安装状态记录了。
    * 不再允许使用用户配置文件去覆盖那些不面向用户的配置项了。
* 更新了文档：
    * 写明了 `ruyi` 配置文件的系统全局搜索路径，供打包人员、系统管理员等参考。感谢 [@bkmgit] 的贡献！
* 工程化迭代：
    * `ruyi` 对 `packaging` 的依赖已不再必要，将于 0.43.0 版本移除。届时请打包人员更新依赖声明。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 实体数据库更新：
    * Ruyi 虚拟环境所用的 profiles 现已通过 `profile-v1` 实体类型暴露，如 `profile-v1:generic`。
* 工程化迭代：
    * 修复了一些第三方软件源镜像地址的配置问题。感谢 [@weilinfox] 的贡献！

[@bkmgit]: https://github.com/bkmgit
[@weilinfox]: https://github.com/weilinfox

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

**VSCode 插件：** ：
- 新增 ruyi.news 命令：在 VS Code 左侧栏显示新闻，支持内容筛选和搜索
- 新增 ruyi.packages 命令：在 VS Code 内直接查看、安装、卸载 Ruyi 管理的软件包
- 新增首页模块: 为用户提供各功能导航
- 改良 ruyi.detect 和 ruyi.install 命令: 支持通过 pipx 安装的 Ruyi
- 改良 ruyi.install 命令: 在安装 Ruyi 后重新载入窗口
- 添加 CI: 自动化构建插件
- 优化代码结构，更新依赖，更新 linter

**Eclipse 插件：**
Eclipse 插件开发恢复！欢迎对Eclipse插件开发有兴趣的小伙伴加入开发团队，详情参考 [J159 RuyiSDK IDE 开发实习生](https://github.com/lazyparser/weloveinterns/blob/master/open-internships.md) ，期待您的加入。

## GCC
修复了RUYISDK-GCC回归测试中发现的一些问题，更新了RVP 0.9.11版本的支持，对部分ABI引起的冲突进行了解决。

## V8
**PLCT提交并合入的patch：**
1. **[riscv] Implement Zicfiss for simulator**  
   [RISC-V] 为模拟器实现 Zicfiss 扩展  
   [chromium-review.googlesource.com/c/6987768](https://chromium-review.googlesource.com/c/6987768)
2. **[riscv] Refactor the DEBUG_RISCV to support dumping log to a file.**  
   [RISC-V] 重构 DEBUG_RISCV 以支持将日志转储到文件  
   [chromium-review.googlesource.com/c/6979424](https://chromium-review.googlesource.com/c/6979424)
3. **[riscv] zicfiss assembler and disassembler**  
   [RISC-V] Zicfiss 扩展的汇编器和反汇编器  
   [chromium-review.googlesource.com/c/6978248](https://chromium-review.googlesource.com/c/6978248)
4. **[riscv][deopt] Change deopt entries into builtins**  
   [RISC-V][反优化] 将反优化入口转换为内置函数  
   [chromium-review.googlesource.com/c/7000607](https://chromium-review.googlesource.com/c/7000607)

**审阅并合入的patch：**
1. **[riscv][maglev/turbolev] Optimize Math.max/min Float64 cases**  
   [RISC-V][Maglev/Turbolev] 优化 Math.max/min 的 Float64 场景  
   [chromium-review.googlesource.com/c/7066840](https://chromium-review.googlesource.com/c/7066840)
2. **[riscv][wasmfx] Implement suspend instruction**  
   [RISC-V][wasmfx] 实现 suspend 指令  
   [chromium-review.googlesource.com/c/7045130](https://chromium-review.googlesource.com/c/7045130)
3. **[riscv] Remove inactive owners**  
   [RISC-V] 移除不活跃的所有者  
   [chromium-review.googlesource.com/c/6905229](https://chromium-review.googlesource.com/c/6905229)
4. **[riscv] Preserve signalling NaNs for float32.**  
   [RISC-V] 保留 float32 类型的信号 NaN  
   [chromium-review.googlesource.com/c/6973906](https://chromium-review.googlesource.com/c/6973906)


## 版本测试及遗留问题

RuyiSDK 0.42.0 版本已通过[发版测试](https://gitee.com/yunxiangluo/ruyisdk-test/blob/master/20251020/README.md)。该版本测试是基于 0.42.0-alpha.20251013、 0.42.0-beta.20251015 和 0.42.0-beta.20251017 三个测试版本开展的，预期 0.42.0
版本将基于 0.42.0-beta.20251017 版本代码发版。下面的表格记录了 0.42.0-beta.20251017 版本新增未修复缺陷：

| 缺陷      | 问题等级 |判定依据 |
| ----------- | ----------- | --- |
| [A large number of old revyos images were deleted #116](https://github.com/ruyisdk/packages-index/issues/116) | 一般 | 软件自带修复功能，预期将在 0.43.0 版本前修复 |

由于 RevyOS 删除大量历史版本镜像，导致 RevyOS 上游、操作系统支持矩阵和 Ruyi 包管理器软件源两两均不对应。
已经确认修复细节，并定于 0.43.0 版本前修复。

同时可以参考下面的表格来跟踪历史遗留问题的修复进度：

| 缺陷      | 问题等级 | 备注 |
| ----------- | ----------- | --- |
| [关于 fastboot 的文档提示 #95](https://github.com/ruyisdk/docs/issues/95)   | 严重 | 建立新的 [issue](https://github.com/ruyisdk/ruyisdk/issues/52) 进行更新，且已拟订相关修复版本号为 0.43.0 版本  |
| [关于使用 pip 安装 ruyi 的文档提示 #96](https://github.com/ruyisdk/docs/issues/96)   | 严重 | 已有文档整体更新计划，已有具体时间节点和时间表安排  |
| [有一部分包无法下载 #37](https://github.com/ruyisdk/packages-index/issues/37)     | 一般 | 已有相关 issue 回复且已经在修复中 |
| [BananaPi BPI-F3 eMMC storage variant did not refer to any combo #101](https://github.com/ruyisdk/packages-index/issues/101)     | 一般 | 软件自带修复功能，且已有相关 issue 回复 |

这些遗留问题并不会影响 Ruyi 包管理器核心功能的实现，但可能影响用户体验，故建议在下载和更新您的 Ruyi 包管理器版本前了解。其中 packages-index 相关问题将主要影响 ``ruyi device provision`` 功能，请不要使用 ``BananaPi BPI-F3`` 开发板的
 ``BananaPi BPI-F3 (eMMC storage)`` 镜像和 ``Pine64 Star64`` 开发板的 ``Armbian for Pine64 Star64`` 镜像，相关缺陷修复后可以通过 ``ruyi update`` 解决。
