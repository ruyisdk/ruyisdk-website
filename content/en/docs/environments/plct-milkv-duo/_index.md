---
title: 使用 PLCT 工具链配置 Milkv-Duo 编译环境
weight: 3
date: 2017-01-05
description: 
---

PLCT 工具链软件包名为 gnu-plct ， v0.2 最新版本 x86-64 架构二进制为 gnu-plct-20231212  ， riscv64 架构二进制为 gnu-plct-20231118 ：

在 x86-64 环境：

```bash
$ ruyi install slug:gnu-plct-20231212
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  232M  100  232M    0     0  10.4M      0  0:00:22  0:00:22 --:--:-- 11.0M
info: extracting RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz for package gnu-plct-0.20231212.0
info: package gnu-plct-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-plct-0.20231212.0
```

在 riscv64 环境：

```bash
$ ruyi install slug:gnu-plct-20231118
```

由预置的 milkv-duo 配置在 ``./milkv-venv`` 目录建立编译环境：

```bash
$ ruyi venv -t slug:gnu-plct-20231212 milkv-duo ./milkv-venv
info: Creating a Ruyi virtual environment at milkv-venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myon/ruyisdk/ruyi/milkv-venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.

```

查看可用的工具链二进制：

```bash
$ ls ./venv/bin/
riscv64-plct-linux-gnu-addr2line  riscv64-plct-linux-gnu-gcc            riscv64-plct-linux-gnu-gfortran  riscv64-plct-linux-gnu-ranlib
riscv64-plct-linux-gnu-ar         riscv64-plct-linux-gnu-gcc-ar         riscv64-plct-linux-gnu-gprof     riscv64-plct-linux-gnu-readelf
riscv64-plct-linux-gnu-as         riscv64-plct-linux-gnu-gcc-nm         riscv64-plct-linux-gnu-ld        riscv64-plct-linux-gnu-size
riscv64-plct-linux-gnu-c++        riscv64-plct-linux-gnu-gcc-ranlib     riscv64-plct-linux-gnu-ld.bfd    riscv64-plct-linux-gnu-strings
riscv64-plct-linux-gnu-cc         riscv64-plct-linux-gnu-gcov           riscv64-plct-linux-gnu-ldd       riscv64-plct-linux-gnu-strip
riscv64-plct-linux-gnu-c++filt    riscv64-plct-linux-gnu-gcov-dump      riscv64-plct-linux-gnu-lto-dump  ruyi-activate
riscv64-plct-linux-gnu-cpp        riscv64-plct-linux-gnu-gcov-tool      riscv64-plct-linux-gnu-nm
riscv64-plct-linux-gnu-elfedit    riscv64-plct-linux-gnu-gdb            riscv64-plct-linux-gnu-objcopy
riscv64-plct-linux-gnu-g++        riscv64-plct-linux-gnu-gdb-add-index  riscv64-plct-linux-gnu-objdump
```

除了 ``ruyi-activate`` 为激活编译环境用的脚本，其他均为工具链二进制。

激活编译环境：

```bash
$ . milkv-venv/bin/ruyi-activate
«Ruyi milkv-venv» $
```

此时应当可以正常调用工具链

```bash
«Ruyi milkv-venv» $ riscv64-plct-linux-gnu-gcc --version
riscv64-plct-linux-gnu-gcc (RuyiSDK 20231212 PLCT-Sources) 13.1.0
Copyright (C) 2023 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

```

退出编译环境：

```bash
«Ruyi venv» $ ruyi-deactivate
$
```

