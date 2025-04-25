---
sidebar_position: 2
---

# Installation

Let's begin with the installation of the RuyiSDK package manager.

This document uses ``~`` to represent the home directory of the current regular user, and ``/home/foo`` as an example of the absolute path to the home directory when necessary.

## Installing Using Precompiled Binaries

Currently, the RuyiSDK package manager tool provides precompiled binaries for **Linux** systems in three architectures: **amd64**, **arm64**, and **riscv64**. It does not depend on the system Python, making it widely applicable.

These binaries are released on both GitHub Release and the ISCAS mirror site:

- [ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/)
- [ISCAS Mirror](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)

Using the ISCAS mirror as an example, the installation process is described below. First, run ``uname -m`` to check the system architecture and download the corresponding binary.

If the output is ``x86_64``:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.32.0/ruyi.amd64
```

If the output is ``aarch64``:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.32.0/ruyi.arm64
```

If the output is ``riscv64``:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.32.0/ruyi.riscv64
```

The following example assumes the ``x86_64`` architecture. Grant execution permissions to the downloaded binary:

```bash
$ chmod +x ./ruyi.amd64
```

Install the binary to a directory included in ``PATH``:

```bash
$ sudo cp -v ruyi.amd64 /usr/local/bin/ruyi
```

If your ``PATH`` includes the ``~/.local/bin/`` directory, installing ``ruyi`` to ``~/.local/bin/ruyi`` may be a more recommended choice. Installation and removal in this directory do not require superuser privileges.

Note that the binary file must be named ``ruyi``.

## Installing Using the System Package Manager

Currently, Arch Linux users can install and uninstall the Ruyi package manager using the system package manager. Compared to installing with precompiled binaries, this method offers more convenient maintenance and better performance by utilizing the system Python.

To install from the AUR, using ``yay`` as an example, note that a regular user should be used:

```bash
$ yay -S ruyi
```

To install from the Arch Linux CN repository, add the following configuration using the ISCAS open-source mirror as an example:

```bash
[archlinuxcn]
Server = https://mirror.iscas.ac.cn/archlinuxcn/$arch
```

Install using ``pacman``:

```bash
$ sudo pacman -Sy
$ sudo pacman -S ruyi
```

## Verifying Your Installation

```bash
$ ruyi version
```

The command should run successfully and print version and Copyright information. If it fails, check your system environment or retry the installation.

## Getting Started

At this point, the Ruyi package manager has been successfully installed on your system. You can learn how to use it from the help information provided by Ruyi itself or continue reading this document.

To list the help information:

```bash
$ ruyi --help
```