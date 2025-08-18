# RuyiSDK 双周进展汇报  第 049 期·2025 年 07 月 22 日

## 卷首语

近期，RISC-V 生态发展迎来了一系列重要活动——"RISC-V 中国峰会"、"RISC-V校园行·香港城市大学站"等活动相继举办。团队小伙伴积极参与其中，不仅展示了我们的成果，也与行业同仁进行了深入交流，共同探讨技术发展趋势。由于这段时间的精力部分投入在这些行业活动中，本期更新内容相对精简，还请大家理解。后续我们将持续带来更多精彩内容，敬请关注！

我们特别欣喜地发现，[RuyiSDK 论坛](https://ruyisdk.cn) 正变得越来越活跃，我们也收到了一些开发者在这里分享使用心得、提出宝贵建议。大家的每一条反馈我们都在认真对待，并已着手进行针对性优化——正是这些真诚的声音推动着我们不断进步，在此向所有支持者致以衷心感谢！也欢迎更多小伙伴加入，一起打造更好的 RuyiSDK。

如果您在使用过程中遇到任何问题，还可以通过以下方式获得支持：

- 参与 7月31日（周四）15:00 举办的 [第十次 RuyiSDK Office Hours](https://github.com/ruyisdk/ruyisdk/discussions/19)，我们将提供在线答疑服务

- 在 [ruyisdk.cn RuyiSDK](https://ruyisdk.cn/c/ruyisdk/9)板块 或者 [RuyiSDK GitHub 讨论区](https://github.com/ruyisdk/ruyisdk/discussions) 留言交流

根据当前规划，下一个开发版本将于 8月12日 发布，我们将持续优化功能体验，为大家带来更多惊喜。期待与您共同见证 RuyiSDK 的成长！


## 包管理器

RuyiSDK 0.38 对应的包管理器版本也为 0.38.0，已于今日发布。您可移步
[GitHub Releases][ruyi-0.38.0-gh] 或 [ISCAS 镜像源][ruyi-0.38.0-iscas]下载体验。

[ruyi-0.38.0-gh]: https://github.com/ruyisdk/ruyi/releases/tag/0.38.0
[ruyi-0.38.0-iscas]: https://mirror.iscas.ac.cn/ruyisdk/ruyi/tags/0.38.0/

本次 RuyiSDK 包管理器的更新主要包含了以下内容：

* 为 RuyiSDK 设备安装器新增了 `ruyi device flash` 这一别名，以便理解记忆。感谢 RuyiSDK 社区论坛的 [@Sequel] 同学反馈！
* 当 `ruyi` 需要调用某些外部命令但无法找到时，如果当前终端可以交互，会等待您安装以便重试了。您可以在另一个终端下安装所需命令，再回到 `ruyi` 所在终端按回车键继续。您也可以按 Ctrl+C 退出。感谢 RuyiSDK 社区论坛的 [@Sequel] 同学反馈！

[@Sequel]: https://ruyisdk.cn/u/Sequel

本次 RuyiSDK 软件源的更新主要包含了以下内容：

* 完善了设备支持：
    * 新增了 Sipeed LicheePi 4A 的 RevyOS 的历史版本。感谢 [@Cyl18] 的贡献！
    * 新增了 Milk-V Duo 的 Arduino 的 1.1.2 与 1.1.4 两个版本。感谢 [@Cyl18] 的贡献！

[@Cyl18]: https://github.com/Cyl18

欢迎试用或来上游围观；您的需求是我们迭代开发的目标和动力。您也可以亲自参与
RuyiSDK 软件的打包与分发工作：目前您可以直接在 GitHub 上查看、修改我们的[部分打包脚本](https://github.com/ruyisdk/ruyici)与[软件源仓库](https://github.com/ruyisdk/packages-index)。今后，按照本年度的开发计划，我们也将支持有权的第三方贡献者通过程序化的方式上传软件包、系统镜像等分发文件，以便利打包工作。

## IDE
RuyiSDK IDE 进展：
- 新增了自定义统一日志和Console管理功能：
   - 统一日志管理：集成控制台输出、文件日志和Eclipse日志系统
   - 多级日志输出：支持DEBUG/INFO/WARN/ERROR分级输出
   - 日志存储：日志文件存储路径兼容XDG规范，默认存储于标准目录（~/.local/state/ruyisdkide/logs）
- 代码规范化管理：对代码格式进行规范化调整，进行中

## GCC
- 支持了P扩展 v015 版本与B扩展、K扩展的重复部分指令编码，添加了相关测试用例，已同步至RUYISDK仓库与社区
- 初步完成了P扩展 v015 版本的 intrinsic 草案，正在进行GCC开发支持
- Rebase了P扩展 v0911 版本的GCC支持到 GCC15

## V8
- [删除RISCV32下的冗余sign extend指令(只有32位计算，不需要向高32位扩展)](https://chromium-review.googlesource.com/c/v8/v8/+/6732071)
- [修复Smi到Word的bitcast，需要从Boxed 64bit中取出tagged的部分作为smi进行转换](https://chromium-review.googlesource.com/c/v8/v8/+/6731860)
- [在Turbolev IR中加入math.sqrt 操作 ](https://chromium-review.googlesource.com/c/v8/v8/+/6731441)
- [规范符号扩展的使用，删除sll32的不恰当用法](https://chromium-review.googlesource.com/c/v8/v8/+/6725218)
- [在ReflectApply builitin中删除负优化的zicond使用](https://chromium-review.googlesource.com/c/v8/v8/+/6718872)
- [baseline JIT中对OSR offset加入更多的运行时check机制 ](https://chromium-review.googlesource.com/c/v8/v8/+/6715563)
- [修复RISCV64和ARM64模拟器中缺失的ProbeMemory函数](https://chromium-review.googlesource.com/c/v8/v8/+/6715698)
- [删除g_thread_in_wasm_code flag ](https://chromium-review.googlesource.com/c/v8/v8/+/6702434)
- [删除liftoff中冗余的code emit size margin ](https://chromium-review.googlesource.com/c/v8/v8/+/6702989)
- 审阅Rivos提交5项，主要涉及后端的代码重构，typo修复和测试用例补充完善。

## 操作系统支持矩阵

- [Tests bump (for Pine64 Star64 and more)](https://github.com/ruyisdk/support-matrix/pull/342)
- [DuoS: Dump Debian](https://github.com/ruyisdk/support-matrix/pull/343)
- [LiP4A: Dump Slackware (basic->good)](https://github.com/ruyisdk/support-matrix/pull/344)
- [Boards: clean metadata, remove test enviroment, test results. ](https://github.com/ruyisdk/support-matrix/pull/345)
