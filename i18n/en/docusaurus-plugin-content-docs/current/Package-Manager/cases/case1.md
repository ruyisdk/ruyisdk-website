---
sidebar_position: 1
---

# Building with Ruyi Compilation Environment (Using Licheepi 4A as an Example)

This guide demonstrates the process of installing the Ruyi package manager, setting up a RISC-V compilation and simulation environment using Ruyi, and completing the local compilation of the CoreMark source code, followed by running it on the Licheepi 4A development board.

## Environment Description

- Hardware Environment: Licheepi 4A Development Board (th1520)
- Software Environment: Debian/openEuler for RISC-V

## Installation of Ruyi Package Manager

1. [Optional] Clear the currently installed Ruyi package manager and all its data.

```bash
ruyi self uninstall --purge
```

2. Download the `ruyi` tool, grant it executable permissions, and configure it in the environment variables: Download the latest `ruyi` tool from [Ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/) or [ISCAS Mirror](https://mirror.iscas.ac.cn/RuyiSDK/ruyi/releases/).

```bash
# Download the riscv64 version of the Ruyi package manager, place it in the PATH, and grant it executable permissions
wget https://github.com/ruyisdk/ruyi/releases/download/0.25.0/ruyi-0.25.0.riscv64
sudo cp ruyi-0.25.0.riscv64 /usr/local/bin/ruyi
sudo chmod +x ruyi
cd
```

3. Verify if the Ruyi package manager is usable

```bash
ruyi --version
```

4. Update the latest software source index

```bash
ruyi update
```

## Setting Up the Development Environment Using Ruyi Package Manager

5. View the software repository package index information

```bash
ruyi list --name-contains gnu-plct --category-is toolchain
```

6. Install gnu: `ruyi install <package-name>`

```bash
# Install the compilation toolchain gnu-plct-xthead suitable for Licheepi 4A
ruyi install gnu-plct-xthead 
```

7. View predefined compilation environments

```bash
ruyi list profiles
```

8. Create a Ruyi virtual environment `venv-sipeed` using the specified toolchain and simulator configuration.
   > Note: When creating the virtual environment, ensure the correct compiler version and sysroot type are specified.
   > If no version number is specified, the latest version from the software source is used by default, not the locally installed version.

```bash
ruyi venv -h

# Create the virtual environment venv-sipeed
ruyi venv -t gnu-plct-xthead sipeed-lpi4a venv-sipeed 

# View the tools in the compilation environment
ls venv-sipeed/bin/ 

# Activate the virtual environment (The virtual environment can be understood as a container designed to isolate the runtime environment. After activation, the gnu-plct-xthead version toolchain is used within the venv-sipeed environment. Alternatively, without creating a virtual environment, you can configure the environment variable directly to use the gcc compiler located at /home/sipeed/.local/share/ruyi/binaries/riscv64/gnu-plct-xthead-2.8.0-ruyi.20240222/bin)
. venv-sipeed/bin/ruyi-activate 

# Verify if the gcc in the current virtual environment is usable
«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version 
```

9. Download and extract the CoreMark source code as the compilation target

```bash
mkdir coremark && cd coremark
ruyi extract coremark
ls -al
```

## Cross-Compiling CoreMark

10. Configure the compilation settings in the CoreMark source code (Refer to the CoreMark repository README)

```bash
sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
```

11. Perform cross-compilation and build to obtain the executable program coremark.exe

```bash
make PORT_DIR=linux64 link
ls -al    # The executable program coremark.exe is newly generated
```

12. View the file attribute information of the riscv64 executable program.

```bash
file coremark.exe
# The command output displays architecture-related information about the file
```

## Running and Verification

13. Directly run the riscv64 CoreMark executable program

```bash
./coremark.exe
```