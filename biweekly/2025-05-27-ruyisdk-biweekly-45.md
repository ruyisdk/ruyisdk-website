---
authors: [jing, white, fox]
---
# 第 045 期·2025 年 05 月 27 日

## 卷首语
第45期《RuyiSDK双周进展》准时送达！包管理器已更新新版本，欢迎下载试用。如果您在 RuyiSDK 的使用中遇到问题，欢迎参加每双周四下午 15:00 开展的 [“RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务（下一次在6月5日），也可以在 [RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈。

下个开发版本计划6月10日发布，我们将持续带来更多改进。

## 包管理器

RuyiSDK 0.34 对应的包管理器版本也为 0.34.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.34.0-gh] 或 [ISCAS 镜像源][ruyi-0.34.0-iscas]下载体验。

[ruyi-0.34.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.34.0
[ruyi-0.34.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.34.0/

本次更新的部分软件包需要最新版本的 RuyiSDK 包管理器才能正常解析、工作，因此强烈建议您在
`ruyi update` 之余，将您的 `ruyi` 也升级到最新版本。此外，已在 RuyiSDK 0.33
弃用的旧版设备安装器支持也将于 RuyiSDK 0.35（下个版本）移除。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 支持了部分解包 `tar` 归档文件，以适应个别厂商在其官方渠道将多个软件打成一个包分发的做法。
* 允许用 `ruyi venv --extra-commands-from` 为虚拟环境提供额外的与目标元组（target tuple）无关的命令，如特定厂商的刷写工具等。
* `ruyi admin format-manifest` 会保留文件头部和尾部的注释了。
* 遥测功能更新：
    * 当用户在终端首次运行 `ruyi` 时，现在会一次性询问用户是否允许立即上传安装信息。
    * 修复了 `ruyi` 的命令转发模式下遥测事件未被记录的问题。
    * 支持在软件源级别记录软件包的安装动作，以便第一方或第三方软件源的维护者们了解其软件的使用情况。
* 重构了 `ruyi` 命令行工具的入口点和 `ruyi` 的日志处理方式，消除了大部分全局量的使用，以便后续 RuyiSDK 生态的其他 Python 组件复用 `ruyi` 的功能。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 软件源格式更新：
    * 明确了官方软件源的 ID 为 `ruyisdk`，以便后续与第三方源和谐共存。
    * 术语更新：将那些指代非标准行为的“flavor”重命名为了“quirk”。
    * 为支持软件包声明其含有的可执行命令，为 `binary` 元数据新增了 `commands` 可选字段。
    * 为支持 `tar` 归档文件的部分解包，为 `distfile` 元数据新增了 `prefixes_to_unpack` 可选字段。
* 完善了设备支持：
    * `board-image/revyos-sipeed-lpi4a`: 更新了 Sipeed LicheePi 4A 的 RevyOS 镜像版本至 20250420，修复了 20250323 版本的信息。
    * 将 Milk-V Duo 系列设备的 1.0.7 版本的 "Python" 镜像与非 "Python" 镜像调换了名称。
* 新增软件包：
    * `board-util/wlink`: 社区独立实现的 WCH-Link 刷写与调试工具。
    * `source/wch-ch32v103-evt`: WCH CH32V103 EVT 官方代码示例包。
    * `source/wch-ch32v20x-evt`: WCH CH32V20x EVT 官方代码示例包。
    * `source/wch-ch32v307-evt`: WCH CH32V30x & CH32V317 EVT 官方代码示例包。
    * `toolchain/gnu-wch-mrs-toolchain-gcc12-bin`: WCH MounRiver Studio (MRS) 工具链的官方 2.1.0 版本，其中的 GCC 12.x 工具链。仅支持 x86\_64 架构。
    * `toolchain/gnu-wch-mrs-toolchain-gcc8-bin`: WCH MounRiver Studio (MRS) 工具链的官方 2.1.0 版本，其中的 GCC 8.x 工具链。仅支持 x86\_64 架构。
* 更新软件包：
    * `toolchain/gnu-plct-xthead`: 采用玄铁官方源码、由 PLCT 构建的玄铁工具链的 3.0.1 版本，GCC 版本为 14.1.1。
* 实体数据库更新：
    * 新增了 WCH 微架构、CPU 的实体定义。
    * 修正了 WCH 开发板的 CPU 信息。
* 插件系统更新：
    * 新增了初步的 RISC-V 32 位配置文件支持。
* 修复了一些软件包声明的格式错误。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE 插件版本 0.0.5 发布：https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/v0.0.5 

- ruyi 安装/更新：
   - 针对 ruyi 安装向导中下载进度条不能达到100%的问题进行了修复；
   - 删除 ruyi 安装向导中将 ruyi 加入到 path 路径的设定和步骤，改为使用 ruyi 绝对路径
- 软件包资源：
   - 通过树状结构分类展示软件包资源，并通过 checkbox 状态表示软件包资源的下载状态
   - 实现对软件包的下载
   - 支持打开软件包资源的本地缓存等路径，方便查看缓存文件

## GCC
- Binutils上游已合并Profiles RV20/22/23支持，更新了Smcdeleg，Ssccfg扩展支持
- 向FFmpeg上游提交了gcc构建时配置选项的修改，目前仍在讨论中

## LLVM

- xtheadvector: [Clang][XTHeadVector] fix vector integer widening multiply intrinsics: https://github.com/ruyisdk/llvm-project/pull/154
- xtheadvector: [Clang][XTHeadVector] fix vector integer divide intrinsics: https://github.com/ruyisdk/llvm-project/pull/155
- xtheadvector: [Clang][XTHeadVector] fix vector single-width integer multiply-add intrinsics: https://github.com/ruyisdk/llvm-project/pull/156
- xtheadvector: [Clang][XTHeadVector] fix vector widening integer multiply-add intrinsics: https://github.com/ruyisdk/llvm-project/pull/157

## V8

- wasm struct.atomic 特性在RISC-V平台上的实现
- 修复trampoline emit和scratch寄存器使用的bug
- 审阅和合入进迭时空comparisionOP 代码生成，load word unsigned op的0扩展优化

## 操作系统支持矩阵

- [Meles/RevyOS: Bump to 20250420](https://github.com/ruyisdk/support-matrix/pull/292)
- [Add Pine64 Ox64](https://github.com/ruyisdk/support-matrix/pull/293)
- [Update RV-STAR](https://github.com/ruyisdk/support-matrix/pull/294)
- [Add new Board HengShanPi and it's RT-Thread test report.](https://github.com/ruyisdk/support-matrix/pull/295)
- [Add Alpine test report for Mars and fix typos.](https://github.com/ruyisdk/support-matrix/pull/296)
- [Update Ubuntu 24.04.02 test report for Nezha.](https://github.com/ruyisdk/support-matrix/pull/297)
- [Update: ESP32C2, ESP32H2, ESP32C6 test reports](https://github.com/ruyisdk/support-matrix/pull/298)
- [LicheeRV_Dock: update ubuntu to 25.04](https://github.com/ruyisdk/support-matrix/pull/299)
- [Metadata: fix wrong sys metadata](https://github.com/ruyisdk/support-matrix/pull/300)
- [LiP4A_8_32: Add NixOS and Slackware](https://github.com/ruyisdk/support-matrix/pull/301)
- [Pioneer/OpenCloudOS: Add desktop](https://github.com/ruyisdk/support-matrix/pull/302)
- [Add new board OrangePi RV with OpenWRT and Ubuntu LTS test report and…](https://github.com/ruyisdk/support-matrix/pull/304)
- [DuoS: dump Debian to 1.6.23](https://github.com/ruyisdk/support-matrix/pull/310)

## 官网

新实习生的加入，推动 [ruyisdk.org](https://ruyisdk.org/) 首页[焕然一新](https://github.com/ruyisdk/ruyisdk-website/pull/128)。不过当前尚余一些小问题需要修复，具体见 issue [#135](https://github.com/ruyisdk/ruyisdk-website/issues/135)。大家觉得新的首页怎么样呢，欢迎在该 issue 下添加评论！

