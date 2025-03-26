---
sidebar_position: 4
---

# Flashing the Development Board via Fastboot (Using Licheepi 4A as an Example)

Currently, the ruyi package manager provides a more convenient method for installing the operating system. By following the steps below and the related instructions, the installation can be completed.

## Environment

This document is based on the following environment:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

#### Additional Notes

The Licheepi 4A supports booting from onboard eMMC or SD card, and there are two different connection methods for flashing:

1. Connect the RISC-V development board to the PC via a USB cable.
2. Connect the RISC-V development board's SD card to the PC via a card reader.

This example uses the first method. This flashing method is also applicable for flashing images to the onboard eMMC of the MilkV Meles.

If the image flashing fails when using a regular user, ruyi will attempt to escalate privileges using ``sudo``.

The Licheepi 4A is connected to the PC via a USB cable and flashed using fastboot. If you wish to complete the flashing process using a regular user, you may need to configure udev rules. Here is an example rule for reference:

```
SUBSYSTEM=="usb", ATTR{idVendor}="2345", ATTR{idProduct}=="7654", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}="1234", ATTR{idProduct}=="8888", MODE="0666", GROUP="plugdev"
```

## Installing the Operating System

Ensure that the ruyi package manager is installed and that `ruyi -V` outputs the version information correctly. Then, proceed with the following steps.

The ruyi package manager provides the functionality to install an operating system on a RISC-V development board. To install an image for any model of RISC-V development board, simply execute:

```bash
ruyi device provision
```

This command will return the list of RISC-V development boards currently supported by the tool. After selecting a development board, it will return all operating systems supported by the specified development board:

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

In the above example, to install an image for the Sipeed LicheePi 4A, simply enter the corresponding number: `7`.

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

You only need to follow the prompts step by step.