---
title: 集成的RISC-V设备
weight: 20
---

# 如意SDK集成的RISC-V设备

如意SDK对RISC-V设备的集成和支持主要包括以下几个方面：

1. 提供RISC-V 开发板适用镜像信息维护与下载、开发板系统安装引导程序，方便 RISC-V 开发者获取指定开发板可用的OS并可方便的安装OS的安装。如意SDK集成了多种可用的操作系统供用户选择。
2. 提供RISC-V 开发板对应的演示程序、开发资料和相关工具（含适用的编译工具链、模拟器等）的信息维护和下载，方便 RISC-V 开发者快速上手。
3. 在集成开发环境中增加RISC-V设备专有向导页面、实现开发环境和运行环境的文件传输、支持在RISC-V设备上调试应用程序等。


## 支持的RISC-V设备

目前已经集成的RISC-V设备有：

1. Allwinner Nezha D1
2. Canaan Kendryte K230
3. Milk-V Duo
4. Milk-V Pioneer Box
5. SiFive HiFive Unmatched
6. Sipeed Lichee RV
7. Sipeed LicheePi 4A
8. StarFive VisionFive
9. StarFive VisionFive2

## 从如意SDK开始使用设备

### 获取并安装OS

可以通过下载安装最新的如意包管理器工具并执行以下命令为设备安装系统：

```bash
$ ruyi device provision
```

按照引导信息一步步执行即可。
