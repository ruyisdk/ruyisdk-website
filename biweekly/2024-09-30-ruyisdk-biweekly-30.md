---
authors: [jing]
---
# 第 030 期·2024 年 09 月 30 日

## 卷首语
RuyiSDK V0.19 版本已于今日发布。包管理器工具为 **`ruyi venv` 新增了多工具链支持**，目前可以为一个虚拟环境配置多个 target tuple 互不相同的工具链包，满足sdk构建时多工具链的需求。同时，RuyiSDK 开始了基础的遥测功能采集用户数据，目前**完成了基础数据的采集**（当前存储在用户本地），后续上传功能会在用户隐私协议、后端服务器就绪后正式启用。收集的 ruyi 安装信息、ruyi install 执行信息将帮助我们了解 RuyiSDK 的装机情况、编译器等工具的安装情况等。

此外，ruyi 工具基于主流的Linux发行版的打包工作基本完成，已经**基于Debian、Ubuntu、Fedora、openEuler、Arch Linux等多个Linux发行版的流行版本完成了 ruyi v0.18 的打包**，目前初步开放供用户尝鲜。

**[Eclipse 上游初步支持 RISC-V](https://riscv.org/blog-chinese/2024/09/eclipse-riscv64-support-upstreamed/)**，[每日构建镜像](https://download.eclipse.org/eclipse/downloads/index.html)已经可以下载试用。
Visual Studio Code IDE插件也正式开启开发，并输出视频教程以吸引更多开发者参与，第一课将于十月一日零点推送，欢迎[关注](https://space.bilibili.com/13429452)。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.20 版本将在 10 月 22 日发布。


## 包管理器

RuyiSDK 0.19 对应的包管理器版本也为 0.19.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.19.0-gh] 或 [ISCAS 镜像源][ruyi-0.19.0-iscas]下载体验。

[ruyi-0.19.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.19.0
[ruyi-0.19.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.19.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 修复了当环境 locale 配置在本机上无效时，`ruyi news list` 在官方软件源上崩溃的问题。这也是
  RuyiSDK 包管理器的首个来自外部贡献者的贡献。感谢 [RekiDunois](https://github.com/RekiDunois)！
* 为打包工作者新增了 `ruyi admin format-manifest` 命令，用来自动格式化软件包描述文件，确保符合标准格式。
* 为 `ruyi venv` 新增了多工具链支持：可以为一个虚拟环境配置多个 target tuple 互不相同的工具链包了。
* 新增了 `ruyi self clean` 命令，用来清理 Ruyi 产生的各种数据，释放存储空间。
* 对于发行版直接再次分发 RuyiSDK 官方编译 `ruyi` 二进制的情况，为发行版打包工作者提供了手段来阻止用户不慎
  `ruyi self uninstall`。
* 基础的遥测功能，目前不支持数据上传。详见“遥测”一节。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

### 遥测

为帮助 RuyiSDK 团队更好了解用户使用习惯以改进体验，我们为 RuyiSDK 包管理器增加了基础的遥测功能。有以下 3 种遥测模式：

* `local`: 仅收集数据，不主动上报。这是默认模式。
* `on`: 收集数据并周期性上报。目前未实现。
* `off`: 完全禁用遥测。

目前我们将收集以下的数据：

* 首次运行 `ruyi` 时，将一次性收集少量设备信息。
    * 仅从系统随机数生成唯一的安装 ID，与任何系统配置、本地数据均无关；
    * 当前运行环境是否为几种知名 CI 服务之一，如 GitHub Actions、GitLab CI、Travis CI 等；
    * 操作系统内核种类与处理器架构；
    * C 运行库种类与版本（形如 `glibc 2.40`）；
    * Linux 发行版代号与版本；
    * 如处理器架构为 RISC-V，还将收集由设备树指定的系统型号与 `/proc/cpuinfo`
      所暴露的 CPU 核数、微架构、ISA 字符串等 RISC-V 特定信息。
* 每次运行 `ruyi`，将记录调用的命令种类，不含参数。
* 每次运行 Ruyi 虚拟环境中的工具链代理，将记录被调用的命令名。

如果您不希望参与遥测，请在运行新版 `ruyi` 之前做以下两种操作之一即可。要么确保环境变量中存在
`RUYI_TELEMETRY_OPTOUT=1`（请注意：不是 `OUTPUT`），要么在配置文件
`~/.config/ruyi/config.toml` 加入以下内容：

```toml
[telemetry]
mode = "off"
```

在 RuyiSDK 完全支持遥测数据上传之前的一个版本，我们将会告知您此事，您可自行决定是否删除先前的遥测数据，以及是否禁用遥测。您可用
`ruyi self clean --telemetry` 删除所有的遥测信息，包括设备信息。

## Linux 发行版打包

一直以来，RuyiSDK 包管理器都是在 GitHub Release 或 ISCAS 镜像源渠道分发二进制。用户需要自行下载、调整文件权限、重命名、安排进
`$PATH` 才能使用，些许不便，且打包后的二进制每次使用都要校验解压文件完整性，性能欠佳。为此，RuyiSDK
团队计划为主流 Linux 发行版打包 `ruyi`。目前，已经为如下的发行版完成了 `ruyi`
v0.18.0 的实验性打包：

* Debian 13 ("trixie")
* Fedora 39, 40, 41
* openEuler 24.03
* Ubuntu 22.04 ("jammy"), 24.04 ("noble")

其中除 Fedora 39、Fedora 41 未有 `riscv64` 架构包之外，均提供三种官方支持架构即
`amd64`、`arm64` 与 `riscv64` 的二进制包。

目前，您可根据实际情况找到适合您的安装方式与尝鲜软件源：

* Arch Linux：已[上架 AUR](https://aur.archlinux.org/packages/ruyi)
* 以上提到的发行版：参考[此仓库](https://github.com/weilinfox/ruyi-builds)
* 官方支持架构的其他发行版：参考[此仓库](https://github.com/weilinfox/ruyi-bin-builds)

后续我们将会在 RuyiSDK 新版本发布时同步完成二进制软件包的打包，并为各大主流发行版搭建正式的第三方软件源，敬请期待。

## IDE

Visual Studio Code IDE插件正式开启开发，并输出视频教程。第一课将于十月一日零点准时推送！为国庆献礼~
视频可以在[此](https://space.bilibili.com/13429452)观看。欢迎点赞关注一键三连！

Eclipse 上游初步支持 RISC-V，每日构建镜像已经可以下载试用：https://riscv.org/blog-chinese/2024/09/eclipse-riscv64-support-upstreamed/
RevyOS 小队的工程师联合其他开源社区开发者，成功为 Eclipse 上游代码仓库引入了对 riscv64 架构的初步支持。期间创建了[二十余个 Issue/PR](https://github.com/eclipse-platform/eclipse.platform.releng.aggregator/issues/2310)，涵盖了包括 SWT、Equinox 在内的关键组件。目前，Eclipse 已支持在 riscv64 平台上基于 OpenJDK 开发 Java 项目。

## GCC
添加了Smrnmi扩展的支持,将riscv-gnu-toolchain仓库中的GCC版本同步更新至14.2,更新了allowlist中的测试列表

## LLVM
本期暂无进展。

## V8
1. 合入Maglev JIT，正式在RISCV64架构上支持Tier-2的优化编译器。
2. 实施了若干分支优化，包括将jalr优化到jal，zicond优化，jump to table优化，call address优化。
3. 开始支持wasm deopt特性。

## 官网
为了了解 RuyiSDK 的安装和使用情况，提出了用户数据收集的需求，目前已经在 ruyi 工具中完成了初步的数据收集。

## 操作系统支持矩阵

我们对支持矩阵日渐膨胀的主文档进行了一定的重写，按照 Linux 发行版、RTOS、BSD 和其他类型进行了分类，并且新增&修改了一些测试报告。

- [主文档重写](https://github.com/ruyisdk/support-matrix/commit/7c38093075759eca26781e9ec3abec9d71956c8d)
- [修复了部分英文翻译不一致的问题](https://github.com/ruyisdk/support-matrix/commit/7db869603c405f120d24ebddb30021200763d8a0)
- [更新了 D1 Ubuntu 24.10 beta 测试报告](https://github.com/ruyisdk/support-matrix/commit/43538a76cca483795d74e88868c1c525e8e8fae0)
- [新增 D1/Arch Linux 测试报告](https://github.com/ruyisdk/support-matrix/commit/3d537dd9498dc79c00e771862657d2ec203fbe79)
- [更新 VisionFive 2/ArchLinux 测试报告](https://github.com/ruyisdk/support-matrix/commit/bac9eb66d4ecda9b55812af18d16d4c1998015f4)
