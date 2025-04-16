---
authors: [jing, white]
---
# 第 042 期·2025 年 04 月 08 日

## 卷首语
大家好，RuyiSDK 近期在持续迭代的基础上，也在用户支持上做出更多努力。围绕 RuyiSDK 的使用、问题与缺陷、改进建议等在线会议 RuyiSDK Office Hours 本周四将迎来第二次会议，欢迎您的关注与加入。

第2次RuyiSDK Office Hours会议安排如下：
- 会议频率：每两周一次，默认使用中文沟通 
- 首次会议时间：2025年4月10日下午3:00（新加坡时间） 
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

下一个开发版本预计将在 2025 年 4 月 22 日发布。感谢您一直以来的支持与关注，如有任何问题，欢迎[联系我们](https://ruyisdk.org/contact/#%E8%81%94%E7%B3%BB%E6%88%91%E4%BB%AC)，您的反馈是我们前进的动力！

## 包管理器

RuyiSDK 0.31 对应的包管理器版本也为 0.31.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.31.0-gh] 或 [ISCAS 镜像源][ruyi-0.31.0-iscas]下载体验。

[ruyi-0.31.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.31.0
[ruyi-0.31.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.31.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* RuyiSDK 设备安装器在需要安装的软件包不止一个可用版本的时候，会额外允许您选择一个非默认（最新）的版本了。如果您的开发板需要旧版本的系统，该功能对您可能有所帮助。
* 新增了实验模式开关：环境变量 `RUYI_EXPERIMENTAL`，用于启用一些我们暂不承诺兼容性的实验性功能。
* 新增了实验性功能：实体数据库。
    * 该功能有助于 RuyiSDK 为您提供与手头设备关联的有用信息。例如，可用 `ruyi list --related-to-entity device:sipeed-lpi4a` 查询适用于 Sipeed LicheePi 4A 的各种软件包了。
    * 初期支持 CPU 微架构（如香山南湖、玄铁 C910 等等）、CPU 型号（如香山南湖、玄铁 TH1520 等等）、设备型号（如 Sipeed LicheePi 4A 等等）、软件包等四种实体类型。
    * 这些功能为预览版，后续不排除作出不兼容变更以适应需求，因此仅在启用实验模式时才可用。如您有使用场景，请保持您的 `ruyi` 与软件源为最新。
* 工程化迭代：
    * 为避免 CI 物理机资源的临时下线等原因影响到发版，将 RISC-V 架构的构建任务也暂时迁移至 GitHub Actions 公开免费提供的实例上了。
    * 将构建 `ruyi` 的单文件分发版本所用的 Python 版本升级到了 3.13.2。
      
本次 RuyiSDK 软件源的更新主要包含了以下内容：
* 更新了 `toolchain/gnu-plct` 与 `toolchain/gnu-upstream` 两种工具链包到 0.20250401.0。敬请试用！
    * 其中，`gnu-plct` 工具链套件提供的软件版本如下：
       * binutils 2.42，PLCT 维护分支
       * gcc 14.1.0，PLCT 维护分支，含 P 扩展与 RV64ILP32 ABI 支持
       * gdb 16.0，PLCT 维护分支
       * glibc 2.40，PLCT 维护分支
       * linux-headers 6.13
    * `gnu-upstream` 工具链套件提供的软件版本如下：
       * binutils 2.43.1
       * gcc 14.2.0
       * gdb 16.2
       * glibc 2.41
       * linux-headers 6.13

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
- RuyiSDK IDE 近期正在优化启动功能，增加包管理器的安装检查、安装、版本检查、升级等功能；及执行过程中的执行状态显示；
- RuyiSDK IDE 正在招聘插件开发实习生，详情参考 [J159 RuyiSDK IDE 开发实习生](https://github.com/lazyparser/weloveinterns/blob/master/open-internships.md)  ，欢迎加入。

## GCC
- 修复了zicbop 的回归测试问题，正在实现 zvfbfa 扩展支持。

## LLVM

- 在 17.1.6 版本中修复了 vector reduction 内建指令的指令选择问题。

## V8
- Atomic views 适配 Tuboshaft IR；修复trap handler崩溃的问题
- 优化后端 opcde , 删除 RiscvCtz/RiscvPopcnt

## 操作系统支持矩阵

- [BPI-F3/openHarmony: Fix date](https://github.com/ruyisdk/support-matrix/pull/212)
- [Duo/OpenWrt: new test report](https://github.com/ruyisdk/support-matrix/pull/213)
- [Duo/OpenWrt: remove others.yml](https://github.com/ruyisdk/support-matrix/pull/214)
- [Add Fedora and update Debian test reports for Mars; fix some typos.](https://github.com/ruyisdk/support-matrix/pull/216)
- [Star64/Armbian: update link](https://github.com/ruyisdk/support-matrix/pull/235)
- [Ports documentation from oscompare](https://github.com/ruyisdk/support-matrix/pull/163)
- [LicheePi4A: add openEuler 25.03](https://github.com/ruyisdk/support-matrix/pull/237)
- 网页前端 [VeRForTe](https://github.com/panglars/VeRForTe):
  - 新增：Others
  - 支持 GitHub Markdown 语法
