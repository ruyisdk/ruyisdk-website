---
sidebar_position: 1
---
# RuyiSDK IDE

## 简介

RuyiSDK IDE 是一款基于开源软件 Eclipse 开发的、图形化的、主要面向 RISC-V 开发者的集成开发环境。该工具在继承 Eclipse 对嵌入式开发支持的基础上，计划逐步集成多款主流RISC-V开发板的 SDK，使得 RISC-V 开发更加便捷。

## 安装和启动

### 下载 IDE

RuyiSDK IDE 下载地址：https://mirror.iscas.ac.cn/ruyisdk/ide

从上述下载地址下载最新版本的 ide ，注意需要选择匹配架构的安装包，如果您想在 x86_64 环境下开发，需下载最新版本的 `linux.gtk.x86_64.tar.gz` 包；如果您想在 ARM 设备上开发，则需要下载 `linux.gtk.aarch64.tar.gz` 包；如果您希望在 RISC-V 设备上运行，则下载 `linux.gtk.riscv64.tar.gz` 包。

### 启动 IDE
解压缩后直接双击 `ruyisdk` 文件即可启动运行 RuyiSDK IDE。也可以在命令行中执行 `./ruyisdk` 运行程序。

1. 解压您下载的 IDE 软件包到任意路径，进入到 ruyisdk 目录下，双击 `ruyisdk` 文件,或者在命令行中执行 `./ruyisdk` 即可启动 IDE。
2. 接下来 IDE 会提示选择工作空间 WorkSpace，您可以创建一个新的目录作为工作空间，或者指定已有的工作空间。
3. 接着点击 `Launch` 按钮就可以运行 IDE 了。
4. 启动成功后，将进入 IDE ，这样就可以开始使用了。

> 说明：RuyiSDK IDE 已经集成了openJDK（openJDK 21）供程序自身的运行，可以不用额外安装JDK。这个openJDK 21主要供 RuyiSDK IDE自身运行使用，您创建的Java 相关工程，可以设定所需的 Java 环境。

## 更新

RuyiSDK IDE 您需要下载最新版本来替代旧的版本。IDE 新版本启动时，您可以选择之前创建的工作空间，这样可以导入之前的工作成果，继续开发。

## 文档说明

1. RuyiSDK IDE 的文档和文档中的截图均以 Ubuntu 22.04 LTS x86_64 为例展开说明，如果您是其它环境，可能存在不一致的情况。
2. RuyiSDK IDE 当前维护的是开发分支，保持滚动更新，文档随最新版本更新。建议您始终下载最新版本。
