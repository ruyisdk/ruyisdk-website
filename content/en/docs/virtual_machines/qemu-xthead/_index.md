---
title: 使用平头哥 QEMU 模拟器运行交叉编译的 RISC-V 二进制
description: 
date: 2017-01-04
weight: 8
---

这里在 x86-64 环境下使用平头哥工具链配置带 QEMU 支持的荔枝派 4A 编译环境，并使用平头哥 QEMU 运行构建出的 RISC-V 二进制。

```bash
$ ruyi install slug:gnu-plct-xthead-20231212 qemu-user-riscv-xthead
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  273M  100  273M    0     0  6462k      0  0:00:43  0:00:43 --:--:-- 6180k
info: extracting RuyiSDK-20231212-T-Head-Sources-riscv64-plctxthead-linux-gnu.tar.xz for package gnu-plct-xthead-0.20231212.0
info: package gnu-plct-xthead-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-plct-xthead-0.20231212.0
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/qemu-user-riscv-xthead-6.1.0.ruyi-20231207.amd64.tar.zst to /home/myon/.cache/ruyi/distfiles/qemu-user-riscv-xthead-6.1.0.ruyi-20231207.amd64.tar.zst
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 3577k  100 3577k    0     0  5226k      0 --:--:-- --:--:-- --:--:-- 5222k
info: extracting qemu-user-riscv-xthead-6.1.0.ruyi-20231207.amd64.tar.zst for package qemu-user-riscv-xthead-6.1.0-ruyi.20231207+g03813c9fe8
info: package qemu-user-riscv-xthead-6.1.0-ruyi.20231207+g03813c9fe8 installed to /home/myon/.local/share/ruyi/binaries/x86_64/qemu-user-riscv-xthead-6.1.0-ruyi.20231207+g03813c9fe8
```

建立编译环境：

```bash
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a -e qemu-user-riscv-xthead ./qemu_venv
info: Creating a Ruyi virtual environment at qemu_venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myon/ruyisdk/ruyi/qemu_venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.

```

查看可用的二进制：

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

可以看到 QEMU 模拟器的命令为 ``ruyi-qemu`` 。

进入编译环境：

```bash
$ . qemu_venv/bin/ruyi-activate
«Ruyi qemu_venv» $
```

编译一个简单的 C 程序并使用 QEMU 运行：

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

退出编译环境：

```bash
«Ruyi qemu_venv» $ ruyi-deactivate
$
```

