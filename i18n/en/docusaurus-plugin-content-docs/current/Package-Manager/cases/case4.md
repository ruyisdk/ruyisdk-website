---
sidebar_position: 4
---

# Flashing the Development Board via Fastboot (Using Licheepi 4A as an Example)

Currently, the ruyi package manager provides a more convenient method for installing the operating system. By following the steps below and the related instructions, the installation can be completed.

## Environment

This document is based on the following environment:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

### Attach the Device to the Host

The Licheepi 4A supports booting from onboard eMMC or SD card, and there are two different connection methods for flashing:

1. Connect the development board to the host PC via a USB cable and flash it using the `fastboot` method.
2. Insert the SD card into the host PC using a card reader, flash it using the `dd` method, and then insert it into the development board.

This example uses the first method, `fastboot`, which is also applicable for flashing images to the onboard eMMC of devices such as the MilkV Meles.

:::info System-Level Configuration for `fastboot`

`ruyi` will only prompt the user to attempt `sudo` elevation if a command fails. However, when using `fastboot flash`, the tool will wait indefinitely if no device is detected, without exiting. Therefore, before `ruyi` proceeds with flashing via `fastboot`, it will ask the user to manually confirm that the device appears in the output of `fastboot devices`:

```text
Some flashing steps require the use of fastboot, in which case you should
ensure the target device is showing up in fastboot devices output.
Please confirm it yourself before the flashing begins.

Is the device identified by fastboot now? (y/N)
```

When you see this prompt, pause and run `fastboot devices` in a separate terminal window. Only respond with `y` once the device is properly detected; otherwise, the flashing process may hang.

Due to the wide variety of Linux distributions and system configurations, and because the system-level setup required for `fastboot` (such as udev rules) involves low-level details, `ruyi` cannot configure this for you. You’ll need to handle it manually. For security reasons, we also do not recommend running `ruyi` as the root user.

The following configuration is provided for reference only. If adjustments are needed to suit your distribution, please make them accordingly. Consult your distribution’s documentation for further details.
:::

Connect the LicheePi 4A to the PC via a USB cable to prepare for flashing with `fastboot`. If only want to perform the flashing process as a regular (non-root) user, you may need to configure udev rules. Below is a sample udev configuration for Debian and its derivatives such as Ubuntu (for reference only):

```udev
SUBSYSTEM=="usb", ATTR{idVendor}="2345", ATTR{idProduct}=="7654", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}="1234", ATTR{idProduct}=="8888", MODE="0666", GROUP="plugdev"
```

After applying the configuration, verify that `fastboot` can detect the device by running `fastboot devices`. If you see an output line like `0123456789abcdef fastboot`, the setup is successful.

### Installing the Operating System

Ensure that the ruyi package manager is installed and that `ruyi -V` outputs the version information correctly. Then, proceed with the following steps.

The ruyi package manager provides the functionality to install an operating system on a RISC-V development board. To install an image for any model of RISC-V development board, simply execute:

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