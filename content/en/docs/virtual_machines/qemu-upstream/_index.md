---
title: 使用上游 QEMU 模拟器运行交叉编译的 RISC-V 二进制
description: 
date: 2017-01-04
weight: 8
---

这里在 x86-64 环境下使用 plct 工具链配置带上游 QEMU 支持 RISC-V 编译环境，并使用 QEMU 运行构建出的 RISC-V 二进制。

```bash
$ ruyi install slug:gnu-plct-20231212 qemu-user-riscv-upstream
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/qemu-user-riscv-8.1.2.ruyi-20231121.amd64.tar.zst to /home/myon/.cache/ruyi/distfiles/qemu-user-riscv-8.1.2.ruyi-20231121.amd64.tar.zst
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 14.4M  100 14.4M    0     0  9523k      0  0:00:01  0:00:01 --:--:-- 9529k
info: extracting qemu-user-riscv-8.1.2.ruyi-20231121.amd64.tar.zst for package qemu-user-riscv-upstream-8.1.2-ruyi.20231121
info: package qemu-user-riscv-upstream-8.1.2-ruyi.20231121 installed to /home/myon/.local/share/ruyi/binaries/x86_64/qemu-user-riscv-upstream-8.1.2-ruyi.20231121
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  232M  100  232M    0     0  9380k      0  0:00:25  0:00:25 --:--:-- 8516k
info: extracting RuyiSDK-20231212-PLCT-Sources-riscv64-plct-linux-gnu.tar.xz for package gnu-plct-0.20231212.0
info: package gnu-plct-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-plct-0.20231212.0
```

建立编译环境：

```bash
$ ruyi venv -t gnu-plct generic -e qemu-user-riscv-upstream ./qemu_venv
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
riscv64-plct-linux-gnu-addr2line  riscv64-plct-linux-gnu-gcc            riscv64-plct-linux-gnu-gfortran  riscv64-plct-linux-gnu-ranlib
riscv64-plct-linux-gnu-ar         riscv64-plct-linux-gnu-gcc-ar         riscv64-plct-linux-gnu-gprof     riscv64-plct-linux-gnu-readelf
riscv64-plct-linux-gnu-as         riscv64-plct-linux-gnu-gcc-nm         riscv64-plct-linux-gnu-ld        riscv64-plct-linux-gnu-size
riscv64-plct-linux-gnu-c++        riscv64-plct-linux-gnu-gcc-ranlib     riscv64-plct-linux-gnu-ld.bfd    riscv64-plct-linux-gnu-strings
riscv64-plct-linux-gnu-cc         riscv64-plct-linux-gnu-gcov           riscv64-plct-linux-gnu-ldd       riscv64-plct-linux-gnu-strip
riscv64-plct-linux-gnu-c++filt    riscv64-plct-linux-gnu-gcov-dump      riscv64-plct-linux-gnu-lto-dump  ruyi-activate
riscv64-plct-linux-gnu-cpp        riscv64-plct-linux-gnu-gcov-tool      riscv64-plct-linux-gnu-nm        ruyi-qemu
riscv64-plct-linux-gnu-elfedit    riscv64-plct-linux-gnu-gdb            riscv64-plct-linux-gnu-objcopy
riscv64-plct-linux-gnu-g++        riscv64-plct-linux-gnu-gdb-add-index  riscv64-plct-linux-gnu-objdump
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
«Ruyi qemu_venv» $ riscv64-plct-linux-gnu-gcc -O3 test.c -o test
«Ruyi qemu_venv» $ ruyi-qemu ./test
hello, ruyi
```

退出编译环境：

```bash
«Ruyi qemu_venv» $ ruyi-deactivate
$
```

