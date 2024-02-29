---
title: 使用平头哥工具链配置荔枝派 4A 编译环境
weight: 3
date: 2017-01-05
description: 
---

从 ``list profiles`` 的输出可以看到，预置的 sipeed-lpi4a 配置需要支持 xthead 特性的工具链包。
若指定不支持该特性的工具链建立虚拟环境将会报错：

```bash
$ ruyi venv -t slug:gnu-plct-20231212 sipeed-lpi4a venv
fatal error: the package slug:gnu-plct-20231212 does not support all necessary features for the profile sipeed-lpi4a
info: feature(s) needed by profile:   xthead
info: feature(s) provided by package: (none)
```

从 ``ruyi list -v`` 中可以看到 gnu-plct-xthead 工具链是支持该特性的：

```bash
$ ruyi list -v

...

## toolchain/gnu-plct-xthead 0.20231212.0

...

### Toolchain metadata

* Target: riscv64-plctxthead-linux-gnu
* Flavors: ['xthead']
* Components:
    - binutils 2.35
    - gcc 10.2.0
    - gdb 10.0
    - glibc 2.33
    - linux-headers 6.4

...

```

平头哥工具链软件包名为 gnu-plct-xthead ， v0.2 最新版本 x86-64 架构二进制为 gnu-plct-xthead-20231212 ， riscv64 架构二进制为 gnu-plct-xthead-20231118 ：

在 x86-64 环境：

```bash
$ ruyi install slug:gnu-plct-xthead-20231212
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  273M  100  273M    0     0  9864k      0  0:00:28  0:00:28 --:--:-- 10.9M
info: extracting RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz for package gnu-plct-xthead-0.20231212.0
info: package gnu-plct-xthead-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-plct-xthead-0.20231212.0
```

在 riscv64 环境：

```bash
$ ruyi install slug:gnu-plct-xthead-20231118
```

由预置的 sipeed-lpi4a 配置在 ``./sipeed-venv`` 建立编译环境：

```bash
$ ruyi venv -t slug:gnu-plct-xthead-20231212 sipeed-lpi4a ./sipeed-venv
info: Creating a Ruyi virtual environment at sipeed-venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myon/ruyisdk/ruyi/sipeed-venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.

```

查看可用的工具链二进制：

```bash
$ ls ./sipeed-venv/bin/
riscv64-plctxthead-linux-gnu-addr2line  riscv64-plctxthead-linux-gnu-gcc-nm         riscv64-plctxthead-linux-gnu-ldd
riscv64-plctxthead-linux-gnu-ar         riscv64-plctxthead-linux-gnu-gcc-ranlib     riscv64-plctxthead-linux-gnu-lto-dump
riscv64-plctxthead-linux-gnu-as         riscv64-plctxthead-linux-gnu-gcov           riscv64-plctxthead-linux-gnu-nm
riscv64-plctxthead-linux-gnu-c++        riscv64-plctxthead-linux-gnu-gcov-dump      riscv64-plctxthead-linux-gnu-objcopy
riscv64-plctxthead-linux-gnu-cc         riscv64-plctxthead-linux-gnu-gcov-tool      riscv64-plctxthead-linux-gnu-objdump
riscv64-plctxthead-linux-gnu-c++filt    riscv64-plctxthead-linux-gnu-gdb            riscv64-plctxthead-linux-gnu-ranlib
riscv64-plctxthead-linux-gnu-cpp        riscv64-plctxthead-linux-gnu-gdb-add-index  riscv64-plctxthead-linux-gnu-readelf
riscv64-plctxthead-linux-gnu-elfedit    riscv64-plctxthead-linux-gnu-gfortran       riscv64-plctxthead-linux-gnu-size
riscv64-plctxthead-linux-gnu-g++        riscv64-plctxthead-linux-gnu-gprof          riscv64-plctxthead-linux-gnu-strings
riscv64-plctxthead-linux-gnu-gcc        riscv64-plctxthead-linux-gnu-ld             riscv64-plctxthead-linux-gnu-strip
riscv64-plctxthead-linux-gnu-gcc-ar     riscv64-plctxthead-linux-gnu-ld.bfd         ruyi-activate
```

进入编译环境并编译一个简单的 C 程序：

```bash
$ . sipeed-venv/bin/ruyi-activate
«Ruyi sipeed-venv» $ cd sipeed-venv/
«Ruyi sipeed-venv» $ cat > test.c << EOF
int main()
{
    return 0;
}
EOF
«Ruyi sipeed-venv» $ riscv64-plctxthead-linux-gnu-gcc test.c
«Ruyi sipeed-venv» $ file a.out
a.out: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64xthead-lp64d.so.1, BuildID[sha1]=a6c6dcc8a7565fc17427d8ece055874c9bbf6a7a, for GNU/Linux 4.15.0, with debug_info, not stripped
```

成功编译并生成 RISC-V 架构的二进制。

退出编译环境：

```bash
«Ruyi sipeed-venv» $ ruyi-deactivate
$
```

注意： 该编译环境构建的二进制，当前并不能在 RevyOS 运行，参见 issue [xthead 工具链构建产物无法在 RevyOS 运行](https://github.com/ruyisdk/ruyi/issues/22)
