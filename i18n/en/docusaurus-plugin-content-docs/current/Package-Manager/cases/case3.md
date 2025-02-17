---
sidebar_position: 3
---

# Flashing Development Board Using dd Method (Taking MilkV Duo as an Example)

Currently, the ruyi package manager provides a more convenient method for installing operating systems. The installation can be completed by following the steps and related instructions below.

## Environment

This document is based on the following environment:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

#### Additional Notes

Most RISC-V development boards support booting from Micro SD cards or NVME SSDs, typically using the ``dd`` tool to directly write images to the disk. The ``ruyi device provision`` command supports this writing method.

Although the Ruyi package manager is designed not to perform operations that require superuser privileges, writing to a disk using ``dd`` often requires superuser privileges. Therefore, if an attempt to use the ``dd`` command to flash an image as a regular user fails, the Ruyi package manager will attempt to escalate privileges using ``sudo``. At this point, the user may need to enter a password, which is directly read by ``sudo`` and is transparent to the Ruyi package manager.

Disk images often occupy a large amount of disk space after unpacking. Please ensure sufficient disk space is available before using the Ruyi package manager to flash an image. Some manufacturer-provided images do not automatically expand partitions to fully utilize the entire disk after flashing, and users may need to manually expand the disk partition size.

## Installing the Operating System

After ensuring that the ruyi package manager is installed and testing that `ruyi -V` outputs the version information correctly, proceed with the following steps.

The ruyi package manager provides the functionality to install operating systems for RISC-V development boards. To install an image for any model of RISC-V development board, simply execute:

```bash
$ ruyi device provision
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
  3. Canaan Kendryte K230D
  4. Canaan Kendryte K510
  5. Milk-V Duo
  6. Milk-V Duo S
  7. Milk-V Mars
  8. Milk-V Mars CM
  9. Milk-V Meles
  10. Milk-V Pioneer Box
  11. Milk-V Vega
  12. Pine64 Star64
  13. SiFive HiFive Unmatched
  14. Sipeed Lichee Cluster 4A
  15. Sipeed Lichee Console 4A
  16. Sipeed LicheePi 4A
  17. Sipeed Lichee RV
  18. Sipeed LicheeRV Nano
  19. Sipeed Maix-I
  20. Sipeed Tang Mega 138K Pro
  21. StarFive VisionFive
  22. StarFive VisionFive2
  23. WCH CH32V103 EVB
  24. WCH CH32V203 EVB
  25. WCH CH32V208 EVB
  26. WCH CH32V303 EVB
  27. WCH CH32V305 EVB
  28. WCH CH32V307 EVB
  29. WCH CH582F EVB
  30. WCH CH592X EVB

Choice? (1-30) 
```

The output should be based on the actual situation. In the example, MilkV Duo is listed as option 5.

```
Choice? (1-30) 5

The device has the following variants. Please choose the one corresponding to your hardware at hand:

  1. Milk-V Duo (64M RAM)
  2. Milk-V Duo (256M RAM)

Choice? (1-2)
```

Note that MilkV Duo has two versions, using CV1800B and SG2002 SOCs respectively. The version with SG2002 is also known as Duo 256M.

Here, as an example, we select the 64M RAM version, which is the version with the CV1800B SOC.

```
Choice? (1-2) 1

The following system configurations are supported by the device variant you have chosen. Please pick the one you want to put on the device:

  1. Milk-V Duo Official Arduino SDK (64M RAM, SD card)
  2. Milk-V Duo Official buildroot SDK (64M RAM, SD card)
  3. Milk-V Duo Official buildroot SDK (64M RAM, Lite, SD card)
```

Choose according to your needs. Here, as an example, we select ``2``.

```
Choice? (1-3) 2

We are about to download and install the following packages for your device:

 * board-image/buildroot-sdk-milkv-duo

Proceed? (y/N)
```

Ruyi will prompt the specific Ruyi packages under the board-image partition that will be downloaded and ask whether to proceed. Enter ``y`` to continue.

After the download and unpacking are complete, it will prompt for the path to the disk:

```
For initializing this target device, you should plug into this host system the
device's storage (e.g. SD card or NVMe SSD), or a removable disk to be
reformatted as a live medium, and note down the corresponding device file
path(s), e.g. /dev/sdX, /dev/nvmeXnY for whole disks; /dev/sdXY, /dev/nvmeXnYpZ
for partitions. You may consult e.g. sudo blkid output for the
information you will need later.

Please give the path for the target's whole disk:
```

At this point, you can connect the disk device you wish to flash, enter the absolute path of the device, and wait for the writing to complete.