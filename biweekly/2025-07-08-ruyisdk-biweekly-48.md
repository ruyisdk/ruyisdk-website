# RuyiSDK 双周进展汇报  第 048 期·2025 年 07 月 08 日

## 卷首语
欢迎阅读第48期《RuyiSDK双周进展》！包管理器已更新新版本，欢迎下载试用。

为了让RISC-V开发者更方便的交流，https://ruyisdk.cn 新网站已经上线了！目前有PLCT实验室超过百名RISC-V开发人员和活跃爱好者帮助回答问题，欢迎注册并参与讨论分享。

如果您在 RuyiSDK 的使用中遇到问题，可以在 [RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈，或者参加 7月17日（周四）下午 15:00 开展的 [“第九次 RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务。

下个开发版本计划7月22日发布，我们将持续带来更多改进。

## 包管理器

RuyiSDK 0.37 对应的包管理器版本也为 0.37.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.37.0-gh] 或 [ISCAS 镜像源][ruyi-0.37.0-iscas]下载体验。

[ruyi-0.37.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.37.0
[ruyi-0.37.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.37.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 新增了基本的命令行自动补全支持，初期支持 Bash 与 Zsh 两种 shells。感谢 [@wychlw] 的贡献！

  要使用命令行自动补全功能，请在您的 shell profile（如 `.bashrc` 或 `.zshrc`）的合适位置引入
  `ruyi` 的自动补全脚本：

  ```sh
  # zsh 用户请将 bash 字样替换为 zsh
  eval "$(ruyi --output-completion-script=bash)"
  ```

  目前支持 `ruyi` 子命令与 `ruyi install` 等命令的软件包参数的自动补全。

* 使用 `ruyi self clean` 清除本地数据时，如果新闻已读状态文件不存在，不会报错崩溃了。感谢 [@weilinfox] [报告][ruyi-issue319]问题！
* 拉取远端 Git 仓库失败时，不会将 Python 错误信息暴露给用户了。
* 只有在文件的下载 URL 协议为 FTP 时，才会为 `curl` 或 `wget` 启用 FTP 被动模式了。这修复了部分 RuyiSDK 用户由于[cURL 8.14.1 的 bug][curl-issue17545] 而无法下载任何文件的问题。感谢 [@weilinfox] 向 `ruyi` 项目[报告][ruyi-issue316]问题！
* 重构了 `ruyi` 的捆绑资源处理方式，将其从虚拟环境机制中剥离了，以便后续捆绑其他非虚拟环境相关资源，如命令行自动补全脚本、多语言字符串文件等等。同时，也以 CI 方式确保了 `ruyi` 所含的压缩资源总与原始文件保持同步。
* 新增了对于 OpenCloudOS 9.4、openEuler 24.03 LTS SP2、openEuler 25.03、openKylin 2.0 的支持情况。`ruyi` 的 Python 依赖包在这些发行版上均有少量缺失，但其余依赖包的版本满足要求，我们预计将在 2025 年 10 月完成对它们的支持。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 实体数据库更新：
    * 新增了 SpacemiT X60 微架构。
    * 新增了 SpacemiT K1 处理器型号。
    * 新增了 BananaPi BPI-F3 的 eMMC 与 SD 存储两种设备变体。
* 完善了设备支持：
    * 更新了 Milk-V Duo（64 & 256M RAM）、Duo S（SD 存储）的 Buildroot SDK。感谢 [@Cyl18] 的贡献！
    * 支持了 BananaPi BPI-F3 的 SD 存储型号，有 SpacemiT 提供的 Bianbu Desktop 与 Bianbu Minimal 两种系统供使用。感谢 [@wychlw] 的贡献！

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

[@Cyl18]: https://github.com/Cyl18
[@weilinfox]: https://github.com/weilinfox
[@wychlw]: https://github.com/wychlw
[curl-issue17545]: https://github.com/curl/curl/issues/17545
[ruyi-issue316]: https://github.com/ruyisdk/ruyi/issues/316
[ruyi-issue319]: https://github.com/ruyisdk/ruyi/issues/319

## IDE
- 实验性新增：添加新的插件projectcreator来为特定的开发板导入示例演示，并自动配置工具链和定制编译配置。提供了新建项目向导，预置开发板项目模板和自定义构建器用于一键在ruyi虚拟环境内构建项目。

## GCC
- 更新了P扩展的Binutils实现，rebase到2.44版本
https://github.com/ruyisdk/riscv-binutils/commits/p-dev/

- Rebase了 0.9.11 版本的P扩展支持到gcc 15.1,正在review中
https://github.com/ruyisdk/riscv-gcc/pull/5

- Porting了RVA23特性到revyos-gcc 14.3
https://github.com/pz9115/revyos-gcc/tree/14.3

## LLVM

- xtheadvector: [Clang][XTHeadVector] implement zvlsseg indexed load/store: https://github.com/ruyisdk/llvm-project/pull/160
- xtheadvector: [Clang][XTHeadVector] make zvlsseg indexed load/store compatible with RVV1.0: https://github.com/ruyisdk/llvm-project/pull/161

## V8
- PLCT合入代码
  - maglev中实现优化 [6656979: [riscv][maglev] Add some peephole optimisations](https://chromium-review.googlesource.com/c/v8/v8/+/6656979)
  - 开启wasm deopt测试用例 [6652018: [riscv][deoptimizer][wasm] Enable wasm deopt tests](https://chromium-review.googlesource.com/c/v8/v8/+/6652018)

- 审阅合入
  - 重构lane-size编码方式，直接在opcode中实现 [6699489: [riscv] Refactor lane-size encoding](https://chromium-review.googlesource.com/c/v8/v8/+/6699489)
  - 正确记录Call函数的pc_offset 
  [6652837: [riscv] Use pc_offset_for_safepoint instead of blocking trampolines](https://chromium-review.googlesource.com/c/v8/v8/+/6652837)
  - 为了避免DEBUG模式下，向量寄存器检查失败的问题，重构部分向量IR实现方式
[6668634: [riscv] Move F32x4 comp functions to code generator](https://chromium-review.googlesource.com/c/v8/v8/+/6668634)

## 操作系统支持矩阵

- [Add test for booting from SATA on Megrez](https://github.com/ruyisdk/support-matrix/pull/331)
- [Jupiter/openKylin: Fix wrong `sys_ver`](https://github.com/ruyisdk/support-matrix/pull/337)
- [Duo S: Dump BuildRoot](https://github.com/ruyisdk/support-matrix/pull/339)
- [LiP4A: Fix broken download links](https://github.com/ruyisdk/support-matrix/pull/340)

RuyiSDK GNU 工具链测试（GCC 16）：https://github.com/QA-Team-lo/ruyisdk-gnu-tests
