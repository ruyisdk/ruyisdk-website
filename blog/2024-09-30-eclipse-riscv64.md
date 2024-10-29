---
title: "Eclipse 上游初步支持 RISC-V，每日构建镜像已经可以下载试用"
authors: [white]
---
# Eclipse 上游初步支持 RISC-V，每日构建镜像已经可以下载试用

> 原文链接：https://riscv.org/blog-chinese/2024/09/eclipse-riscv64-support-upstreamed/
> 日期: September 30, 2024
> 作者：陈璇

Eclipse 是一款开源且功能强大的集成开发环境（IDE），广泛支持多种编程语言，为开发者提供了一个统一的平台，用于编写、调试和管理代码。同时，Eclipse 还具备强大的插件系统，可根据需求灵活扩展功能。

近期，来自中国科学院软件研究所（ISCAS）的 RevyOS 小队的工程师联合其他开源社区开发者，成功为 Eclipse 上游代码仓库引入了对 riscv64 架构的初步支持。期间创建了[二十余个 Issue/PR](https://github.com/eclipse-platform/eclipse.platform.releng.aggregator/issues/2310)，涵盖了包括 SWT、Equinox 在内的关键组件。目前，Eclipse 已支持在 riscv64 平台上基于 OpenJDK 开发 Java 项目。

![eclipse-pic-1.png](/img/eclipse-pic-1.png)

*图1-Eclipse upstream 涉及到几十个不同的组建和支持过程，许多开发者都进行了贡献*



相关改动已被合入上游，感兴趣的朋友可通过下方链接，建议选择 Integration Builds 板块中的最新构建日期（20240929以后每日构建支持riscv）进入每日构建资源页面，选择“Eclipse SDK -> Linux (64 bit version for RISC-V)”下载后进行体验。

https://download.eclipse.org/eclipse/downloads/index.html

![eclipse-pic-2.png](/img/eclipse-pic-2.png)

*图2-在安装了 Debian 操作系统的 SiFive Unmatched 上测试运行 Eclipse SDK IDE*


接下来，RevyOS 小队将继续完善 Eclipse riscv64 的支持，敬请期待更多优化与改进！

中国科学院软件研究所诚邀对开源技术充满热情的开源软件贡献者加入进来，助力 Eclipse 在 riscv64 平台上的发展。

**关于 ISCAS、RevyOS小队**

RevyOS小队隶属于 PLCT Lab, ISCAS。ISCAS 是 RISC-V International 的 Development Partner、Training Partner，同时在2024年8月获得了 RISC-V Ecosystem Labs 认证。

**特别致谢以下贡献者***

于波、陈璇、Hannes Wellmann、Alexander Kurtakov、Ed Merks、Pawel Stankiewicz、Frederic Gurr

*如有遗漏，请联系作者
