---
authors: [jing]
---
# 第 033 期·2024 年 11 月 19 日

## 卷首语
RuyiSDK包管理器 V0.22 版本已于今日发布。包管理器近期主要针对 Linux发行版的兼容性支持进行了核心依赖的调研和调整，以满足 Debian、RevyOS、RuyiOS(开展中)、Ubuntu、Fedora、deepin、Arch Linux等发行版的兼容性需求。并新增了 [RuyiSDK 的平台支持文档][ruyisdk-platform-support] 告知用户RuyiSDK的兼容性支持计划。

此外支持矩阵和 SDK验证都重点针对 Milkv Duo 进行测试和更新；Eclipse插件目前通过公开学习日志等方式希望更多人能够了解并加入到Eclipse插件开发，欢迎有兴趣的开发者们加入。

RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.23 版本将在 12 月 3 日发布。

## 包管理器

RuyiSDK 0.22 对应的包管理器版本也为 0.22.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.22.0-gh] 或 [ISCAS 镜像源][ruyi-0.22.0-iscas]下载体验。

[ruyi-0.22.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.22.0
[ruyi-0.22.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.22.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 新增了 [RuyiSDK 的平台支持文档][ruyisdk-platform-support]，基于此完善了 RuyiSDK 包管理器的平台兼容性：
    * 将 Python 版本的最低要求降至 3.10，以与 Ubuntu 22.04 LTS 系统默认 Python 版本保持兼容。
    * 降低了各种 Python 依赖关系的版本要求，以支持与 Ubuntu 22.04 LTS 系统提供软件包配合工作。
    * 按照 Python 打包标准，新增声明 `ruyi` 入口点，以便发行版打包机制自动识别、处理。

**注意：**我们将于 RuyiSDK 0.23 版本增加 RuyiSDK 遥测数据的上传功能，并可能在 CI
环境将其默认开启。届时，您可自行决定是否主动上传这部分匿名统计信息，以便
RuyiSDK 团队改进产品；您也可以选择删除先前的遥测数据，以及是否禁用遥测。您可用
`ruyi self clean --telemetry` 删除所有的遥测信息，包括设备信息。详情请见 RuyiSDK 0.19
的发布说明：[《RuyiSDK 双周进展汇报 第 030 期·2024年09月30日》][ruyisdk-biweekly-30]。

[ruyisdk-platform-support]: https://ruyisdk.org/docs/Other/platform-support
[ruyisdk-biweekly-30]: ./20240930-ruyisdk-biweekly-30.md

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
"探路 Eclipse RISC-V 插件开发”系列学习日志已将前期学习总结梳理后通过 [eclipse-myplugins](https://github.com/xijing21/eclipse-myplugins) 公开分享，配套的视频后续也可访问 [B站](https://space.bilibili.com/405461644) ，欢迎更多的人加入到 Eclipse RISC-V 插件的学习和开发。

## GCC
添加了TARGET_CLONE特性的支持，目前已合入gcc上游，继续添加P扩展的草案支持，开始进行svvptc扩展的工具链支持工作


## V8
1. 适配上游 硬编码实现JumpTableAssembler的 jit 功能。
2. 在 v8 模拟器中实现 js 堆栈切换。
3. 适配turboshaf中word32cmpare的指令选择并修复 turboshaf相关的错误。


## 操作系统支持矩阵

- Duo/Duo 256M Alpine, FreeRTOS, openEuler, Fedora, Ubuntu: https://github.com/ruyisdk/support-matrix/pull/99
- Duo Fedora: https://github.com/ruyisdk/support-matrix/pull/100
- Duo OpenWrt/Yocto: https://github.com/ruyisdk/support-matrix/pull/102

丁丑小队本周完成了对 LPi4A & Pioneer Box Firefox 的可用性观测，以及 Milk-V Duo 系列的 RT-Thread / Smart 测试，计划后续一同加入支持矩阵中。

测试报告现已公开。

- Firefox 测试报告：https://github.com/QA-Team-lo/firefox_test
- RT-Thread / Smart 测试报告 Review：https://github.com/QA-Team-lo/rttest

## SDK
完成 Milkv Duo 官方SDK 的验证及缺陷总结，为后续SDK优化做准备。
- [Milkv Duo/Duo 256M/DuoS 缺陷更新](https://gitee.com/yunxiangluo/milkv-duo/blob/master/todo.md)
