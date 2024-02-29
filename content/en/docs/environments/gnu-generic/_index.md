---
title: 使用 GNU 上游工具链配置 RISC-V 编译环境
weight: 3
date: 2017-01-05
description: 
---

GNU 上游工具链软件包名为 gnu-upstream ， v0.2 最新版本 x86-64 架构二进制为 gnu-upstream-20231212 ， riscv64 架构二进制为 gnu-upstream-20231118 ：

在 x86-64 环境：

```bash
$ ruyi install slug:gnu-upstream-20231212
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  232M  100  232M    0     0  4215k      0  0:00:56  0:00:56 --:--:-- 5113k
info: extracting RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz for package gnu-upstream-0.20231212.0
info: package gnu-upstream-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-upstream-0.20231212.0
```

slug 可以从 ``ruyi list`` 的输出中获取，且拷贝时应删除 ``slug: gnu-upstream-20231212`` 之间的空格，变为正确的格式 ``slug:gnu-upstream-20231212`` 。
该命令将调用 ``wget`` 或 ``curl`` 从远端软件源获取软件包 tarball ，解压并安装到用户目录。
软件包安装目录默认为 ``~/.local/share/ruyi`` ；在 ``XDG_DATA_HOME`` 环境变量被设置时，目录为 ``$XDG_DATA_HOME/ruyi`` 。

在 riscv64 环境：

```bash
$ ruyi install slug:gnu-upstream-20231118
```

也可以使用如下命令让 RUYI 自动选择最新版本安装，注意所安装的版本可能是 v0.2 以后的未测试版本。

```bash
$ ruyi install gnu-upstream
```

由预置的 generic 配置建立编译环境：

```bash
$ ruyi venv -t slug:gnu-upstream-20231212 generic venv
info: Creating a Ruyi virtual environment at venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myon/ruyisdk/ruyi/venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.

```

这里命令 ``generic`` 为如上选择的环境，`venv`为自定义的相对路径，使用 ``-t`` 参数指定工具链。
若使用包名则 RUYI 将自动选择具体的工具链版本：

```bash
$ ruyi venv -t gnu-upstream generic venv
```

查看可用的工具链二进制：

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

除了 ``ruyi-activate`` 为激活编译环境用的脚本，其他均为工具链二进制。

激活构建环境，激活方式与 python 虚拟环境类似，并且改变 ``PS1`` 以提示当前进入编译环境中：

```bash
$ . venv/bin/ruyi-activate
«Ruyi venv» $
```

也可以使用 source 命令：

```bash
$ source venv/bin/ruyi-activate
«Ruyi venv» $
```

调用工具链：

```bash
«Ruyi venv» $ riscv64-unknown-linux-gnu-gcc --version
riscv64-unknown-linux-gnu-gcc (RuyiSDK 20231212 Upstream-Sources) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

```

退出编译环境：

```bash
«Ruyi venv» $ ruyi-deactivate
$
```

环境将被还原。

