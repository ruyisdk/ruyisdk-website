---
authors: [jing, white]
---
# 第 040 期·2025 年 03 月 11 日

## 卷首语
欢迎阅读《RuyiSDK 双周进展汇报》第 40 期。在过去的两周里，我们团队持续努力，推进各项功能的开发与优化，具体进展将在下文中详细呈现。

我们期待在 2025 年 3 月 25 日发布下一个开发版本，届时将带来更多创新与改进。感谢您一直以来的支持与关注，您的反馈是我们前进的动力！

## 包管理器

RuyiSDK 0.29 对应的包管理器版本也为 0.29.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.29.0-gh] 或 [ISCAS 镜像源][ruyi-0.29.0-iscas]下载体验。

[ruyi-0.29.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.29.0
[ruyi-0.29.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.29.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 修复了 `ruyi news list` 命令的机读模式（porcelain mode）支持。
* 为 `ruyi news read` 增加了机读模式（porcelain mode）支持，返回格式与 `ruyi news list` 相同。
* 软件源格式更新：
    * 不再支持以 JSON 格式撰写软件源全局配置与软件包描述。RuyiSDK 官方软件源已于 0.18 版本完成了升级，预期不受此变更影响。如您仍未升级您的 `ruyi` 版本，建议您重新安装 `ruyi` 并重做虚拟环境（如有）。
    * 为软件包版本描述新增了可选的 `upstream_version` 字段，用来记录相应上游对该版本的称呼。由于 RuyiSDK 软件源普遍采用语义化版本，经常需要对不采用语义化版本的上游版本号进行映射；新增该字段有助于 RuyiSDK 生态的软件包管理工具正确理解该类映射关系。
    * 为未来的软件包级别的公共信息作了向后兼容的预留。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
- RuyiSDK IDE Plugins 插件，新增 RISC-V 开发板管理功能，支持添加、编辑、删除及设置默认开发板。

   插件使用说明：
   1. 下载 [org.ruyisdk.ide_0.0.3.jar](https://github.com/xijing21/eclipse-plugins/releases/download/v0.0.3/org.ruyisdk.ide_0.0.3.jar)。
   2. 访问 https://mirror.iscas.ac.cn/ruyisdk/ide/0.0.3/ 下载 ruyisdk-0.0.3 并解压。
   3. 将 org.ruyisdk.ide_0.0.3.jar 放入 ruyisdk ide 的 dropins 目录。
   4. 执行 ./ruyisdk 重启 IDE。
   5. 启动后在菜单栏点击 "RuyiSDK" > "Open Board Manager" 即可打开 "RISC-V Board Manager" View 进行添加、编辑、删除及设置默认开发板等操作。

## GCC
- 更新了p扩展寄存器对指令的工具链支持，正在实现RVA23S的有关特权指令扩展中。

## LLVM

- 在 19.1.6 版本中修复了 Greedy Register Allocator 在某些 XTHeadVector intrinsic 上导致的编译器内部错误的问题
- 在 17.1.6 版本中新增部分 XTHeadVector intrinsic 的操作数范围检查，和 RVV 1.0 行为对齐

## V8
- 在陆续添加TurborShaft IR支持后，删除TurboFan SON IR相关的旧代码
- 审核类型转换优化、32bit比较优化patch（来自syntacore）
- 实现Wasm JSPI功能中沙盒内的chain of stacks功能
- 删除RISCV指令集不支持的ByteSwap 代码生成支持

## 操作系统支持矩阵

- [Add a new RTOS: LiteOS and add LiteOS test report for CH32V307](https://github.com/ruyisdk/support-matrix/pull/175)
- [BIT-BRICK K1:add new board  ](https://github.com/ruyisdk/support-matrix/pull/176)
- [LicheePi4A: update to fedora 41](https://github.com/ruyisdk/support-matrix/pull/178)
- [BPI-F3: Update Bianbu v2.0.4 to v2.1](https://github.com/ruyisdk/support-matrix/pull/179)
- [feat/tools: split customized linux distributions](https://github.com/ruyisdk/support-matrix/pull/180)
- [LicheePi4A/RevyOS: Remove ruyi-install version](https://github.com/ruyisdk/support-matrix/pull/181)
- [VisionFive2: add eweOS,update openkylin 2.0 SP1](https://github.com/ruyisdk/support-matrix/pull/182)
- [feat/tools: remove customized distributions from linux table](https://github.com/ruyisdk/support-matrix/pull/183)
- [Pioneer: Bump a bunch of reports](https://github.com/ruyisdk/support-matrix/pull/184)
- [LicheeRV & Duo & Duo256m & VisionFive2/nixos: fix typo](https://github.com/ruyisdk/support-matrix/pull/185)
- [Fix: make `sys` field case insensitive](https://github.com/ruyisdk/support-matrix/pull/186)
- [Add LiteOS test report for CH32V208, update documents and fix some typos.](https://github.com/ruyisdk/support-matrix/pull/187)
- [Add/Update mangopi_mq_pro (1)](https://github.com/ruyisdk/support-matrix/pull/188)
- [  update Licheepi4A_RevyOS_20250123](https://github.com/ruyisdk/support-matrix/pull/189)
- [ IndexUpdator: V1 Version](https://github.com/ruyisdk/support-matrix/pull/190)
- [fix: images generation](https://github.com/ruyisdk/support-matrix/pull/191)
- [VisionFive2: add irradium(core),Bit-Brick_K1: update bianbu](https://github.com/ruyisdk/support-matrix/pull/192)
- [VisionFive2: remove non-existent images](https://github.com/ruyisdk/support-matrix/pull/196)
