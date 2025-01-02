---
authors: [jing]
---
# 第 035 期·2024 年 12 月 17 日

## 卷首语
RuyiSDK包管理器 V0.24 版本已于今日发布。RuyiSDK IDE V0.0.1版本发布，本版本面向RuyiSDK测试人员，提供Linux系统 x86_64、riscv64、aarch64 三架构的安装程序，欢迎下载试用和反馈建议。

RuyiSDK包管理器针对兼容性进一步优化更新了依赖版本。RuyiSDK 软件源近期针对开发板镜像进行了更新，用户可以通过系统安装器安装新版本镜像。此外为了让操作系统支持矩阵项目验证的可用镜像能够及时的同步到系统安装器（package-index），支持矩阵小队成员自研发的同步工具已经完成并部署可用，后续镜像数据从调研到集成到包管理器将更加及时高效。

GCC向上游重新发送了Profiles支持，目前正在讨论实现的规范细节中，并开始支持Zilsd/Zclsd扩展。v8部分也有较多性能优化、安全性优化相关的更新。

此外，PLCT实验室分别与矽速科技、群芯闪耀达成合作，将LicheePi 4A和Milk-V Meles的软件生态并入RuyiSDK项目，共同推动RISC-V开发者生态的建设。相关新闻如下：
1. [矽速科技与PLCT实验室联合宣布：LicheePi 4A 软件生态并入 RuyiSDK 项目，共建 RISC-V 开发者生态](https://mp.weixin.qq.com/s/gp5dxM_OqZLE6hGa1djc3A)
2. [群芯闪耀与PLCT实验室联合宣布：Milk-V Meles 软件生态并入 RuyiSDK 项目，共建 RISC-V 开发者生态](https://mp.weixin.qq.com/s/mun-iFtxs8Mozh6Jn5KD7Q)


RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.25 版本将在 12 月 31 日发布。

## 包管理器

RuyiSDK 0.24 对应的包管理器版本也为 0.24.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.24.0-gh] 或 [ISCAS 镜像源][ruyi-0.24.0-iscas]下载体验。

[ruyi-0.24.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.24.0
[ruyi-0.24.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.24.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 更新了依赖版本。

本次 RuyiSDK 软件源的更新主要包括了以下内容：

* 更新了以下软件到最新版本：
    * `board-image/armbian-pine64-star64`
    * `board-image/buildroot-sdk-milkv-duo`
    * `board-image/buildroot-sdk-milkv-duos-sd`
    * `board-image/buildroot-sdk-sipeed-licheervnano`
    * `board-image/debian-fishwaldo-sg200x-sipeed-licheervnano`
    * `board-image/revyos-sipeed-lpi4a`
    * `board-image/uboot-revyos-sipeed-lpi4a-16g`
    * `board-image/uboot-revyos-sipeed-lpi4a-8g`
    * `extra/wps-office`

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE V0.0.1版本发布，本版本面向RuyiSDK测试人员，提供Linux系统 x86_64、riscv64、aarch64三架构的安装程序。本版本在Eclipse开源IDE基础上进行定制开发，目前除了继承了项目管理、编辑器、构建、调试等常用功能，能够支持创建、构建、调试 RISC-V 项目等。

RuyiSDK IDE V0.0.1 下载地址为：https://mirror.iscas.ac.cn/ruyisdk/ide/0.0.1/  请按照设备环境选择合适的安装包。

## GCC
向GCC上游重新发送了Profiles支持，目前正在讨论实现的规范细节中，开始支持Zilsd/Zclsd扩展

## V8
1. 移植Growable stack到RISC-V的Wasm liftoff baseline compiler和turbofan compiler
2. 修复ICache flush在多核芯片上的bug，将flush范围从local harts改为包括remo特harts
3. 移植和实现MutableInt32 to ScriptContext slots优化
4. 在正则表达式编译器中添加压栈后栈内存边界检测，加强安全性
5. 继续实现Leap tiering功能

## 操作系统支持矩阵
1. 继续推进 packages-index 元数据同步 CI [#107](https://github.com/ruyisdk/support-matrix/pull/107)
2. 分离 LicheeRV 和 Nezha 测试报告 [#115](https://github.com/ruyisdk/support-matrix/pull/115)
3. 添加 BPI-F3 Alpine 测试报告 [#116](https://github.com/ruyisdk/support-matrix/pull/116)
4. 添加 BeagleV-Ahead RevyOS 和 openSUSE 测试报告 [#117](https://github.com/ruyisdk/support-matrix/pull/117)
5. 添加/更新 LicheeRV Nano Alpine/Buildroot/Fedora 测试报告 [#119](https://github.com/ruyisdk/support-matrix/pull/119)

## SDK

基于之前的验证和测试整理 Milkv Duo 重构需求：

- [Milkv Duo 重构需求](https://gitee.com/yunxiangluo/milkv-duo/blob/master/%E9%87%8D%E6%9E%84%E9%9C%80%E6%B1%82.md)

Milkv Duo SDK todo（缺陷）持续更新：

- [Milkv Duo SDK todo](https://gitee.com/yunxiangluo/milkv-duo/blob/master/todo.md)
