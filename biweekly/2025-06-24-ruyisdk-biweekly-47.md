---
authors: [jing, white, fox]
---
# 第 047 期·2025 年 06 月 24 日

## 卷首语
欢迎阅读第47期《RuyiSDK双周进展》！包管理器已更新新版本，欢迎下载试用。如果您在 RuyiSDK 的使用中遇到问题，欢迎参加每双周四下午 15:00 开展的 [“RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务（下一次在7月3日），也可以在 [RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈。

下个开发版本计划7月8日发布，我们将持续带来更多改进。

## 包管理器

RuyiSDK 0.36 对应的包管理器版本也为 0.36.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.36.0-gh] 或 [ISCAS 镜像源][ruyi-0.36.0-iscas]下载体验。

[ruyi-0.36.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.36.0
[ruyi-0.36.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.36.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 每次 `ruyi update` 完成后，会报告哪些已安装的软件包有更新版本可供安装了。考虑到具体项目对工具链版本的需求可能较为精确，您可自行 `ruyi install` 更新的版本，并自行重做相应的虚拟环境。
* 可以用 `ruyi uninstall` 卸载已安装的软件包了。另有更简短的别名 `ruyi remove` 或 `ruyi rm` 可用。
* 在 `ruyi list` 的输出中，可以看到软件包的安装文件是否完全下载了。
* 在同时启用机读模式（porcelain mode）与调试输出（`RUYI_DEBUG=y`）时，最先输出的几条日志不会以错误格式输出了。
* 优化了 `ruyi` 工具的启动速度，现在每次运行 `ruyi` 都能省下 200-300ms 时间（视机器性能而定），有助于后续实现低延迟的命令行补全特性。并以 CI 检查的方式确保了后续代码变更不会影响本次优化效果。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 更新了 `toolchain/gnu-plct`：由 PLCT 维护并构建的 GNU RISC-V 工具链，包含 GNU binutils 2.45 的预览版、GCC 15.1.0 以及 glibc 2.40。
* 更新了实体数据库中的 RISC-V 微架构定义，新增以下微架构：
    * 香山昆明湖
    * 玄铁 C908、C908V、C910V2、C920、C920V2
    * MIPS P8700
    * 8-宽 Tenstorrent Ascalon
* 修正了玄铁 C910 的 RISC-V ISA 字符串为上游主线 GCC 接受的标准形式。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE 插件版本 0.0.6 发布：https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/v0.0.6

- 软件包资源：   
   - 新增接入软件包资源管理器适配设备型号接口，支持显示Ruyi包管理器已集成的设备型号；
   - 界面优化，优化设备展示窗口尺寸；
   - 代码优化，修复存在安全漏洞的代码；
- 定制 Welcome 界面：
   - 修复以插件方式运行时存在的 icon 等资源找不到的问题；

## GCC
- 更新了-mcpu的默认参数，使用generic替代具体的rocket cpu模型
- 同步了-mtune的配置设置，将branch_cost更新为4，以便更好的适配Zicond扩展，生成对应的分支指令

## LLVM

- xtheadvector: [Clang][XTHeadVector] fix zvlsseg strided load/store: https://github.com/ruyisdk/llvm-project/pull/158
- xtheadvector: [Clang][XTHeadVector] make zvlsseg compatible with RVV1.0: https://github.com/ruyisdk/llvm-project/pull/159


## V8
- 实现struct/array.atomic.rmw.xchg的原子交换操作 
  - [6633523: [riscv][wasm][shared] Implement struct/array.atomic.rmw.xchg](https://chromium-review.googlesource.com/c/v8/v8/+/6633523)
- 将 suspender 对象迁移到可信空间
  - [6637888: [riscv][wasm][jspi] Move suspender object to trusted space](https://chromium-review.googlesource.com/c/v8/v8/+/6637888)
- 引入简单的截断优化pass
  - [6638821: [riscv][maglev] Simple truncation pass](https://chromium-review.googlesource.com/c/v8/v8/+/6638821)
- 在release模式中在常量池前增加检查
  - [6653368: [riscv] Check trampoline before Constant pool in Release mode](https://chromium-review.googlesource.com/c/v8/v8/+/6653368)
- 避免在JSPI内置函数中进行可信写入
  - [6656978: [riscv] [wasm][sandbox] Avoid a trusted write in a JSPI builtin](https://chromium-review.googlesource.com/c/v8/v8/+/6656978)
- 在Maglev中加入额外的peephole优化
  - [6656979: [riscv][maglev] Add some peephole optimisations](https://chromium-review.googlesource.com/c/v8/v8/+/6656979)

## 操作系统支持矩阵

- [Bit-Brick_K1: add test for bianbu 2.2 minimal](https://github.com/ruyisdk/support-matrix/pull/323)
- [LiP4A: merge 8+32G and 16+128G](https://github.com/ruyisdk/support-matrix/pull/324)
- [LPi4A/RevyOS: Bump to 20250526](https://github.com/ruyisdk/support-matrix/pull/325)
- [LicheePi4A: Add irradium test report (good).](https://github.com/ruyisdk/support-matrix/pull/327)
