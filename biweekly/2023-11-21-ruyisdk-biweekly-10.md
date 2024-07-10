---
authors: [jing, arch]
---

# 第 010 期·2023 年 11 月 21 日

## 卷首语

即将进入年底，各类技术会议密集召开，各种新产品和新动态不断发布，各类社区的技术氛围空前浓厚。RuyiSDK 将在下个月按计划发布 V0.2 版本，欢迎大家关注和试用。

## 包管理器

需求变更：ruyi v0.2 新增了 sysroot、QEMU 的支持需求，该版本的代码冻结因而未在上周完成。
目前仍然在做 QEMU、LLVM 的打包工作。

完成了从上游源码、平头哥源码构建的 GCC 工具链的打包，期间修复了上游 crosstool-ng 的 [multilib 构建问题一处](https://github.com/xen0n/crosstool-ng/commit/12db6b2d83fe9deec1607813a63ee92e135a93c9)，待提交上游。

为方便未及时升级系统的同学们测试、使用，现已将工具链、`ruyi` 二进制的构建容器系统版本降低到了 Ubuntu 20.04。
但 `ruyi` 官方支持的系统版本基线维持不变：仍然为 Ubuntu 22.04、openEuler 23.09。

此外，对 RuyiSDK 软件源结构做了一些更新，详见[文档](https://github.com/ruyisdk/ruyi/blob/main/docs/repo-structure.md)：

- 为使 repo 内的软件包信息有条理，新增了软件包分类的概念，将原先扁平的目录结构加深 1 层；
- 为方便后续迭代、表达特殊语义等需要，预留了下划线开头的包名，后续再行 case-by-case 定义。

## IDE

IDE 部分 10 日提交了一版基于 Eclipse 已有插件集成的 x86_64 的可执行程序，界面定制部分仅完成可执行程序 LOGO 定制和加载界面定制，未按照预期完成所需的定制任务。后因为 IDE 开发人员变动，开发进度再无推进。

现处于 IDE 开发人员招聘中。

## GCC

完成了 Profiles 的 gcc 支持，重构了 zcmp 扩展的 binutils 实现，已向上游提交 patch，等待社区审核中。继续进行 B/K 扩展的 intrinsic 开发工作，预计本月完成支持后向上游提交工作。RUYISDK 工具链方面正在重构工具链分支以 RVV 扩展的最新特性，准备补充基础的 riscv-gcc 使用说明，包括支持扩展及常用选项参数等，预计 0.2 版本发布前完成。
