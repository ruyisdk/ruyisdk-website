---
authors: [jing, white]
---
# 第 039 期·2025 年 02 月 25 日

## 卷首语
欢迎阅读《RuyiSDK 双周进展汇报》第 39 期。在过去的两周里，我们团队持续努力，推进各项功能的开发与优化，具体进展将在下文中详细呈现。

我们期待在2025年3月11日发布下一个开发版本，届时将带来更多创新与改进。感谢您一直以来的支持与关注，您的反馈是我们前进的动力！

## 包管理器

RuyiSDK 0.28 对应的包管理器版本也为 0.28.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.28.0-gh] 或 [ISCAS 镜像源][ruyi-0.28.0-iscas]下载体验。

[ruyi-0.28.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.28.0
[ruyi-0.28.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.28.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 运行不依赖软件源的命令时，如软件源仓库尚未拉取到本地，现在不会多余做拉取动作了。
* `ruyi list` 现在支持基本的过滤查询了：使用 `--category-is` 查询某个分类下的软件包，使用
  `--name-contains` 查询名称中包含特定字样的软件包。
* 考虑到软件包的数量持续增加，不带任何参数的 `ruyi list` 不再受到支持。如果您有依赖先前行为的脚本等，请按照提示修改使用方式。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 新增了以下软件包：
    * `source/wiringx`: wiringX 项目的官方源码。wiringX 是模块化的 GPIO 支持组件。
* 更新了以下软件包：
    * `board-image/bianbu-bpi-f3`
    * `board-image/revyos-milkv-meles`
    * `board-image/revyos-sg2042-milkv-pioneer`
* 修复了 `board-image/revyos-milkv-meles` 的 `boot` 分区的文件类型标记。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
- 实现 Eclipse 插件的三种导出和安装方式，输出[操作文档](https://github.com/xijing21/eclipse-myplugins/blob/main/chapter2-pluginIntro/2.4-exportAndInstall.md)
- 继续 RuyiSDK IDE Plugins 插件功能开发：
  - 增加启动时执行 `ruyi update` 命令，并展示未读的 `ruyi news` 信息（基于接口协议）
  - 实现关于缓存/配置路径的 RuyiPaths 工具类
  
  插件使用说明：
  
  0. 环境要求：要求环境中已经安装好了 ruyi ,您可以参考[文档](https://ruyisdk.org/docs/Package-Manager/installation)安装
  1. 下载 [org.ruyisdk.ide_0.0.2.jar](https://github.com/xijing21/eclipse-plugins/releases/download/v0.0.2/org.ruyisdk.ide_0.0.2.jar)。
  2. 访问 https://mirror.iscas.ac.cn/ruyisdk/ide/0.0.3/ 下载 ruyisdk-0.0.3 并解压。
  3. 将 org.ruyisdk.ide_0.0.2.jar 放入 ruyisdk ide 的 dropins 目录。
  4. 执行 ./ruyisdk 重启 IDE。启动后会自动弹出未读 News。

## GCC

实现了 Xqc 系列自定义厂商扩展支持，等待上游 review 中，继续维护 p 扩展实现，修复了工具链构建中的一些问题。

## LLVM

- 在 17.1.6 版本中修复了缺少 `th.vloxei` 和 `th.vsoxei` 指令的问题
- 在 17.1.6 版本中新增对部分内建函数操作数合法性检查的过程
- 在 17.1.6 版本中修复部分包装函数名称不符合 RVV 1.0 规范的问题，选择这些包装函数将同时提供 1.0 和 0.7.1 规范下的函数名，以便更方便地进行迁移
- 在 19.1.6 版本中修复了 MC 汇编器生成部分指令会出现编译器内部错误的问题

## V8
- Review 并合入 Leaptiering 支持
- 添加模拟器中对 fp16 类型指令的模拟例程
- 继续增加 Maglev 的特性支持
  
## 操作系统支持矩阵

- [meles/revyos: update to 20250123](https://github.com/ruyisdk/support-matrix/pull/160)
- [CI: Fix: Bump python version](https://github.com/ruyisdk/support-matrix/pull/161)
- [Updator: Add milkv-meles, milkv pioneer revyos](https://github.com/ruyisdk/support-matrix/pull/162)
- [Fix: exclude u-boot from boot](https://github.com/ruyisdk/support-matrix/pull/164)
- [Refactor: Use ruyi's minifest defination](https://github.com/ruyisdk/support-matrix/pull/165)
- [Updator: Add plugin for bpi-f3 ok and pioneer ok](https://github.com/ruyisdk/support-matrix/pull/166)
- [Megrez: update RockOS 20250219](https://github.com/ruyisdk/support-matrix/pull/167)
- [VisionFive2,LicheeRV Dock: update to Ubuntu 24.04.2 LTS](https://github.com/ruyisdk/support-matrix/pull/168)
- [Add TTGO T-Display-GD32 board & Add μC/OS-II](https://github.com/ruyisdk/support-matrix/pull/169)
- [Icicle: Ubuntu 24.04.2 LTS](https://github.com/ruyisdk/support-matrix/pull/171)
- [PIC64GX: Ubuntu 24.04.2](https://github.com/ruyisdk/support-matrix/pull/172)
- [Mars: Ubuntu 24.04.2](https://github.com/ruyisdk/support-matrix/pull/173)
- [Unmatched: Ubuntu 24.04.2](https://github.com/ruyisdk/support-matrix/pull/174)
