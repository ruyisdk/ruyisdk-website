---
authors: [jing, white, fox]
---
# 第 044 期·2025 年 05 月 13 日

## 卷首语

欢迎阅读《RuyiSDK 双周进展汇报》第 44 期，包管理器 和 ide 都有版本更新，欢迎下载试用。如果您在 RuyiSDK 的使用中遇到问题，欢迎参加每双周四下午 15:00 开展的 [“RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务（下一次在5月22日），也可以在 [RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈。

下个开发版本计划 5月27日发布，我们将持续带来更多改进。

## 包管理器

RuyiSDK 0.33 对应的包管理器版本也为 0.33.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.33.0-gh] 或 [ISCAS 镜像源][ruyi-0.33.0-iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 将设备安装器的数据源迁移到了实体数据库，以降低维护成本、避免频繁更新时潜在的合并冲突等。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 完善了设备支持：
  * 新增支持了 Milk-V Meles 的 16G RAM 型号，支持 RevyOS 系统。
* 实体数据库更新：
  * 设备实体定义更新：设备型号变体现已被拆分为单独实体类型 `device-variant` 了。
  * 新增了“设备适用系统信息”实体 `image-combo`。
* 现已弃用旧版设备安装器支持，请尽快更新您的 RuyiSDK 包管理器。该支持将于 RuyiSDK 0.35 移除。

本次 RuyiSDK 服务端组件的更新主要包含了以下内容：

* 新增了官方软件源的新闻条目阅读 API。
* 新增了按版本号查询 RuyiSDK 版本发行注记的 API。
* 将官方软件源当前目录结构下的所有子目录都纳入了下载量统计范围。
* 改进了服务容器的构建方式。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

* RuyiSDK IDE 插件版本 0.0.4 发布：

  * 新增 ruyi 包管理器检测、安装及版本更新向导。
  * 新增 RuyiSDK 配置面板 (Windows > Preferences > RuyiSDK):

    * Ruyi 配置项：开机自动检测开关、 Ruyi 安装路径设置、软件源配置、遥测模式选择
    * RISC-V 开发板管理（添加/编辑/删除/设默认）。
* 安装步骤:

  1. 从 ISCAS 镜像 下载并解压 [ruyisdk-0.0.3](https://mirror.iscas.ac.cn/ruyisdk/ide/0.0.3/)。
  2. 下载 [org.ruyisdk.ide_0.0.4.zip](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/tag/v0.0.4)，解压后将 plugins/ 下所有 JAR 文件复制到 ruyisdk/dropins/。
  3. 启动/重启 ruyisdk。
* 使用说明:

  * 启动时自动弹出 ruyi 安装/更新向导。
  * 手动操作：RuyiSDK > Ruyi Installation。
  * 配置路径：Windows > Preferences > RuyiSDK > Ruyi Config。

## GCC

* 更新了 RUYISDK 仓库中的 gcc 版本到 gcc15, binutils 版本到 binutils-2.45。支持了 Profiles 特性，包括 RV20/22/23A|B, 使用 -march=Profiles 可直接使能 Profiles 规定的强制支持扩展
* 支持了 `Sha`扩展组合，该扩展为 RVA23S64 中针对 RISC-V 虚拟化特性提出的最新扩展组合，用于高效实现虚拟化特性。修复回归测试中发现的 gcc 错误，限制了错误测试 case 中
* `-mgeneral-regs-only` 选项对应的架构范围，已被上游接收

## LLVM

- upstream：[Add zihintpause LLVM/Clang intrinsic](https://github.com/llvm/llvm-project/pull/139519)
- xtheadvector: [Add more semacheck for xtheadvector intrinsics](https://github.com/ruyisdk/llvm-project/pull/150)
- xtheadvector: [Fix vector integer minmax intrinsics and add wrappers](https://github.com/ruyisdk/llvm-project/pull/152)
- xtheadvector: [fix vmulhsu/vmulhu intrinsics](https://github.com/ruyisdk/llvm-project/pull/153)

## V8

* 增加从 isolate 中加载 JS Dispatch Table 的机制
* 增加 riscv zfh 指令集支持
* 添加 wasm growble stack 的特性

## 操作系统支持矩阵

- [Update Ubuntu test reports to 25.04 for Mars.](https://github.com/ruyisdk/support-matrix/pull/279)
- [Add OpenWRT and NuttX test reports for Mars and fix some typos.](https://github.com/ruyisdk/support-matrix/pull/281)
- [DuoS: Bump FreeRTOS to 1.1.4](https://github.com/ruyisdk/support-matrix/pull/283)
- [Star64/NuttX: Bump to 12.9.0](https://github.com/ruyisdk/support-matrix/pull/284)
- [Star64/Ubuntu: fix typo](https://github.com/ruyisdk/support-matrix/pull/285)
- [Duo/Alpine: Bump to 3.21.3](https://github.com/ruyisdk/support-matrix/pull/286)
- [Megrez/RockOS: Bump to 20250423](https://github.com/ruyisdk/support-matrix/pull/287)
- [LicheePi4A8+32G: Add Arch Linux](https://github.com/ruyisdk/support-matrix/pull/290)
- [Add ArchLinux test reports for Mars.](https://github.com/ruyisdk/support-matrix/pull/291)
- [megrez: RockOS: update to 20250423](https://github.com/ruyisdk/support-matrix/pull/288)
- [Pioneer/openCloudOS: Bump to main repo version](https://github.com/ruyisdk/support-matrix/pull/289)

[ruyi-0.33.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.33.0
[ruyi-0.33.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.33.0/
