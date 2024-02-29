---
title: 开始
description: 
date: 2017-01-04
weight: 6
---

## 安装依赖软件

RUYI 包管理器依赖一些外部工具，需要手动安装

**Debian/Ubuntu**

```bash
$ sudo apt-get install wget git tar bzip2 xz-utils zstd
```

**Fedora/openEuler**

```bash
$ sudo apt-get install wget git tar bzip2 xz zstd
```

## 安装 RUYI 包管理器

从发布[镜像](https://mirror.iscas.ac.cn/ruyisdk/ruyi/testing/)中选择合适架构的预编译二进制下载，当前 RUYI 包管理支持 amd64 和 riscv64 架构编译环境。

v0.2 版本的稳定二进制为 0.2.0-beta.20231211 版本。

**注意： v0.4.0 版本已经发布，查看 [v0.4.0 版本新增特性](/zh/ruyi/updates/0.4.0)**

**除了 RuyiSDK mirror 下载，亦可以从 [Github Release](https://github.com/ruyisdk/ruyi/releases) 下载**

这里以 amd64 架构环境为例进行安装：

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/testing/ruyi.amd64.20231211
$ chmod +x ./ruyi.amd64.20231211
$ sudo cp ruyi.amd64.20231211 /usr/local/bin/ruyi
$ ruyi version
Ruyi 0.2.0-beta.20231211
Copyright (C) 2023 Institute of Software, Chinese Academy of Sciences (ISCAS).
All rights reserved.
License: Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0>
```

``ruyi version`` 应当可以正常打印版本信息。注意二进制的文件名必须为 ``ruyi`` 。

列出帮助信息：

```bash
$ ruyi --help

RuyiSDK Package Manager 0.2.0-beta.20231211

options:
  -h, --help            show this help message and exit
  -V, --version         Print version information

subcommands:
  {extract,install,i,list,update,venv,admin,self,version}
    extract             Fetch package(s) then extract to current directory
    install (i)         Install package from configured repository
    list                List available packages in configured repository
    update              Update RuyiSDK repo and packages
    venv                Generate a virtual environment adapted to the chosen toolchain and profile
    admin               (NOT FOR REGULAR USERS) Subcommands for managing Ruyi repos
    self                Manage this Ruyi installation
    version             Print version information
```

## 刷新软件包缓存

更新软件包缓存，使用默认镜像即可：

```bash
$ ruyi update
```

软件包缓存将存放在用户目录中，通常为 ``~/.cache/ruyi`` ；在 ``XDG_CACHE_HOME`` 环境变量被设置时，目录为 ``$XDG_CACHE_HOME/ruyi`` 。
在本文档中家目录为 ``/home/myon`` 。

查看可用的软件包，该命令将列出所有可用的软件包：

```bash
$ ruyi list
List of available packages:

* source/ruyisdk-demo
  - 0.20231114.0 (latest)
* source/coremark
  - 1.0.2-pre.20230125 (prerelease, latest-prerelease)
  - 1.0.1 (latest)
* emulator/qemu-user-riscv-xthead
  - 6.1.0-ruyi.20231207+g03813c9fe8 (latest)
* emulator/qemu-user-riscv-upstream
  - 8.1.2-ruyi.20231121 (latest)
* toolchain/gnu-plct
  - 0.20231212.0 (latest) slug: gnu-plct-20231212
  - 0.20231118.0 () slug: gnu-plct-20231118
* toolchain/gnu-plct-xthead
  - 0.20231212.0 (latest) slug: gnu-plct-xthead-20231212
  - 0.20231118.0 () slug: gnu-plct-xthead-20231118
* toolchain/gnu-upstream
  - 0.20231212.0 (latest) slug: gnu-upstream-20231212
  - 0.20231118.0 () slug: gnu-upstream-20231118
* toolchain/llvm-upstream
  - 17.0.5-ruyi.20231121 (latest) slug: llvm-upstream-20231121
```

从输出可以看到软件包共分为三种，其中 ``source`` 代表了软件源码包， ``toolchain`` 代表了工具链二进制包， ``emulator`` 代表了模拟器二进制包。

如果软件包显示 “no binary for current host” 则该软件包的当前版本不支持本机架构。

列出所有软件包的详细信息：

```bash
$ ruyi list -v
```

### 安装软件包

使用 ``install`` 命令安装软件包，如 GNU 上游工具链：

```bash
$ ruyi install gnu-upstream
```

若希望重装一个软件包，则可以加上 ``--reinstall`` 参数：

```bash
$ ruyi install --reinstall gnu-upstream
```

### 安装源码包

RUYI 包管理器同时管理一些源码包，使用 ``extract`` 命令下载一个源码包并解包到当前目录：

```bash
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
```

### 搭建编译环境

已经安装的工具链与模拟器需要在 RUYI 编译环境中使用，这和 python 的虚拟环境十分类似。
这是由 ``venv`` 命令实现的：

```bash
$ ruyi venv --toolchain gnu-upstream --emulator qemu-user-riscv-upstream generic ./ruyi_venv
```

这个命令使用预置的 generic 配置，在 ``./ruyi_venv`` 目录建立包含 gnu-upstream 工具链和
 qemu-user-riscv-upstream 模拟器的编译环境。

具体使用参见“编译环境”与“具有 QEMU 支持的编译环境”章节。

### 卸载软件包

注意 RUYI 包管理器没有实现卸载 RUYI 软件包的功能。若您强制中断 RUYI 软件包安装进程或做了其他非预期操作
而会导致软件包功能异常时，请使用 ``install --reinstall`` 以尝试重试安装该软件包。

### 卸载 RUYI 包管理器

使用下面的命令卸载 RUYI 包管理器：

```bash
$ ruyi self uninstall
```

这个命令将会询问您以二次确认该操作，如果希望 RUYI 包管理不询问而直接执行：

```bash
$ ruyi self uninstall -y
```

上面的命令只是删除 RUYI 本身，并不会删除软件包缓存和安装的 RUYI 软件包。

如果希望删除所有缓存和安装了的软件包以实现干净的卸载：

```bash
$ ruyi self uninstall --purge
```

同样的这个命令将会询问您以二次确认该操作，如果希望 RUYI 包管理不询问而直接执行：

```bash
$ ruyi self uninstall --purge -y
```

实现 RUYI 包管理自身的升级可能会需要超级用户权限，而 RUYI 包管理被设计为避免进行需要超级用户权限的操作。
故在需要升级 RUYI 包管理时您需要手动进行该操作，即首先卸载 RUYI 包管理器，再执行安装 RUYI 包管理器的过程，
这个过程中您可以自主选择是否保留旧的软件包缓存和 RUYI 软件包。
