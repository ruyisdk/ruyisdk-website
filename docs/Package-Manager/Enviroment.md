---
sidebar_position: 3
---

# 编译环境

与 python 的虚拟环境类似，ruyi 包管理器工具使用 `venv` 命令应用配置到指定的工具链以建立编译环境。

ruyi 包管理预置的配置可以使用 `ruyi list profiles` 命令查看：

```bash
$ ruyi list profiles
generic
baremetal-rv64ilp32 (needs flavor(s): {'rv64ilp32'})
sipeed-lpi4a (needs flavor(s): {'xthead'})
milkv-duo
```

## 工具链与预置配置组合

ruyi 包管理在建立编译环境之前会检查该环境是否合法，但是并不保证建立成功的环境一定可用于构建。

这里列出了经过测试可用的配置组合：

|   工具链(toolchain)    |   sysroot    |  预置配置(profile)  |
| :--------------------: | :----------: | :-----------------: |
|      gnu-upstream      |     自带     |       generic       |
|        gnu-plct        |     自带     |       generic       |
|        gnu-plct        |     自带     |      milkv-duo      |
|        gnu-plct        |     自带     |   xiangshan-nanhu   |
|    gnu-plct-xthead     |     自带     |    sipeed-lpi4a     |
| gnu-plct-rv64ilp32-elf |      无      | baremetal-rv64ilp32 |
|     llvm-upstream      | gnu-upstream |       generic       |
|     llvm-upstream      |   gnu-plct   |       generic       |

## 创建虚拟环境

ruyiSDK 包管理器工具可使用 `ruyi venv` 创建虚拟环境，具体的使用方法可通过 `help` 命令获得：

```bash
$ ruyi venv -h
usage: ruyi venv [-h] [--name NAME] [--toolchain TOOLCHAIN] [--emulator EMULATOR] [--with-sysroot] [--without-sysroot]
                 [--sysroot-from SYSROOT_FROM]
                 profile dest

positional arguments:
  profile               Profile to use for the environment
  dest                  Path to the new virtual environment

options:
  -h, --help            show this help message and exit
  --name NAME, -n NAME  Override the venv's name
  --toolchain TOOLCHAIN, -t TOOLCHAIN
                        Specifier (atom) of the toolchain package to use
  --emulator EMULATOR, -e EMULATOR
                        Specifier (atom) of the emulator package to use
  --with-sysroot        Provision a fresh sysroot inside the new virtual environment (default)
  --without-sysroot     Do not include a sysroot inside the new virtual environment
  --sysroot-from SYSROOT_FROM
                        Specifier (atom) of the sysroot package to use, in favor of the toolchain-included one if applicable

```

参考上表代入具体的参数，不同的虚拟环境创建如下：

```bash
# 使用 GNU 上游工具链配置 RISC-V 编译环境：
$ ruyi venv -t gnu-upstream generic ./generic-venv

# 使用 PLCT 工具链配置 Milkv-Duo 编译环境：
$ ruyi venv -t gnu-plct milkv-duo ./milkv-venv

# 使用 PLCT 工具链配置香山南湖编译环境：
$ ruyi venv -t gnu-plct xiangshan-nanhu ./nanhu-venv

# 使用 LLVM 上游工具链配置 RISC-V 编译环境：
$ ruyi venv -t llvm-upstream --sysroot-from gnu-upstream generic ./llvm-venv

# 使用平头哥工具链配置荔枝派 4A 编译环境：
$ ruyi venv -t gnu-plct-xthead-20231212 sipeed-lpi4a ./sipeed-venv

# 使用上游 QEMU 模拟器运行交叉编译的 RISC-V 二进制
$ ruyi venv -t gnu-plct generic -e qemu-user-riscv-upstream ./qemu-venv

# 使用平头哥 QEMU 模拟器运行交叉编译的 RISC-V 二进制
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a -e qemu-user-riscv-xthead ./xthead-qemu-venv
```

## 在虚拟环境下编译

在创建虚拟环境之前，需要先 `ruyi install` 安装虚拟环境中使用的编译工具链、模拟器等所需的工具。

下面以任一个编译工具链在虚拟环境中编译程序一般的操作说明操作步骤：

1. 安装编译工具链

```bash
$ ruyi install gnu-upstream
```

3. 建立编译环境

```bash
$ ruyi venv -t gnu-upstream generic venv

# -t gnu-upstream 指定了编译工具链的类型和版本(版本除非指定，默认最新)；generic 表示 generic 类型的 profile；venv是自定义的虚拟环境名(相对路径目录名)

```

4. 查看可用的工具链二进制

```bash
$ ls ./venv/bin/
riscv64-unknown-linux-gnu-addr2line  riscv64-unknown-linux-gnu-gcc            riscv64-unknown-linux-gnu-gfortran  riscv64-unknown-linux-gnu-ranlib
riscv64-unknown-linux-gnu-ar         riscv64-unknown-linux-gnu-gcc-ar         riscv64-unknown-linux-gnu-gprof     riscv64-unknown-linux-gnu-readelf
riscv64-unknown-linux-gnu-as         riscv64-unknown-linux-gnu-gcc-nm         riscv64-unknown-linux-gnu-ld        riscv64-unknown-linux-gnu-size
riscv64-unknown-linux-gnu-c++        riscv64-unknown-linux-gnu-gcc-ranlib     riscv64-unknown-linux-gnu-ld.bfd    riscv64-unknown-linux-gnu-strings
riscv64-unknown-linux-gnu-cc         riscv64-unknown-linux-gnu-gcov           riscv64-unknown-linux-gnu-ldd       riscv64-unknown-linux-gnu-strip
riscv64-unknown-linux-gnu-c++filt    riscv64-unknown-linux-gnu-gcov-dump      riscv64-unknown-linux-gnu-lto-dump  ruyi-activate
riscv64-unknown-linux-gnu-cpp        riscv64-unknown-linux-gnu-gcov-tool      riscv64-unknown-linux-gnu-nm
riscv64-unknown-linux-gnu-elfedit    riscv64-unknown-linux-gnu-gdb            riscv64-unknown-linux-gnu-objcopy
riscv64-unknown-linux-gnu-g++        riscv64-unknown-linux-gnu-gdb-add-index  riscv64-unknown-linux-gnu-objdump
```

除了 `ruyi-activate` 为激活编译环境用的脚本，其他均为工具链二进制。

5. 激活构建环境，激活方式与 python 虚拟环境类似，并且改变提示符以提示当前进入编译环境中：

```bash
$ . venv/bin/ruyi-activate
«Ruyi venv» $
```

也可以使用 `source` 命令：

```bash
$ source venv/bin/ruyi-activate
«Ruyi venv» $
```

6. 调用工具链：

```bash
«Ruyi venv» $ riscv64-unknown-linux-gnu-gcc --version
riscv64-unknown-linux-gnu-gcc (RuyiSDK 20231212 Upstream-Sources) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

```

7. 编译
   可按需对指定程序执行编译操作。这里跳过具体事例。
8. 退出编译环境
   在编译或者运行验证完毕后，可以执行如下命令退出编译环境，退出后环境将被还原。

```bash
«Ruyi venv» $ ruyi-deactivate
$
```

> 实际操作中请注意将上述例子中的参数替换为正确的值。

## 模拟运行

在 x86-64 环境下使用平头哥工具链配置带 QEMU 支持的荔枝派 4A 编译环境，并使用平头哥 QEMU 运行构建出的 RISC-V 二进制 的操作参考如下：

1. 安装编译工具链

```bash
$ ruyi install gnu-plct-xthead qemu-user-riscv-xthead
```

2. 建立编译环境：

```bash
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a -e qemu-user-riscv-xthead ./qemu_venv

```

3. 查看可用的二进制：

```bash
$ ls qemu_venv/bin/
riscv64-plctxthead-linux-gnu-addr2line  riscv64-plctxthead-linux-gnu-gcc-ranlib     riscv64-plctxthead-linux-gnu-nm
riscv64-plctxthead-linux-gnu-ar         riscv64-plctxthead-linux-gnu-gcov           riscv64-plctxthead-linux-gnu-objcopy
riscv64-plctxthead-linux-gnu-as         riscv64-plctxthead-linux-gnu-gcov-dump      riscv64-plctxthead-linux-gnu-objdump
riscv64-plctxthead-linux-gnu-c++        riscv64-plctxthead-linux-gnu-gcov-tool      riscv64-plctxthead-linux-gnu-ranlib
riscv64-plctxthead-linux-gnu-cc         riscv64-plctxthead-linux-gnu-gdb            riscv64-plctxthead-linux-gnu-readelf
riscv64-plctxthead-linux-gnu-c++filt    riscv64-plctxthead-linux-gnu-gdb-add-index  riscv64-plctxthead-linux-gnu-size
riscv64-plctxthead-linux-gnu-cpp        riscv64-plctxthead-linux-gnu-gfortran       riscv64-plctxthead-linux-gnu-strings
riscv64-plctxthead-linux-gnu-elfedit    riscv64-plctxthead-linux-gnu-gprof          riscv64-plctxthead-linux-gnu-strip
riscv64-plctxthead-linux-gnu-g++        riscv64-plctxthead-linux-gnu-ld             ruyi-activate
riscv64-plctxthead-linux-gnu-gcc        riscv64-plctxthead-linux-gnu-ld.bfd         ruyi-qemu
riscv64-plctxthead-linux-gnu-gcc-ar     riscv64-plctxthead-linux-gnu-ldd
riscv64-plctxthead-linux-gnu-gcc-nm     riscv64-plctxthead-linux-gnu-lto-dump
```

可以看到 QEMU 模拟器的命令为 `ruyi-qemu` 。

4. 进入编译环境：

```bash
$ . qemu_venv/bin/ruyi-activate
«Ruyi qemu_venv» $
```

5. 编译一个简单的 C 程序并使用 QEMU 运行：

```bash
«Ruyi qemu_venv» $ cd qemu_venv/
«Ruyi qemu_venv» $ cat > test.c << EOF
#include <stdio.h>

int main()
{
    printf("hello, ruyi");
    putchar('\n');

    return 0;
}
EOF
«Ruyi qemu_venv» $ riscv64-plctxthead-linux-gnu-gcc -O3 test.c -o test
«Ruyi qemu_venv» $ ruyi-qemu ./test
hello, ruyi
```

6. 退出编译环境：

```bash
«Ruyi qemu_venv» $ ruyi-deactivate
$
```
