---
authors: [jing]
---
# 第 031 期·2024 年 10 月 22 日

## 卷首语

RuyiSDK V0.20 版本已于今日发布。为了简化打包和供应链安全的考虑，包管理器工具移除了插件机制的 Starlark 沙箱，同时完善了遥测功能，增加了禁用遥测选项、清除本地已收集的信息等功能；并修复了一些已知bug。

LLVM新增了rv64ilp32 ABI的支持，目前可以成功编译 rv64ilp32 Linux kernel（bf63582b08）并进入用户态了，这项成果已在玄铁团队的宣传材料中得到展示。LLVM 对 XTHeadVector 拓展的支持正在逐渐 rebase 到 LLVM 19.1.1 上，目前已经完成了大部分的 rebase 工作，进入测试阶段。

操作系统支持矩阵部分新增和更新了数十项信息，并且建设CI生成SVG格式的统计表格，使得展示和浏览效果更佳。并为所有测试报告都添加了元数据，方便后续与 packages-index 同步更新。

《从零开始开发VSCode插件与Ruyi IDE插件》 第2课已经上线B站。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.21 版本将在 11 月 5 日发布。

## 包管理器

RuyiSDK 0.20 对应的包管理器版本也为 0.20.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.20.0-gh] 或 [ISCAS 镜像源][ruyi-0.20.0-iscas]下载体验。

[ruyi-0.20.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.20.0
[ruyi-0.20.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.20.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* `ruyi self uninstall --purge` 不会遗留遥测数据了。
* 修复了 `ruyi admin` 子命令无法被调用的问题。
* 修复了 Ruyi 虚拟环境中，向无 target tuple 前缀的命令（如一系列 LLVM 工具）的转发。
* 应 RuyiSDK 项目需求方要求，移除了插件机制的 Starlark 沙箱。这有助于简化打包与降低开发门槛：按照 RuyiSDK 当前的威胁模型（threat model），沙箱机制不会带来额外的安全性。

注意：由于 Starlark 与 Python 存在细微的语义差异，在升级到 ruyi 0.20.0 之后，您必须将软件源
`ruyi update` 到最新，才能继续使用 `ruyi` 的部分功能（如 `ruyi venv` 等）。除此之外，我们预计插件机制的技术细节变更不会对实际使用造成影响。

注意：我们可能在今后的一到两个版本期间，实装 RuyiSDK 遥测机制。届时，您可自行决定是否主动上传这部分匿名统计信息，以便
RuyiSDK 团队改进产品；您也可以选择删除先前的遥测数据，以及是否禁用遥测。您可用
`ruyi self clean --telemetry` 删除所有的遥测信息，包括设备信息。详情请见 RuyiSDK 0.19
的发布说明：[《RuyiSDK 双周进展汇报 第 030 期·2024年09月30日》][ruyisdk-biweekly-30]。

[ruyisdk-biweekly-30]: ./20240930-ruyisdk-biweekly-30.md

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
从零开始开发VSCode插件与Ruyi IDE插件 第2课已经上线B站。视频可以在[此](https://space.bilibili.com/13429452)观看。欢迎点赞关注一键三连！

## GCC
支持了ssqosid扩展，正在添加P扩展的新草案支持中(p-dev分支)，提交了target_clone功能的patch支持

## LLVM

- 支持 rv64ilp32 ABI，目前可以成功编译 rv64ilp32 Linux kernel（bf63582b08）并进入用户态了（需要使用 [rv64ilp32](https://github.com/ruyisdk/llvm-project/tree/rv64ilp32) 分支下的代码），还有部分小问题正在修复中
- XTHeadVector 拓展正在逐渐 rebase 到 LLVM 19.1.1 上，目前已经完成了大部分的 rebase 工作，正在进行测试

## V8
1. 修复若干Maglev相关的CI bug。
2. 继续完善leaptiering特性。

## 官网
本期暂无更新。

## 操作系统支持矩阵

新增：
- VisionFive 2 / NetBSD
- Duo 256M / Alpine, Arch Linux
- Mango MQ Pro / NetBSD
- Duo S / Arch Linux
- Huashan Pi / buildroot
- Milk-V Jupiter / Bianbu 1.0
- CI 生成首页表格 SVG

更新：
- VisionFive 2 / Ubuntu: 24.04 LTS -> 24.04.1 LTS, 24.10
- BPI-F3: typo fix
- VisionFive 2 / openKylin: 2.0
- PIC64GX / Ubuntu: 24.10

此外，我们为所有测试报告都添加了元数据，方便后续与 packages-index 同步更新。
