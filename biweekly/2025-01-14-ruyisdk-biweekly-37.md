---
authors: [jing]
---
# 第 037 期·2025 年 01 月 14 日

## 卷首语
RuyiSDK包管理器 V0.26 、RuyiSDK IDE V0.0.3 版本已发布。

RuyiSDK包管理器近期在细节上进行完善和优化，主要有新增遥测允许上传设置命令、修复虚拟环境 `-mcpu` 映射问题、兼容性加强和工程优化等内容。RuyiSDK 软件源则发布了RevyOS新版本，同时配合 `-mcpu` 映射逻辑升级 profile API。

RuyiSDK IDE 目前针对 milkv duo 开发板进一步完善了开发环境到RISC-V设备之间的文件传输、远程运行、远程调试的使用指导。

支持矩阵项目近期更新主要围绕 LicheePi4A 、Duo、DuoS，关注这三款开发板的小伙伴可以在下方查看变动详情。

RuyiSDK近期的发展动态已详细整理于下方，我们诚挚地邀请各位开发者试用，并期待大家宝贵的反馈与建议。鉴于下一个版本规划日落在了2025年春节假期，我们对发布时间进行了相应的调整，下一个开发版本预计将在 2025 年 2 月 11 日与大家见面。

在此，提前向大家送上新春的祝福：祝您新春快乐，阖家幸福，万事顺意，吉祥如意！

## 包管理器

RuyiSDK 0.26 对应的包管理器版本也为 0.26.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.26.0-gh] 或 [ISCAS 镜像源][ruyi-0.26.0-iscas]下载体验。

[ruyi-0.26.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.26.0
[ruyi-0.26.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.26.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 为 `ruyi telemetry status` 新增了 `--verbose` (`-v`) 选项，供用户在 `ruyi telemetry consent` 之后继续查看自身遥测数据的上传计划。
* 修复了使用厂商工具链创建虚拟环境时，工具链 `-mcpu` 取值可能不被正确映射的问题。如果您受影响，请在 `ruyi update` 之后重建虚拟环境。
* 继续加强了平台兼容性保障。
    * 新增了一篇平台兼容性技术文档，明确了当前 `ruyi` 支持的第三方依赖的基线版本。
    * 以 CI 检查的方式确保了 `ruyi` 的所有变更都不影响 `ruyi` 在 Ubuntu 22.04 下通过测试套件。
* 工程化相关变更。
    * 修复了源码包内遗漏了一层子目录结构的问题。
    * 更新 Poetry 至 2.0 版本，顺带更新了 `ruyi` 的 Python 项目元数据（`pyproject.toml`）。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 更新了 `board-image/revyos-sipeed-lpi4a`。
* 配合 `ruyi` 0.26.0 相应更改，支持了新的 profile API，以便为虚拟环境正确配置 `-mcpu`。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE V0.0.3 版本发布，下载地址为：https://mirror.iscas.ac.cn/ruyisdk/ide/0.0.3/ 请按照设备环境选择合适的安装包。
V0.0.3 主要修改和更新了 RuyiSDK IDE 的 Welcome 中的 RuyiSDK 相关引导信息，更新为 RuyiSDK 官网和 RuyiSDK IDE 用户指南两部分。

在文档方面，本期重点完成的针对 Milk-V Duo example 示例在 RuyiSDK IDE 中的使用进行说明：
1. 增加了 Run as Remote Application 方式的运行；
2. 增加了 Debug 示例和基于 Terminal 和 Debug as Remote Application 方式调试说明；
3. 进一步明确和优化了编译参数。
4. 整理 milkv duo sdk 改进需求：milkv duo镜像需要增加 sftp-server、gdbserver 程序，方便在开发时进行文件传输和调试支持。

## GCC
更新了Profiles实现规则，在GLIBC中添加了IFUNC符号用于调用，更新了新32位的GDB支持，开始启动GDB SIM的调试工作。

## V8
1. Refactor Relocation支持部分的代码。
2. 修复 strict 模式下的构建错误问题。

## 操作系统支持矩阵

- [Duo/Buildroot: Bump to v1.1.4](https://github.com/ruyisdk/support-matrix/pull/127)
- [CI: Add NixOS and DietPi in system parser matadata](https://github.com/ruyisdk/support-matrix/pull/128)
- [CI: Fix: bump Python version](https://github.com/ruyisdk/support-matrix/pull/130)
- [Licheepi4A/openKylin: Bump version to v2.0-sp1](https://github.com/ruyisdk/support-matrix/pull/131)
- [LicheePi4A/RevyOS(main): update revyos 20241229](https://github.com/ruyisdk/support-matrix/pull/133)
- [LicheePi4A/openKylin: fix broken link](https://github.com/ruyisdk/support-matrix/pull/135)
- [LicheePi 4A/openEuler: Bump version to 24.03 LTS-SP1](https://github.com/ruyisdk/support-matrix/pull/136)
- [LicheePi4A/RevyOS: bump to 20250110](https://github.com/ruyisdk/support-matrix/pull/137)
- [DuoS/Buildroot: Bump version to v2.0.0, change repo url](https://github.com/ruyisdk/support-matrix/pull/138)
