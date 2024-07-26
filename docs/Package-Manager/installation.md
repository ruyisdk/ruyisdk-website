---
sidebar_position: 2
---

# 安装

让我们从 RuyiSDK 包管理器的安装开始：

## 获取 ruyi 包管理器

目前 RuyiSDK 包管理器工具目前能在 **amd64**、**arm64**、**riscv64** 三种架构在 **Linux** 系统下运行，可以从如下链接中下载：

- [ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/)
- [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)

你可以首先使用 `ruyi update` 从配置的软件源中获得本地软件包缓存的更新，再使用 `ruyi list` 查看目前所支持的包。

> 若还有其余相关问题可以访问 ruyi 包管理器[仓库文档](https://github.com/RuyiSDK/ruyi)（目前仅支持英文）参阅。

## amd64 架构示例

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.15.0/ruyi.amd64  #从软件源下载ruyi本体
$ chmod +x ./ruyi.amd64  #给ruyi添加执行权限
$ sudo cp ruyi.amd64 /usr/local/bin/ruyi #将ruyi本体改名为ruyi，并放入PATH
$ ruyi version #成功！
Ruyi 0.15.0

Running on linux/x86_64.

Copyright (C) 2023 Institute of Software, Chinese Academy of Sciences (ISCAS).
All rights reserved.
License: Apache-2.0 <https://www.apache.org/licenses/LICENSE-2.0>

This version of ruyi makes use of code licensed under the Mozilla Public
License 2.0 (https://mozilla.org/MPL/2.0/). You can get the respective
project's sources from the project's official website:

* certifi: https://github.com/certifi/python-certifi
```

> `ruyi version` 应当可以正常打印版本信息。**注意二进制的文件名必须为** ruyi。

列出帮助信息：

```bash
$ ruyi --help

usage: ruyi [-h] [-V] [--porcelain] {device,extract,install,i,list,news,update,venv,admin,self,version} ...

RuyiSDK Package Manager 0.15.0

options:
  -h, --help            show this help message and exit
  -V, --version         Print version information
  --porcelain           Give the output in a machine-friendly format if applicable

subcommands:
  {device,extract,install,i,list,news,update,venv,admin,self,version}
    device              Manage devices
    extract             Fetch package(s) then extract to current directory
    install (i)         Install package from configured repository
    list                List available packages in configured repository
    news                List and read news items from configured repository
    update              Update RuyiSDK repo and packages
    venv                Generate a virtual environment adapted to the chosen toolchain and profile
    admin               (NOT FOR REGULAR USERS) Subcommands for managing Ruyi repos
    self                Manage this Ruyi installation
    version             Print version information

```

### 其他说明

1. 由于目前软件包索引信息托管于 GitHub 仓库，国内访问可能会产生不稳定等问题，若出现 `ruyi update` 执行时连续报错，可将仓库更换成 [备用仓库](https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git)。

2. 具体操作：参考 ruyi [仓库文档](https://github.com/RuyiSDK/ruyi)在 ruyi 包管理工具默认的配置目录 `~/.config/ruyi` 下通过 `config.toml` 文件配置(不同 linux 发行版可能不同，如果无可自己创建)。

## 总结

以上场景介绍了 ruyi 包管理器和工具的基本使用，包括：

- 安装 `ruyi`
- 使用 `ruyi list` `ruyi update` `ruyi install` 功能
- 若出现网络不稳定的备用方案

ruyi 包管理器相关的更多命令以及命令具体使用方法请参阅[功能介绍](../Package-Manager/index.md)。

### 使用案例

目前有一些简单的使用案例提供参考，请参阅使用案例栏目。
