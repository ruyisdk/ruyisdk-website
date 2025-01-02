---
authors: [jing]
---

# 第 029 期·2024 年 09 月 14 日

## 卷首语
RuyiSDK V0.18 版本已于今日发布。本期 RuyiSDK 重点针对 Milk-V Duo 开发板进行支持，调研并集成了演示示例 milkv-duo-examples，并集成了由 Milk-V 提供的、在 x86_64 平台上交叉编译 milkv-duo-examples 所需的自定义工具链，提供了一套 Milk-V Duo 的配套开发资源。同时软件源对 WPS Office、RV64ILP32 裸机工具链等软件进行了升级维护。

操作系统支持矩阵项目新增了 Microchip PIC64GX Curiosity Kit 开发板的调研，但是我们没有开发板所以还未能完成相关测试验证，我们欢迎有该开发板的热心朋友参与进来协助完成验证。
同时，支持矩阵项目通过一段时间的自动化工具研发，已经产生了第一个使用自动化工具完成的测试报告。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.19 版本将在 9 月 30 日发布。

## 包管理器

RuyiSDK 0.18 对应的包管理器版本也为 0.18.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.18.0-gh] 或 [ISCAS 镜像源][ruyi-0.18.0-iscas]下载体验。

[ruyi-0.18.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.18.0
[ruyi-0.18.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.18.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 进一步完善了 [issue #181] 的修复：先前虽然修复了代码块的折行缺字问题，但不经意间也让长度超过一行的
  Markdown 列表项、块状引用等内容被截断了。
* 完成了 [issue #193]: 为方便发行版的打包工作，移除了对 `python-frontmatter` 这一第三方库的依赖。

[issue #181]: https://github.com/ruyisdk/ruyi/issues/181
[issue #193]: https://github.com/ruyisdk/ruyi/issues/193

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 更新了 WPS Office 到上游最新版本。
* 更新了 RV64ILP32 裸机工具链 `toolchain/gnu-plct-rv64ilp32-elf` 到当前最新版本。
* 更新了 Milk-V Duo 的支持：
    * 新增打包了 Milk-V Duo 官方实例代码库 `source/milkv-duo-examples`。您可在一个新的目录下，用 `ruyi extract` 命令解压它。
    * 新增打包了 Milk-V 官方提供的 Milk-V Duo 宿主工具链如下。请注意：它们是
      RuyiSDK 受权对上游 https://github.com/milkv-duo/host-tools 仓库进行的重新打包；且上游仅提供了
      `x86_64` 架构的二进制。
        * `toolchain/gnu-milkv-milkv-duo-bin`：适用于 Linux glibc 环境。
        * `toolchain/gnu-milkv-milkv-duo-elf-bin`：适用于裸机环境。
        * `toolchain/gnu-milkv-milkv-duo-musl-bin`：适用于 Linux musl 环境。
    * 更新了 Milk-V Duo 官方系统镜像包到上游最新版本。RuyiSDK 受权对这些镜像进行了重新打包，以便后续所有通过
      RuyiSDK 渠道分发的系统镜像都能以 `ruyisdk` 用户名与密码登录，方便您的评估。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
开始启动 RuyiSDK VSCode IDE 插件开发和 RuyiSDK Eclispe IDE 开发。计划在开发的同时输出短视频吸引新人加入。

## GCC

更新了Zcmt的实现，修复了gcc14.2回归测试中发现的一些问题，正在进行Smrnmi扩展的支持中。

## LLVM
本期暂无进展。

## V8
1. 在 RISC-V 平台适配 leaptier 特性，提高 JIT 编译器 tier-up 和 tier-down 的安全性和性能。
2. 对 jalr 进行优化：
   
    （1）将编译时跳转偏移可以满足 jal 立即数域编码要求的 jalr 指令，替换为 jal 指令。
   
    （2）对必须进行寄存器间接地址+编译时额外跳转偏移的情况，将能够满足 jalr 立即数编码域条件的跳转编译编码至jalr 指令，不再适用额外指令进行跳转目标寄存器的计算。
4. 使用 zicond 指令集扩展对 codegen 进行优化。

## 官网
梳理了用户数据收集需求，计划在用户允许的情况下通过数据收集的方式了解 ruyi 包管理器的安装和使用情况，协助我们提升和改进产品。

## 操作系统支持矩阵

- 新增：[Microchip PIC64GX Curiosity Kit](https://github.com/ruyisdk/support-matrix/blob/main/PIC64GX/README_zh.md)
 - Ubuntu 24.04.1 LTS
- 更新：BPI-F3
 - [Armbian Noble](https://github.com/ruyisdk/support-matrix/blob/main/BPI-F3/Armbian/README_zh_noble.md)
 - 这是支持矩阵仓库第一个使用自动化工具完成的测试报告
