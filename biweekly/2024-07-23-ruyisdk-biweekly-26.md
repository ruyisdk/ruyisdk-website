---
authors: [jing, arch]
---

# 第 026 期·2024 年 07 月 23 日

## 卷首语

RuyiSDK V0.15 版本已于今日发布。 这个版本，包管理器**为多语言支持进行了准备**，完成了用户系统区域、语言配置与包管理器语言版本的匹配；同时**包管理器支持了不依赖 Docker 的构建方式**，为 Linux 发行版打包 ruyi 和将 ruyi 集成到 Linux 发行版提供了更多样的构建方式。RuyiSDK 软件源随着 Box64 上游版本的更新，将**Box64 版本更新到 0.3.0 版本，并完善了对 WPS 的支持和文档**；

此外，**RuyiSDK 初步集成了 Canaan Kendryte K230D 开发板**，由 RuyiSDK 受权打包的 CanMV Linux SDK 镜像，附带演示程序（提供 LP64 与 RV64ILP32 两种 ABI），不过相关资源依然在更新和完善，RuyiSDK 也将及时更新集成的 SDK 资源。

RuyiSDK 更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议。

因 8 月亚洲多地（日本、中国）RISC-V 活动或峰会的开展，RuyiSDK 的部分小伙伴也有积极参与，因此近期的版本发布时间将有所调整，下一个开发版本 RuyiSDK V0.16 版本将在 8 月 13 日发布（RuyiSDK V0.17 版本将在 9 月 3 日发布）。

这里附上 RISC-V 近期一些会议链接，欢迎关注：

- [RISC-V Day Tokyo Summer 2024 (August 1)](https://riscv.org/event/risc-v-day-tokyo-summer-2024/)
- [RISC-V China Summit (August 19 - August 25)](https://riscv.org/event/risc-v-china-summit/ "RISC-V China Summit")

## 包管理器

RuyiSDK 0.15 对应的包管理器版本也为 0.15.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.15.0-gh] 或 [ISCAS 镜像源][ruyi-0.15.0-iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

- 为多语言支持做好准备：在需要输出本地化内容，如软件包的手工下载步骤说明等内容时，当用户系统的区域、语言配置与当前内容的可选区域、语言版本不完全匹配时，现在会尽可能地匹配了。

  > 例如：如果您将系统配置为新加坡英语，而某条内容仅提供美国英语与中国大陆中文两种版本，那么
  > `ruyi` 0.15.0 将为您展示美国英语内容，而非崩溃。

- 支持了不依赖 Docker 的构建方式，以方便发行版打包者，或不使用官方支持架构、系统组合的用户尝鲜
  `ruyi`。

  > 需要注意的是：因为目前 RuyiSDK 官方软件源的内容分发形式以二进制为主，所以想在非官方支持系统上使用
  > `ruyi` 的用户将需要组织起来，自行搭建另一套软件源。RuyiSDK 团队无法保证此种情况下的用户体验。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

- 软件源的结构不再与 `ruyi` 0.7.0 或更低版本兼容。是时候升级到最新版本了。
- `emulator/box64-upstream` 已更新到 0.3.0。
- 用 Box64 运行 WPS Office 的操作文档已更新。
- Ruyi 设备安装器现已新增支持以下设备型号与系统：
  - Canaan Kendryte K230D：由 RuyiSDK 受权打包的 CanMV Linux SDK 镜像，附带演示程序。提供 LP64 与 RV64ILP32 两种 ABI。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。

## IDE

开发方面暂无进展；基于 Milkv Duo 开发板，调研并跑通了一些 Demo，作为集成的 SDK 的部分内容。

## GCC

Gprofng 的 RISC-V 后端支持已被上游合并，将作为 binutils 2.43 的新特性
更新了 P 扩展的 binutils 支持，正在开发 P 扩展的 draft 草案支持中

## LLVM

尝试使用该 LLVM 编译器，对 OpenCV 进行交叉编译，发现了如下缺失的 intrinsic，已经修复：

- 支持 Clang 内建函数 vssra/vssrl
- 支持 LLVM 内建函数 vssra/vssrl

## 官网

截止今日 7 月 23 日，订阅人数一共 38 人（增加 1 人）。RuyiSDK 网站访问人数 568 人（增加 62 人），访问页面 2710 次（增加 1286 次）。RuyiSDK 微信交流群 76 人。

Ruyi 包管理器下载量达 7009 次。Youtube 出现 RuyiSDK 俄语视频： [Чё? Прошивать Milk-V Duo S за 2 минуты!
](https://youtu.be/ufkJaEtEi4A?si=JsCAHYT8i-tF3vdN)

## 操作系统支持矩阵

本期更新：

- Deepin RISC-V
  - StarFive VisionFive
  - StarFive VisionFive 2
  - Sipeed Lichee Pi 4A
- openKylin RISC-V 2.0 RC
  - StarFive VisionFive 2
- Bianbu
  - Milk-V Jupiter (CFT)
- Debian
  - Milk-V Duo S 更新至最新版 v1.4.0
- 一些小的 Typo Fix

内容请详见：[ruyisdk/support-matrix](https://github.com/ruyisdk/support-matrix)

[ruyi-0.15.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.15.0
[ruyi-0.15.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.15.0/
