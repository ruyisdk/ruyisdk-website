---
title: 文档
linkTitle: 文档
menu: {main: {weight: 20}}
weight: 20
---

{{% pageinfo %}}
RUYI 包管理是 RuyiSDK 开发中的包管理器。用于管理工具链、模拟器、源码等各种二进制软件包和源码包。
{{% /pageinfo %}}

## 支持的发行版平台

当前 RUYI 包管理器 v0.2 版本在以下平台进行了测试

+ x86_64 Fedora 38
+ x86_64 Ubuntu 22.04 LTS
+ x86_64 openEuler 23.09
+ riscv64 RevyOS 20231210
+ riscv64 openEuler 23.09

## 命令

RUYI 目前支持的命令如下：

```bash
ruyi list
# 从本地软件包缓存中列出可用软件包
ruyi list profiles
# 列出已安装的配置
ruyi update
# 从配置的软件源更新本地软件包缓存
ruyi install
# 下载并安装指定的软件包
ruyi venv
# 由指定的工具链和配置建立 RUYI 虚拟环境
ruyi extract
# 下载并解包指定的源码包
ruyi admin
# ruyi 镜像搭建工具（完善中）
ruyi self uninstall
# 卸载 RUYI 包管理器
```

## 外部链接

+ [Fedora38 Workstation](https://download.fedoraproject.org/pub/fedora/linux/releases/38/Workstation/x86_64/iso/)
+ [RevyOS 20231210](https://mirror.iscas.ac.cn/revyos/extra/images/lpi4a/20231210/)
+ [Ubuntu 22.04 LTS](https://www.releases.ubuntu.com/jammy/)
+ [openEuler 23.09 Images](https://repo.openeuler.openatom.cn/openEuler-23.09/ISO/)
