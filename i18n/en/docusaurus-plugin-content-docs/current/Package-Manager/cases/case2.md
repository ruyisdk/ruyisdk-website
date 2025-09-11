---
sidebar_position: 2
---

# Building with Vendor-Provided Binary Toolchain (Using MilkV Duo as an Example)

This document demonstrates the process of building coremark using the Milkv-Duo compilation environment.

First, enter the compilation environment:

```bash
# Install the compilation toolchain gnu-milkv-milkv-duo-musl-bin
$ ruyi install gnu-milkv-milkv-duo-musl-bin
# Create a virtual environment milkv-venv with the generic profile
$ ruyi venv -t gnu-milkv-milkv-duo-musl-bin generic milkv-venv
# Activate the virtual environment
$ . milkv-venv/bin/ruyi-activate
«Ruyi milkv-venv» $
```

The coremark source code can be directly downloaded from the Ruyi software repository:

```bash
«Ruyi milkv-venv» $ mkdir coremark
«Ruyi milkv-venv» $ cd coremark
«Ruyi milkv-venv» $ ruyi extract coremark
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/coremark-1.01.tar.gz to /home/myon/.cache/ruyi/distfiles/coremark-1.01.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  391k  100  391k    0     0  1400k      0 --:--:-- --:--:-- --:--:-- 1404k
info: extracting coremark-1.01.tar.gz for package coremark-1.0.1
info: package coremark-1.0.1 extracted to current working directory
```

This operation will download the coremark source code from the Ruyi software repository and unpack it into the **current directory**.

Since the toolchain used is ``gnu-milkv-milkv-duo-bin``, check the bin folder and edit the build script:

```bash
«Ruyi milkv-venv» $ sed -i 's/\bgcc\b/riscv64-unknown-linux-musl-gcc/g' linux64/core_portme.mak
```

Build coremark:

```bash
«Ruyi milkv-venv» $ make PORT_DIR=linux64 LFLAGS_END=-march=rv64gcv0p7xthead link
riscv64-unknown-linux-musl-gcc -O2 -Ilinux64 -I. -DFLAGS_STR=\""-O2   -march=rv64gcv0p7xthead"\" -DITERATIONS=0  core_list_join.c core_main.c core_matrix.c core_state.c core_util.c linux64/core_portme.c -o ./coremark.exe -march=rv64gcv0p7xthead
Link performed along with compile
«Ruyi milkv-venv» $ file coremark.exe
coremark.exe: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, interpreter /lib/ld-musl-riscv64v0p7_xthead.so.1, with debug_info, not stripped
```

You can see that the RISC-V architecture binary has been successfully built. Note that this entire process is not cross-compilation if performed in a riscv64 environment.

Exit the virtual environment:

```bash
«Ruyi milkv-venv» $ ruyi-deactivate
$
```

## Running on the Latest Milkv Duo Image

Transfer the coremark binary to the Milkv Duo. Change the IP address of the Milkv Duo according to your actual situation.

```bash
$ scp -O ./coremark.exe root@192.168.42.1:~
```

Run on the Milkv Duo:

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