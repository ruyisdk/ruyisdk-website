---
title: 准备RISC-V开发环境
weight: 20
---

## 安装如意包管理工具

如意SDK包管理工具目前提供了Linux系统 amd64、arm64、riscv64 三种架构平台下的安装程序，可以按需在[ruyi GitHub Releases](https://github.com/ruyisdk/ruyi/releases/) 或 [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)下载体验。

包管理工具的安装非常简单，只需下载ruyi工具预构建的二进制文件，将下载的文件去掉后缀重命名为 `ruyi`，并使其具有可执行权限，最后放入 `$PATH` 路径下就可以开始了。具体的使用可参考ruyi仓库[文档](https://github.com/ruyisdk/ruyi)。

在安装完成后最常用的命令一般需要有：

```bash

#查看工具版本（由于ruyi滚动发版，请注意关注版本信息，建议使用最新版本）
ruyi -V

#从配置的软件源更新本地软件包缓存（获取最新缓存才能获取软件仓库最新的软件包资源，保证ruyi list 命令返回的数据最新）
ruyi update
```

> 说明：由于软件包索引信息目前托管的github仓库国内访问的网络不稳定性，因此如果存在ruyi update执行报连接错误，可将仓库切换到[备用仓库](https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git)，具体操作参考 ruyi 仓库[文档](https://github.com/ruyisdk/ruyi)在 ruyi 包管理工具默认的配置目录 `~/.config/ruyi` 下通过 config.toml 文件配置(不同linux发行版可能不同，如果无可自己创建)。

## 安装编译工具链

如意包管理器提供了不同组织发布的不同版本的GNU和LLVM编译工具链；可以使用如意包管理工具快速查询和安装：

```bash
#从本地软件包缓存中列出可用软件包
ruyi list

#下载并安装指定的软件包
ruyi install 或 ruyi i
```

编译工具链的版本选择参考[“编译工具链的不同扩展指令集实现与选择”](./typeselection/index)章节。

## 准备代码

开发者往往都有自己的开发需求，对于有开发经验或者开发目标的开发者而言，可以使用 `git` 或者任何你习惯的方式将代码下载到本地。如意SDK 为新人用户提供了一些代码示例，方便新手直接从如意软件源下载编译。

```bash
#从如意软件源下载并解压指定的源码包
ruyi extract
```

## 编译

如意SDK包管理器提供了虚拟环境技术，允许用户在系统中创建独立的环境，以隔离不同版本的编译工具链及库文件等。这样可以支持同一个开发环境中同时安装不同的编译工具链版本，并且相互不冲突和影响，提供更好的环境隔离。我们建议创建虚拟环境并在虚拟环境中进行编译操作，大致操作步骤如下：

```bash
#前提：已经安装了所需的编译工具链

#为隔离化编译创建虚拟环境，使用 ruyi venv -h 查看如何使用
ruyi venv
#举例：创建一个叫venv1的虚拟环境，并指定编译工具链为gnu-upstream，sysroot为generic类型，使用qemu-user-riscv-upstream模拟器
ruyi venv -t gnu-upstream -e qemu-user-riscv-upstream   generic  venv1


#激活虚拟环境
.  venv1/bin/ruyi-activate  

#编译需要编译的程序源代码
#此部分没有统一规范，按照待编译程序自身的编译说明执行，这里以coremark为例：
#（1）设置coremark源码中的编译配置信息
sed -i 's/\bgcc\b/riscv64-unknown-linux-gnu-gcc/g'  linux64/core_portme.mak
#（2）执行交叉编译和构建，得到可执行程序coremark.exe
make PORT_DIR=linux64 link
#（3）查看rv64可执行程序文件属性信息，初步检验可执行程序是否RISC-V架构
file coremark.exe

```

## 模拟运行

为了方便验证RISC-V目标可执行程序的正确性，一般通过模拟器工具来模拟运行环境：

```bash
#前提：已经提前安装了所需的编译工具链、模拟器，并在虚拟环境中配置了qemu模拟器

#qemu user模式下执行rv64 coremark可执行程序
ruyi-qemu   coremark.exe

#在编译和运行结束后，退出虚拟环境
ruyi-deactivate

```

## 调试

> TODO

上述结合使用场景简单的介绍了如意包管理器和工具的使用，ruyi 的更多命令和命令具体使用方法详见[“RUYI 包管理器”](../../ruyi/index)章节介绍。此外，目前也有一些简单的[使用案例](../../usecase/index)供参考。
