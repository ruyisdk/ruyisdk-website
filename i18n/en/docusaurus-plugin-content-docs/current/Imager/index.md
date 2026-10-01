---
sidebar_position: 1
title: Ruyi Imager
description: Install an operating system on your RISC-V board with Ruyi Imager.
---

Ruyi Imager is a graphical image writer for RISC-V boards.

## Installation

Download the package matching the current operating system and processor architecture from [GitHub Releases](https://github.com/Glavo/ruyi-imager/releases/latest).

| Operating system | Processor architecture   | Packages            |
|------------------|--------------------------|---------------------|
| Windows          | x86_64                   | `.exe` installer    |
| Linux            | x86_64, aarch64, riscv64 | `.deb` or `.tar.gz` |
| macOS            | aarch64, x86_64          | `.tar.gz`           |

On Windows, run the `.exe` installer. On Debian or Ubuntu, install the `.deb` package.

## Flashing an Image

1. Select the board and operating system, or open a local image file.
2. Connect the storage card or board and select the target device. Refer to the board documentation for connection instructions.
3. Confirm the image and device, then start flashing. Once complete, follow the board documentation to boot the system.

:::warning
Flashing overwrites data on the target device. Back up the data and confirm the target device before proceeding. Keep it connected until flashing is complete.
:::

## Related Resources

- [Source code and issue tracker](https://github.com/Glavo/ruyi-imager)
- [Download page](/en/downloads#ruyi-imager)
