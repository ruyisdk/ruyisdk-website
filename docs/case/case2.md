# 为 RISC-V 开发板安装操作系统

目前 ruyi 包管理器提供了更为简便的操作系统安装方式，通过以下步骤以及相关引导即可完成安装。

## 环境

本文基于以下环境进行操作：
- 硬件：x86_64 PC
- 软件：Ubuntu 22.04

#### 其他说明

- 在任意 Linux 系统下皆可完成下文操作

连接方式，以下任选：
1. RISC-V 开发板以 USB 连接线接入 PC（若可以连接，推荐该方式）
2. 将 RISC-V 开发板 SD 卡通过读卡器接入 PC

## 安装操作系统

在确保已安装 ruyi 包管理器，并且测试 `ruyi -V` 正常输出版本相关信息后，请继续以下操作。

ruyi 包管理器提供了为 RISC-V 开发板安装操作系统的功能，为任一型号的 RISC-V 开发板安装镜像都只需要执行：

```bash
ruyi device provision
```

该命令将会返回工具目前所支持的 RISC-V 开发板，选择开发板后将返回所有支持指定开发板的操作系统：

```
RuyiSDK Device Provisioning Wizard

This is a wizard intended to help you install a system on your device for your
development pleasure, all with ease.

You will be asked some questions that help RuyiSDK understand your device and
your intended configuration, then packages will be downloaded and flashed onto
the device's storage, that you should somehow make available on this host
system beforehand.

Note that, as Ruyi does not run as root, but raw disk access is most likely
required to flash images, you should arrange to allow your user account sudo
access to necessary commands such as dd. Flashing will fail if the sudo
configuration does not allow so.

Continue? (y/N) y

The following devices are currently supported by the wizard. Please pick your device:

1. Allwinner Nezha D1
2. Canaan Kendryte K230
3. Milk-V Duo
4. Milk-V Pioneer Box
5. SiFive HiFive Unmatched
6. Sipeed Lichee RV
7. Sipeed LicheePi 4A
8. StarFive VisionFive
9. StarFive VisionFive2

Choice? (1-9)

```

以上，以 Sipeed LicheePi 4A 为例，需要为其安装镜像，只需要输入对应的序号：`7`


```
Choice? (1-9) 7

The device has the following variants. Please choose the one corresponding to your hardware at hand:

  1. Sipeed LicheePi 4A (8G RAM)
  2. Sipeed LicheePi 4A (16G RAM)

Choice? (1-2) 2

The following system configurations are supported by the device variant you have chosen. Please pick the one you want 
to put on the device:

  1. openEuler RISC-V (headless) for Sipeed LicheePi 4A (16G RAM)
  2. openEuler RISC-V (XFCE) for Sipeed LicheePi 4A (16G RAM)
  3. RevyOS for Sipeed LicheePi 4A (16G RAM)

Choice? (1-3) 3

We are about to download and install the following packages for your device:

 * board-image/revyos-sipeed-lpi4a
 * board-image/uboot-revyos-sipeed-lpi4a-16g

Proceed? (y/N) 

```

您只需要按照引导提示一步步执行即可。

## 其他说明

相关的系统刷写问题可以访问对应开发板官网以获取针对性的帮助。
