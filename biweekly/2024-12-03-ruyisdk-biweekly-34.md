---
authors: [jing]
---
# 第 034 期·2024 年 12 月 03 日

## 卷首语
RuyiSDK包管理器 V0.23 版本已于今日发布。包管理器遥测功能正式上线了，我们秉持最小化收集信息的原则，当前采用匿名化的方式收集一些与个人身份无关的设备信息和使用数据用于统计和优化产品服务，收集的数据与方式等详细信息详见[隐私政策](https://ruyisdk.org/docs/legal/privacyPolicy/))。请您放心，目前的数据是匿名化的，并不会有任何您的个人身份信息，因此也诚挚的希望您可以参与到数据上传反馈已助力我们改进服务，如果您拒绝上传，那么可以在使用前修改数据采集模式。如果您对当前的数据采集和隐私政策有任何疑问，可以通过 [contact@ruyisdk.cn](https://docs.qq.com/doc/contact@ruyisdk.cn) 联系我们。

此外，包管理器还针对兼容性支持、ruyi自动化打包，自动化测试等方面的支持上做了进一步的完善和优化，操作系统支持矩阵近期针对 milkv duo/duo256M/duoS也有不少更新，RuyiSDK更多进展细节详见下方详情，欢迎大家试用并提供反馈和建议 ，下一个开发版本 RuyiSDK V0.24 版本将在 12 月 17 日发布。

## 包管理器

RuyiSDK 0.23 对应的包管理器版本也为 0.23.0，已于昨日发布。您可移步
[GitHub Releases][ruyi-0.23.0-gh] 或 [ISCAS 镜像源][ruyi-0.23.0-iscas]下载体验。

[ruyi-0.23.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.23.0
[ruyi-0.23.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.23.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 出于项目验收要求，调整了默认遥测模式为 `on`。后续会随着 RuyiSDK 软件源的更新，周期性上传匿名化的使用统计数据。遥测服务端位于中国大陆境内，由 RuyiSDK 团队管理。
* 修复了与外部依赖 `semver` 2.x 版本的兼容性。
* 允许了在 CI 环境以 `root` 身份运行 `ruyi`。
* 每次发版会同时附带可重现（reproducible）的源码包了，有助于发行版打包工作等。

**注意：**由于活跃用户数等指标是项目 KPI，RuyiSDK 0.23
版本增加了遥测数据的上传功能，并**在所有环境默认开启**，不仅限于
CI。您可自行决定是否主动上传这部分匿名统计信息，以便
RuyiSDK 团队改进产品；您也可以选择删除先前的遥测数据，以及是否禁用遥测。您可用
`ruyi self clean --telemetry` 删除所有的遥测信息，包括设备信息。详情请见 RuyiSDK 0.19
的发布说明：[《RuyiSDK 双周进展汇报 第 030 期·2024年09月30日》][ruyisdk-biweekly-30]。

在遥测模式为 `on` 时，每次 `ruyi` 被调用时都会告知您您的遥测数据将在何时上传。您可以做以下操作之一以屏蔽该提示。

* 设置遥测模式为 `local` 或 `off`；
* 对数据上传行为给予同意。

具体的 `ruyi` 配置文件写法示例如下。该配置文件一般位于 `~/.config/ruyi/config.toml`
位置，如不存在，创建即可。

```toml
# 在 [telemetry] 一节体现以下内容之一。如不存在此节，创建即可：
[telemetry]

# 您可以变更遥测模式为 local 或 off:
mode = "local"

# 或告知 ruyi 您在当前日期时间给予了同意：
upload_consent = 2024-12-32T25:61:00+08:00
# 此日期格式并不合法，这是有意为之，请您自行填入您操作的当前时刻。例如执行以下命令：
#
#     echo "upload_consent = $(date -Iseconds)"
#
# 输出内容即可用于上述用途。
```

[ruyisdk-biweekly-30]: /biweekly/2024/09/30/ruyisdk-biweekly-30


欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
"探路 Eclipse RISC-V 插件开发”系列学习日志更新了Embeded CDT 插件的本地构建等实践说明。详见  [eclipse-myplugins](https://github.com/xijing21/eclipse-myplugins)  和[视频](https://space.bilibili.com/405461644)，欢迎更多的人加入到 Eclipse RISC-V 插件的学习和开发。

## GCC
Multiversion function的支持已合入gcc上游，继续完善P扩展的支持，重新提交了RISC-V Profiles的支持patch,正在沟通RV64ILP32规范格式问题。

## V8
1. 为Wasm构建一个写保护的代码指针表，后续会基于这个特性来继续实现向前跳转控制流完整性。
2. 为Builtin的AOT过程打开RISC-V扩展指令集选项，使builtin也可以使用各类扩展指令集，实现代码尺寸优化。优化效果：打开B扩展后，内置函数MathClz32的指令条数，优化之前 468，优化之后 308，静态代码减少了34%。

## 操作系统支持矩阵

本周进行了如下测试报告的更新：

| PR                                                 | Content                                  | Status |
| -------------------------------------------------- | ---------------------------------------- | ------ |
| https://github.com/ruyisdk/support-matrix/pull/105 | Metadata: add some version var           | Merged |
| https://github.com/ruyisdk/support-matrix/pull/106 | duo/duo256m: Add Yocto                   | Merged |
| https://github.com/ruyisdk/support-matrix/pull/108 | DuoS/RT-Thread,RT-Smart: Add results     | Merged |
| https://github.com/ruyisdk/support-matrix/pull/109 | duo256m: Update Alpine & RT-Thread Smart | Merged |
| https://github.com/ruyisdk/support-matrix/pull/110 | Updated OS support for DuoS and Mars     | Merged |

### 应用软件生态观测

丁丑小队本周对 OceanBase、openGauss 和 TiDB 在 TH1520 和 SG2042 平台的运行情况进行了观测。

测试报告现已公开在：https://github.com/QA-Team-lo/dbtest

本次测试仍存在一些问题，如有建议也欢迎各位直接在 issue 区提出。

## SDK
基于之前的验证和测试整理 Milkv Duo 重构需求：
- [Milkv Duo 重构需求](https://gitee.com/yunxiangluo/milkv-duo/blob/master/%E9%87%8D%E6%9E%84%E9%9C%80%E6%B1%82.md)
