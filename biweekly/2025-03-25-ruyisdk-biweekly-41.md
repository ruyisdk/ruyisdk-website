---
authors: [jing, white]
---
# 第 041 期·2025 年 03 月 25 日

## 卷首语
大家好，RuyiSDK 项目组为了更好地帮助开发者掌握 RuyiSDK 的使用，让开发团队能更加深入了解大家的需求从而改进产品，我们诚挚邀请您参加 RuyiSDK Office Hours 线上会议（类似于RISC-V技术答疑时间）。我们期待与您通过线上会议的方式相聚，共同探讨如何提升 RuyiSDK 的用户体验。会议内容将主要围绕 RuyiSDK 的使用、问题与缺陷、改进建议等话题进行交流，同时也欢迎大家讨论与 RISC-V 相关的任何问题。

会议安排如下：
- 会议频率：每两周一次，默认使用中文沟通 
- 首次会议时间：2025年3月27日下午3:00（新加坡时间） 
- 加入会议：请点击以下链接参与 Zoom 会议：https://us02web.zoom.us/j/82424890125?pwd=GYiiMlWRzdatEgJbA1dCerlQIL41IE.1
- 会议 ID：824 2489 0125
- 密码：233233
- 请下载并导入以下的 iCalendar (.ics) 文件到您的日历系统：
 https://us02web.zoom.us/meeting/tZYpde2gpzsrGNELFFQsiXxsuF4htOrGV-wi/ics?icsToken=DNPKYCH23urOsaw6vwAALAAAAFpgDa4z_GQJOIDExsX09zeLWMjANUsgJt1_BJdOEWqW3bxsq1z4d0mPa2DBhhGcC-KVmYeQCvtTcF_dpjAwMDAwMQ

我们期待在会议中与您交流，共同推动 RuyiSDK 的发展！

参考链接：
- RuyiSDK ： https://ruyisdk.org/
- RevyOS ：https://docs.revyos.dev/  
- PLCT Lab ：https://plctlab.org/

下一个开发版本预计将在 2025 年 4 月 8 日发布。感谢您一直以来的支持与关注，如有任何问题，欢迎[联系我们](https://ruyisdk.org/contact/#%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC)，您的反馈是我们前进的动力！


## 包管理器

RuyiSDK 0.30 对应的包管理器版本也为 0.30.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.30.0-gh] 或 [ISCAS 镜像源][ruyi-0.30.0-iscas]下载体验。

[ruyi-0.30.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.30.0
[ruyi-0.30.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.30.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 修复了 `ruyi list --category-contains` 不工作的问题。
* 修复了全新安装 `ruyi` 之后直接进行 `ruyi install` 会崩溃的问题。
* 软件源格式更新：
    * 基于目前的设备安装器配置数据，新增实验性的结构化设备型号描述数据库，初期支持为每种设备型号描述其 CPU 与微架构能力。
* 工程化迭代：
    * 将 AArch64 架构的构建任务迁移至 GitHub Actions 公开免费提供的实例上，以降低 RuyiSDK 团队的维护成本。
    * 修复了 CI 开源许可证检查任务。

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE 近期正在实现基于包管理器（ruyi list）的软件包资源管理，功能开发中。

此外，RuyiSDK IDE 正在招聘插件开发实习生，欢迎有兴趣的小伙伴加入开发团队，详情参考 [J159 RuyiSDK IDE 开发实习生](https://github.com/lazyparser/weloveinterns/blob/master/open-internships.md) ，期待您的加入。

## GCC
提交了Ssnpm, Smnpm与Smmpm 的工具链支持，在社区中对玄铁C系列RISC-V芯片添加了mcpu选项支持

## LLVM

- 在 17.1.6 版本中新增默认 `_mu` 和 `_tum` 类 policy 的 XTHeadVector 内建指令，与 RVV 1.0 的命名方式提供更好的兼容性。
- 在 17.1.6 中修复 mask 版本的 vector bitwise logical 内建指令的指令选择问题。
- 在 17.1.6 中补全 vector integer merge 和 vector floating-point merge 相关的内建指令。

## V8
- 继续增加 WASM JSPI 的支持功能： 
  - in-sandbox chain of stacks 
  - 删除 jump buffer 外部指针
- 增加 C++ 垃圾回收模块的 Scan simulator stack and registers 功能
- 修复 WASM OOB Trap Handler 特性中，Fault Address Register 没有在 mcontext 中被正确设置的 bug
- 审阅并合入 syntacore 的2个 patch ：
  - 优化32位比较操作代码生成 
  - 类型转换优化
- 修复非对齐 load/store 的代码生成中临时寄存器不够用的问题
- 在指令选择阶段内联 Adapter's DeoptimizeView

## 操作系统支持矩阵

- [CONTRIBUTING: Add CONTRIBUTING.md and report-templates](https://github.com/ruyisdk/support-matrix/pull/193)
- [Add Ubuntu testing reports for MilkV DuoS](https://github.com/ruyisdk/support-matrix/pull/201)
- [Fix: broken Zephyr link](https://github.com/ruyisdk/support-matrix/pull/202)
- [Add/Update mangopi_mq_pro / dongshanpistu (2)](https://github.com/ruyisdk/support-matrix/pull/200)
- [Add Mars Deepin 25 test reports and Ubuntu LTS reports.](https://github.com/ruyisdk/support-matrix/pull/203)
- Web 前端
  - https://verforte.vercel.app/
  - https://github.com/panglars/VeRForTe
  - 开发中
