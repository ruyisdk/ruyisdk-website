# 使用编译环境进行 Coremark 构建

本文使用 Milkv-Duo 编译环境，构建 coremark 。

首先进入编译环境：

```bash
$ . milkv-venv/bin/ruyi-activate
«Ruyi milkv-venv» $
```

coremark 源码可以直接从 Ruyi 软件仓库中下载：

```bash
«Ruyi milkv-venv» $ mkdir coremark
«Ruyi milkv-venv» $ cd coremark
«Ruyi milkv-venv» $ ruyi extract coremark
info: downloading https://mirror.iscas.ac.cn/RuyiSDK/dist/coremark-1.01.tar.gz to /home/myon/.cache/ruyi/distfiles/coremark-1.01.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  391k  100  391k    0     0  1400k      0 --:--:-- --:--:-- --:--:-- 1404k
info: extracting coremark-1.01.tar.gz for package coremark-1.0.1
info: package coremark-1.0.1 extracted to current working directory
```

这个操作将从 Ruyi 软件源中下载 coremark 源码并解包到**当前目录**。

由于使用的工具链为 ``riscv64-plct-linux-gnu-gcc`` ，需要编辑构建脚本：

```bash
«Ruyi milkv-venv» $ sed -i 's/\bgcc\b/riscv64-plct-linux-gnu-gcc/g' linux64/core_portme.mak
```

构建 coremark：

```bash
«Ruyi milkv-venv» $ make PORT_DIR=linux64 link
riscv64-plct-linux-gnu-gcc -O2 -Ilinux64 -I. -DFLAGS_STR=\""-O2   -lrt"\" -DITERATIONS=0  core_list_join.c core_main.c core_matrix.c core_state.c core_util.c linux64/core_portme.c -o ./coremark.exe -lrt
Link performed along with compile
«Ruyi milkv-venv» $ file coremark.exe
coremark.exe: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64-lp64d.so.1, BuildID[sha1]=d9dbc7115d07d1953087dd2c1e5d46adc2ab0d4f, for GNU/Linux 4.15.0, with debug_info, not stripped
```

可以看到成功构建 RISC-V 架构的二进制。注意这整个过程如果在 riscv64 环境则不是交叉编译。

退出虚拟环境

```bash
«Ruyi milkv-venv» $ ruyi-deactivate
$
```

## 在最新的 Milkv Duo 镜像上运行

传送 coremark 二进制的 Milkv Duo， Milkv Duo 的 IP 地址请按实际情况更改。

```bash
$ scp -O ./coremark.exe root@192.168.42.1:~
```

在 Milkv Duo 上运行

```bash
[root@milkv-duo]~# ./coremark.exe
-sh: ./coremark.exe: not found
```

若出现这样的错误，则需要静态链接的二进制。

```bash
«Ruyi milkv-venv» $ make PORT_DIR=linux64 LFLAGS_END=-static link
riscv64-plct-linux-gnu-gcc -O2 -Ilinux64 -I. -DFLAGS_STR=\""-O2   -static"\" -DITERATIONS=0  core_list_join.c core_main.c core_matrix.c core_state.c core_util.c linux64/core_portme.c -o ./coremark.exe -static
Link performed along with compile
«Ruyi milkv-venv» $ file coremark.exe
coremark.exe: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), statically linked, BuildID[sha1]=1548f6b30560e1ca6f3fa8ba3ef6aea4188feacf, for GNU/Linux 4.15.0, with debug_info, not stripped
```

重新上传后运行

```bash
[root@milkv-duo]~# ./coremark.exe
2K performance run parameters for coremark.
CoreMark Size    : 666
Total ticks      : 14911
Total time (secs): 14.911000
Iterations/Sec   : 2011.937496
Iterations       : 30000
Compiler version : GCC13.1.0
Compiler flags   : -O2   -static
Memory location  : Please put data memory location here
                        (e.g. code in flash, data on heap etc)
seedcrc          : 0xe9f5
[0]crclist       : 0xe714
[0]crcmatrix     : 0x1fd7
[0]crcstate      : 0x8e3a
[0]crcfinal      : 0x5275
Correct operation validated. See readme.txt for run and reporting rules.
CoreMark 1.0 : 2011.937496 / GCC13.1.0 -O2   -static / Heap
```

