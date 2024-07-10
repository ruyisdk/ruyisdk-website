---
sidebar_position: 4
---

# 编译工具链安装

通过前置步骤，你已经可以正确使用 ruyi 包管理器，在这个模块中我们更进一步的安装 RISC-V 上相关的编译器。

目前 ruyi 包管理器提供了不同组织所发布的 GNU 以及 LLVM 编译工具链，你可以通过 `ruyi list` 轻松的查看。

若要安装特定的安装包，请使用 `ruyi install` 或 `ruyi i` 完成安装。

### 其他说明

编译工具链的版本选择参考[RuyiSDK 编译工具](../Other/GNU-type)。

## 编译

### 代码准备

当正确获取了编译工具链后，可以通过 `git` 等任何方式获取源码到本地，同时，RuyiSDK 为新用户提供了一些代码示例，方便用户可以直接从 Ruyi Repo 的软件源中获取源码，可以通过如下指令实现：

```bash
# 从软件源下载并解压指定的源码包

ruyi extract

```

获取源码后，RuyiSDK 包管理器提供了虚拟环境技术，用户可以在系统中创建独立的环境，以确保对于不同版本编译工具链以及库文件进行环境隔离。
保证了用户在同以开发环境中能够安装使用不同的编译工具链版本，提供更好的环境隔离，保证开发过程的高效性。

我们建议在虚拟环境中进行编译操作，步骤如下：

```bash
# 开始编译
# 为隔离化编译创建虚拟环境，使用 ruyi venv -h 查看如何使用

ruyi venv

# 举例：创建一个叫 venv1 的虚拟环境，并指定编译工具链为 gnu-upstream，sysroot 为 generic 类型，使用 qemu-user-riscv-upstream 模拟器

ruyi venv -t gnu-upstream -e qemu-user-riscv-upstream   generic  venv1


# 激活虚拟环境

.  venv1/bin/ruyi-activate

# 编译需要编译的程序源代码
# 此部分没有统一规范，按照待编译程序自身的编译说明执行，这里以 coremark 为例：

#（1）设置 coremark 源码中的编译配置信息
sed -i 's/\bgcc\b/riscv64-unknown-linux-gnu-gcc/g'  linux64/core_portme.mak

#（2）执行交叉编译和构建，得到可执行程序 coremark.exe
make PORT_DIR=linux64 link

#（3）查看 rv64 可执行程序文件属性信息，初步检验可执行程序是否 RISC-V 架构
file coremark.exe
```

### 模拟运行

在进入该步骤前，请确保已经安装了编译所需的编译工具链、模拟器，并在虚拟环境中配置了 qemu 模拟器。

为确保 RISC-V 目标可执行程序的正确性，通过模拟器工具（如 qemu）模拟运行环境：

```bash
#  qemu user 模式下执行 rv64 coremark 可执行程序
ruyi-qemu   coremark.exe

# 在编译和运行结束后，退出虚拟环境
ruyi-deactivate

```

### 调试

> TODO
