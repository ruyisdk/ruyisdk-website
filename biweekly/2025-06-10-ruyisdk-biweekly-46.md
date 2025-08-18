---
authors: [jing, white, fox]
---
# 第 046 期·2025 年 06 月 10 日

## 卷首语

欢迎阅读第46期《RuyiSDK双周进展》！包管理器已更新新版本，欢迎下载试用。如果您在 RuyiSDK 的使用中遇到问题，欢迎参加每双周四下午 15:00 开展的 [“RuyiSDK Office Hours”](https://github.com/ruyisdk/ruyisdk/discussions/19) 获得在线答疑支持服务（下一次在6月19日），也可以在 [RuyiSDK讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 反馈。

下个开发版本计划6月24日发布，我们将持续带来更多改进。

## 包管理器

RuyiSDK 0.35 对应的包管理器版本也为 0.35.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.35.0-gh] 或 [ISCAS 镜像源][ruyi-0.35.0-iscas]下载体验。

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 现在会记录软件包的安装状态了。该信息在 `ruyi list` 输出中也会体现，并且支持在 `ruyi list` 时传入 `--is-installed y/n` 参数进行过滤。
* `ruyi entity list` 可以带一个或多个 `-t` / `--entity-type` 参数，用来列举特定类型的实体了。
* `ruyi entity list` 现在支持机读模式（porcelain mode）输出了。

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 新增了 Milk-V Duo (128M & 156M) 开发板镜像的历史版本。
* 修复了 Milk-V Duo (128M & 256M) 开发板镜像 2.0.0 版本的配置。
* 更新了多个 Milk-V Meles 的 RevyOS 镜像。
* 修复了 Milk-V Meles 的 RevyOS 镜像 1.20250123.0 版本的配置。
* 更新了一些文档链接的指向。
* 清理了已于 RuyiSDK 0.33 版本弃用的 RuyiSDK 设备安装器的旧版配置数据。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE

* RuyiSDK IDE 插件近期新增了自定义的 Welcome 欢迎页面的插件。通过自定义 Welcome，将产品简介、官网、博客、联系我们等常用链接都挂到了页面中；此外还提供了 New Project、Open Project、Setting的快速入口；还有Support Matrix、Documents、Discussions 链接。功能目前已经就绪，但是在以插件方式运行时还存在icon资源找不到的[问题](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues/20)，预计下个周期发布。可通过[Draft](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/download/untagged-3fb765ac95877af17b18/org.ruyisdk.intro_1.0.0.202506101633.jar)链接下载尝鲜。

## GCC

- 添加香山昆明湖CPU到gcc RISC-V后端，目前已合入gcc上游，添加时补充了一系列gcc缺失的特权模式扩展指令集。
- 修复了binutils中smnrmi缺失zicsr依赖的问题。

## V8

1. 在turbofan RISC-V后端中支持非经典NAN
   - [6621983: [riscv] Implement non-canonical NaNs fadds in turbofan](https://chromium-review.googlesource.com/c/v8/v8/+/6621983)
   - [6616397: [riscv][turboshaft] Propagate non-canonical NaNs](https://chromium-review.googlesource.com/c/v8/v8/+/6616397)
2. 在wasm的liftoff编译器RISC-V后端中支持代码覆盖统计
   - [6621984: [riscv][wasm] Wasm code coverage: Support Liftoff](https://chromium-review.googlesource.com/c/v8/v8/+/6621984)
3. 在RISC-V架构上实现JS undefined value的floating nan boxing
   - [6622041: [riscv][maglev][turboshaft] Fix more issues with HoleyFloat64 conversions](https://chromium-review.googlesource.com/c/v8/v8/+/6622041)
4. 指令选择优化compare zero
   - [6605164: [riscv] Optimize Comparezero](https://chromium-review.googlesource.com/c/v8/v8/+/6605164)
5. 调整maglev中临时寄存器分配作用域，使临时寄存器能尽快被使用
   - [6588676: [riscv] Adjust TemporaryRegisterScope to release kMaglevFlagsRegister quickly](https://chromium-review.googlesource.com/c/v8/v8/+/6588676)
6. 审阅并合入syntacore的针对jalr和jal指令的RAS特性所做的优化
   - [6562942: [riscv] improve calls/jumps to avoid RAS pollution](https://chromium-review.googlesource.com/c/v8/v8/+/6562942)
7. 审阅并合入syntacore的代码生成优化
   - [6593511: [riscv][maglev] Improve StringCharCodeOrCodePointAt to use sh1add instruction on Zba hardware](https://chromium-review.googlesource.com/c/v8/v8/+/6593511)
8. 修复指针压缩模式下对tagged smi的加减法溢出处理
   - [6605718: [riscv] Fix add/sub overflow failed in pointer compression mode](https://chromium-review.googlesource.com/c/v8/v8/+/6605718)
9. 实现优化JITed代码中的diapatch handle正确性保证代码
   - [6596491: [riscv][sandbox] Make sure we have a valid dispatch handle in optimized code](https://chromium-review.googlesource.com/c/v8/v8/+/6596491)
10. 删除InstructionSelectorAdapter，为删除turbofan的SON IR，全面使用turboshaft IR做好准备，
    - [6596249: [riscv][turbofan] Remove InstructionSelectorAdapter](https://chromium-review.googlesource.com/c/v8/v8/+/6596249)

## 操作系统支持矩阵

- [Duo 256M: update Debian 13.0 test report and fix some typos.](https://github.com/ruyisdk/support-matrix/pull/311)
- [Update ESP32P4 test report and fix metadata errors](https://github.com/ruyisdk/support-matrix/pull/312)
- [Mars: Add irradium, openKylin, openSUSE test reports.](https://github.com/ruyisdk/support-matrix/pull/313)
- [OrangePi RV2: Add irradium test report.](https://github.com/ruyisdk/support-matrix/pull/314)
- [LicheePi4A: Add irradium test report (CFT).](https://github.com/ruyisdk/support-matrix/pull/315)
- [Metadata: Fix redundant vendor, update CONTRIBUTING and temple metadata, add esp32-p4 metadata](https://github.com/ruyisdk/support-matrix/pull/316)
- [Clean deprecated codes](https://github.com/ruyisdk/support-matrix/pull/317)
- [Add metadata for oz64 and pinecone](https://github.com/ruyisdk/support-matrix/pull/319)
- [Visionfive/Alpine: Update result to basic.](https://github.com/ruyisdk/support-matrix/pull/320)
- [LicheePi 3A: Add board and systems; Some fixes and tweaks](https://github.com/ruyisdk/support-matrix/pull/321)
- [DuoS: Dump Debian to v1.6.31](https://github.com/ruyisdk/support-matrix/pull/322)

[ruyi-0.35.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.35.0
[ruyi-0.35.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.35.0/
