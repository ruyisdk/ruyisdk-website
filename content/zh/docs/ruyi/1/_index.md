---
title: RUYI 包管理器
weight: 10
---

# RUYI 包管理器

RUYI 包管理是 RuyiSDK中负责管理RUYISDK各种软件源的工具，用于管理工具链、模拟器、源码等各种二进制软件包和源码包。

- 官方仓库：https://github.com/ruyisdk/ruyi
- 下载地址：可在 [GitHub Releases](https://github.com/ruyisdk/ruyi/releases/) 或 [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases)下载最新版本体验
- 需求与问题：如意包管理器的问题和需求可以通过[仓库issue](https://github.com/ruyisdk/ruyi/issues)反馈

## 支持的发行版平台

当前 RUYI 包管理器具有良好的平台兼容性以及多发行版兼容性，目前经过测试可用的环境有（仅限验证过的）：

+ x86_64 Fedora 38
+ x86_64 Ubuntu 22.04 LTS
+ x86_64 openEuler 23.09
+ riscv64 RevyOS 20231210
+ riscv64 openEuler 23.09

上述操作系统链接参考本文文末的“附:外部链接”章节。

## 命令

RUYI 目前支持的命令如下：

```bash
# 从配置的软件源更新本地软件包缓存
ruyi update

# 从本地软件包缓存中列出可用软件包
ruyi list

# 下载并安装指定的软件包
ruyi install

# 列出已安装的配置
ruyi list profiles

# 由指定的工具链和配置建立 RUYI 虚拟环境
ruyi venv

# 下载并解包指定的源码包
ruyi extract

# 获取并查看更新信息
ruyi news

# 镜像信息的维护与下载、开发板系统的安装引导
ruyi device

# ruyi 镜像搭建工具（完善中）
ruyi admin

# 卸载 RUYI 包管理器
ruyi self uninstall

```

功能持续更新中，可以通过 `ruyi -h` 查看 ruyi 支持的命令。


## 附:外部链接

+ [Fedora38 Workstation](https://download.fedoraproject.org/pub/fedora/linux/releases/38/Workstation/x86_64/iso/)
+ [RevyOS 20231210](https://mirror.iscas.ac.cn/revyos/extra/images/lpi4a/20231210/)
+ [Ubuntu 22.04 LTS](https://www.releases.ubuntu.com/jammy/)
+ [openEuler 23.09 Images](https://repo.openeuler.openatom.cn/openEuler-23.09/ISO/)
