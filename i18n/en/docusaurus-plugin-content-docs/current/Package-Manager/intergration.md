---
sidebar_position: 4
---

# Using Integration Features

In addition to its fundamental package management capabilities as a package manager, the Ruyi package manager also provides integrations for toolchains, simulators, images, and other software packages.

You can:

+ Obtain commonly used source code packages provided by RuyiSDK
+ Conveniently combine toolchains and simulators to establish a Ruyi virtual environment targeting a specific RISC-V CPU platform without needing to understand excessive details
+ Create isolated environments within the system to ensure environment separation for different versions of compilation toolchains and library files, thereby maintaining development efficiency
+ Flash system images for a specific model and configuration of a RISC-V SOC development board
+ Find well-supported real-time operating systems for a specific RISC-V microcontroller

## Ruyi Virtual Environment

The `venv` command of the Ruyi package manager tool is used to combine toolchains and simulators to establish a virtual environment. The compilation environment provides configurations required for different development boards, automatically passing the necessary parameters for compilation.

### Virtual Environment Configuration

The Ruyi software repository already provides some pre-configured profiles that do not require installation. These profiles can be listed using the `ruyi list profiles` command:

```bash
$ ruyi list profiles
generic
baremetal-rv64ilp32 (needs flavor(s): {'rv64ilp32'})
xiangshan-nanhu
sipeed-lpi4a (needs flavor(s): {'xthead'})
milkv-duo
```

Some configurations require Ruyi toolchain packages that support specific flavor(s). You can check whether a toolchain package supports this feature in `ruyi list --verbose`. Alternatively, refer directly to the table in the "Toolchain and Pre-configured Profile Combinations" section.

### Toolchain and Pre-configured Profile Combinations

The Ruyi package manager checks for conflicts in the environment before establishing a virtual environment, but it does not guarantee that a successfully established environment will be usable. Flexible use of this feature requires some understanding of these toolchains. In general, you can refer directly to the table below.

Here is a list of tested and confirmed usable configuration combinations:

|    Toolchain(toolchain)   |   Sysroot   |  Pre-configured Profile(profile)  |  Build Target |
| :--------------------: | :----------: | :-----------------: | :---: |
|        gnu-plct        |     Built-in     |       generic       | Linux OS for riscv64 architecture |
|        gnu-plct        |     Built-in     |      milkv-duo      | MilkV Duo series development board image using glibc |
|        gnu-plct        |     Built-in     |   xiangshan-nanhu   | Xiangshan Nanhu |
|      gnu-upstream      |     Built-in     |       generic       | Linux OS for riscv64 architecture |
|    gnu-plct-xthead    |     Built-in     |    sipeed-lpi4a    | Thead C910 |
| gnu-plct-rv64ilp32-elf |      None      | baremetal-rv64ilp32 | rv64ilp32 bare metal |
|     llvm-plct         |   gnu-plct   |       generic       | Linux OS for riscv64 architecture |
|     llvm-upstream     | gnu-upstream |       generic       | Linux OS for riscv64 architecture |

|    Vendor-released Binary Toolchain(toolchain)   |   Sysroot   |  Pre-configured Profile(profile)  |  Build Target |
| :--------------------: | :----------: | :-----------------: | :---: |
| gnu-milkv-milkv-duo-elf-bin  |     None     |   generic   | Milkv Duo series development board bare metal (requires additional parameters) |
| gnu-milkv-milkv-duo-bin      |     Built-in   |   generic   | Milkv Duo series development board image using glibc (requires additional parameters) |
| gnu-milkv-milkv-duo-musl-bin |     Built-in   |   generic   | Milkv Duo series development board image using musl (requires additional parameters) |

For more information about compilation toolchains, please refer to [RuyiSDK Compilation Tools](../Other/GNU-type).

### Creating a Virtual Environment

The specific method for using the `venv` command can be obtained using the `-h` parameter:

```bash
$ ruyi venv -h
```

Here are some examples:

```bash
# Configure a RISC-V virtual environment using the GNU upstream toolchain:
$ ruyi venv -t gnu-upstream generic ./generic-venv

# Configure a Milkv-Duo virtual environment using the PLCT toolchain:
$ ruyi venv -t gnu-plct milkv-duo ./milkv-venv

# Configure a Xiangshan Nanhu virtual environment using the PLCT toolchain:
$ ruyi venv -t gnu-plct xiangshan-nanhu ./nanhu-venv

# LLVM usually requires the sysroot from GCC:
$ ruyi venv -t llvm-upstream --sysroot-from gnu-plct generic ./llvm-venv

# Configure a Lichee Pi 4A virtual environment using a specified version of the T-Head toolchain:
$ ruyi venv -t "gnu-plct-xthead(==0.20231212.0)" sipeed-lpi4a ./sipeed-venv

# Run cross-compiled RISC-V binaries using the upstream QEMU simulator
$ ruyi venv -t gnu-plct generic -e qemu-user-riscv-upstream ./qemu-venv

# Run cross-compiled RISC-V binaries using the T-Head QEMU simulator
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a -e qemu-user-riscv-xthead ./xthead-qemu-venv

# Multi-toolchain example, where gnu-upstream provides the sysroot
$ ruyi venv -t llvm-upstream -t gnu-upstream generic ./upstream-venv
```

The virtual environment is used to integrate toolchains, simulators, and other tools. Before creating a compilation environment, ensure that the corresponding Ruyi software packages are installed.

### Virtual Environment Integration

The following example uses gnu-upstream to describe virtual environment integration in detail. Please modify environment-related information such as paths and `PS1` based on actual understanding.

First, install the software packages required for this example:

```bash
$ ruyi install gnu-upstream qemu-user-riscv-upstream
```

Create a clean directory to run the example:

```bash
$ mkdir hello-ruyi
$ cd hello-ruyi
```

Obtain the ruyisdk-demo source code:

```bash
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
```

Establish a virtual environment:

```bash
$ ruyi venv -t gnu-upstream -e qemu-user-riscv-upstream generic ./myhone-venv
info: Creating a Ruyi virtual environment at myhone-venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myhone/hello-ruyi/myhone-venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.
```

This virtual environment integrates the gnu-upstream toolchain and qemu-user-riscv-upstream simulator, using the generic configuration targeting the riscv64 Linux operating system. The compilation environment is established in the `./myhome-venv` directory (absolute paths can also be used). The command output provides the method to activate the compilation environment, the command to exit the compilation environment, the absolute path of the sysroot directory, and some other information.

In the virtual environment directory, you can see files related to the compilation environment:

```bash
$ ls ./myhone-venv/
bin                                        ruyi-venv.toml
binfmt.conf                                sysroot
meson-cross.ini                            sysroot.riscv64-unknown-linux-gnu
meson-cross.riscv64-unknown-linux-gnu.ini  toolchain.cmake
ruyi-cache.v1.toml                         toolchain.riscv64-unknown-linux-gnu.cmake
```

Among them, `binfmt.conf` is an example configuration that can be used for systemd-binfmt, `toolchain.cmake` and `meson-cross.ini` can be used for cross-compilation of projects, `sysroot` is the sysroot used by this virtual environment, and the `bin` directory contains commands and scripts available in this compilation environment.

In the `bin` directory, you can view the available toolchain binaries:

```bash
$ ls ./myhone-venv/bin/
riscv64-unknown-linux-gnu-addr2line  riscv64-unknown-linux-gnu-gcc-ranlib     riscv64-unknown-linux-gnu-nm
riscv64-unknown-linux-gnu-ar         riscv64-unknown-linux-gnu-gcov           riscv64-unknown-linux-gnu-objcopy
riscv64-unknown-linux-gnu-as         riscv64-unknown-linux-gnu-gcov-dump      riscv64-unknown-linux-gnu-objdump
riscv64-unknown-linux-gnu-c++        riscv64-unknown-linux-gnu-gcov-tool      riscv64-unknown-linux-gnu-ranlib
riscv64-unknown-linux-gnu-cc         riscv64-unknown-linux-gnu-gdb            riscv64-unknown-linux-gnu-readelf
riscv64-unknown-linux-gnu-c++filt    riscv64-unknown-linux-gnu-gdb-add-index  riscv64-unknown-linux-gnu-size
riscv64-unknown-linux-gnu-cpp        riscv64-unknown-linux-gnu-gfortran       riscv64-unknown-linux-gnu-strings
riscv64-unknown-linux-gnu-elfedit    riscv64-unknown-linux-gnu-gprof          riscv64-unknown-linux-gnu-strip
riscv64-unknown-linux-gnu-g++        riscv64-unknown-linux-gnu-ld             ruyi-activate
riscv64-unknown-linux-gnu-gcc        riscv64-unknown-linux-gnu-ld.bfd         ruyi-qemu
riscv64-unknown-linux-gnu-gcc-ar     riscv64-unknown-linux-gnu-ldd
riscv64-unknown-linux-gnu-gcc-nm     riscv64-unknown-linux-gnu-lto-dump
```

This includes all toolchain commands, the QEMU user-mode simulator renamed as `ruyi-qemu`, and the `ruyi-activate` script used to enter the virtual environment. The toolchain commands are actually soft links to ruyi.

Source the `ruyi-activate` script to activate the build environment, and `PS1` will be modified:

```bash
$ source ./myhone-venv/bin/ruyi-activate
«Ruyi myhone-venv» $
```

At the same time, `PATH` is also modified, and you can now directly call the toolchain:

```bash
«Ruyi myhone-venv» $ whereis riscv64-unknown-linux-gnu-gcc
riscv64-unknown-linux-gnu-gcc: /home/myhone/hello-ruyi/myhone-venv/bin/riscv64-unknown-linux-gnu-gcc
«Ruyi myhone-venv» $ riscv64-unknown-linux-gnu-gcc --version
riscv64-unknown-linux-gnu-gcc (RuyiSDK 20231212 Upstream-Sources) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

In the Ruyi virtual environment, apart from automatically passing the configured architecture options to the toolchain, there is not much difference in the use of toolchains and simulators. For more content, please refer to the "Use Cases" chapter.

Build ruyisdk-demo:

```bash
$ cd rvv-autovec
$ make
```

After completing the use of the virtual environment, exit the compilation environment, and everything will be restored to the state before entering:

```bash
«Ruyi myhone-venv» $ ruyi-deactivate
$
```

## Ruyi Image Integration

Ruyi's image integration provides development board image flashing and microcontroller device documentation. This feature is linked with the RuyiSDK [RISC-V Development Board and OS Support Matrix](https://github.com/ruyisdk/support-matrix/) project.

This feature provides a wizard that supports using `dd` and `fastboot` to flash system images for RISC-V devices. It also provides guidance documentation for RISC-V microcontrollers and other devices that cannot be flashed conventionally.

```bash
$ ruyi device provision
```

For more detailed examples, please refer to the "Use Cases" chapter.