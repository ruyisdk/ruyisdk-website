---
title: "新增板卡支持 (2024-01-15)"
authors: [white]
---

# 新增板卡支持 (2024-01-15)

现已为以下板卡新增了镜像包。

您可用 `ruyi install` 安装它们：镜像文件会被自动解压或符号链接到 `~/.local/share/ruyi/blobs/<包名>-<包版本号>` 的位置。

感谢您对 RuyiSDK 的支持！

## Milk-V Duo

### 64M RAM 版本

- `board-image/buildroot-sdk-milkv-duo`: 官方 Buildroot SDK
- `board-image/buildroot-sdk-milkv-duo-python`: 官方 Buildroot SDK，含 Python 环境

### 256M RAM 版本

- `board-image/buildroot-sdk-milkv-duo256m`: 官方 Buildroot SDK
- `board-image/buildroot-sdk-milkv-duo256m-python`: 官方 Buildroot SDK，含 Python 环境

## Milk-V Pioneer

- `board-image/oerv-sg2042-milkv-pioneer-base`: openEuler RISC-V 系统镜像，基础系统
- `board-image/oerv-sg2042-milkv-pioneer-xfce`: openEuler RISC-V 系统镜像，含 XFCE GUI
- `board-image/revyos-sg2042-milkv-pioneer`: RevyOS 系统镜像

## Sipeed LicheePi 4A

系统镜像：

- `board-image/oerv-sipeed-lpi4a-headless`: openEuler RISC-V 系统镜像，不含 GUI
- `board-image/oerv-sipeed-lpi4a-xfce`: openEuler RISC-V 系统镜像，含 XFCE GUI
- `board-image/revyos-sipeed-lpi4a`: RevyOS 系统镜像

引导器（U-Boot）：

- `board-image/uboot-oerv-sipeed-lpi4a-16g`: 适用 Sipeed LicheePi 4A (16G RAM) 的 openEuler 系统
- `board-image/uboot-oerv-sipeed-lpi4a-8g`: 适用 Sipeed LicheePi 4A (8G RAM) 的 openEuler 系统
- `board-image/uboot-revyos-sipeed-lpi4a-16g`: 适用 Sipeed LicheePi 4A (16G RAM) 的 RevyOS 系统
- `board-image/uboot-revyos-sipeed-lpi4a-8g`: 适用 Sipeed LicheePi 4A (8G RAM) 的 RevyOS 系统
