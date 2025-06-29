---
sidebar_position: 1
---

# Overview

## Introduction

RuyiSDK IDE is a graphical integrated development environment primarily designed for RISC-V developers, based on the open-source software Eclipse. Building upon Eclipse's support for embedded development, this tool plans to gradually integrate SDKs for multiple mainstream RISC-V development boards, making RISC-V development more convenient.

## Installation and Launch

### Download IDE

RuyiSDK IDE download address: https://mirror.iscas.ac.cn/ruyisdk/ide

Download the latest version of the IDE from the above address, ensuring to select the installation package that matches your architecture. If you intend to develop in an x86_64 environment, download the latest version of the `linux.gtk.x86_64.tar.gz` package; if you wish to develop on an ARM device, download the `linux.gtk.aarch64.tar.gz` package; and if you want to run it on a RISC-V device, download the `linux.gtk.riscv64.tar.gz` package.

In addition to the IDE itself, you will need to install the RuyiSDK IDE plugin. Currently, integration work is still in progress, so the plugin must be installed manually by copying it into the dropins directory of the RuyiSDK IDE. We plan to improve this experience in future releases to enable easier installation and usage. You can follow the steps below to install and use the plugin:

+ Download the latest plugin package from [GitHub Releases](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/latest)
+ Extract the `org.ruyisdk.ide_*.zip` archive into the `dropins` directory inside your RuyiSDK IDE installation path

### Launch IDE

After decompressing, execute `./ruyisdk` in the command line to launch RuyiSDK IDE.

1. Extract the downloaded IDE package to any path, navigate to the ruyisdk directory, and execute `./ruyisdk` in the command line to start the IDE.
2. The IDE will then prompt you to select a workspace (WorkSpace). You can create a new directory as the workspace or specify an existing one.
3. Next, click the `Launch` button to run the IDE.
4. Upon successful launch, you will enter the IDE and can start using it.

> Note: RuyiSDK IDE comes with an integrated openJDK (openJDK 21) for its own operation, eliminating the need for additional JDK installation. This openJDK 21 is primarily used for the operation of RuyiSDK IDE itself. For Java-related projects you create, you can configure the required Java environment.

## Updates

For RuyiSDK IDE, you need to download the latest version to replace the old one. When launching a new version of the IDE, you can choose the workspace previously created, allowing you to import previous work and continue development.

## Documentation Notes

1. The documentation and screenshots of RuyiSDK IDE are based on Ubuntu 22.04 LTS x86_64. If you are using a different environment, there may be inconsistencies, and adjustments may be required on your part.
2. RuyiSDK IDE currently maintains a development branch, keeping it rolling updated, with documentation updated alongside the latest version. It is recommended that you always download the latest version.