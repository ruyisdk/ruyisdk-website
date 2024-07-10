---
title: "新增板卡支持 (2024-01-29)"
authors: [white]
---

# 新增板卡支持 (2024-01-29)

现已为以下板卡新增了镜像包。

您可用 RuyiSDK 设备安装向导 `ruyi device provision` 自动初始化您的设备，或通过
`ruyi install` 手动安装它们：镜像文件会被自动解压或符号链接到 `~/.local/share/ruyi/blobs/<包名>-<包版本号>` 的位置。

感谢您对 RuyiSDK 的支持！

## Sipeed LicheeRV & Allwinner 哪吒 D1

此两种型号在硬件层面大体兼容，但也有细微差别，仅体现在设备树层面。

- `board-image/oerv-awol-d1-base`: openEuler RISC-V 系统镜像，基础系统
- `board-image/oerv-awol-d1-xfce`: openEuler RISC-V 系统镜像，含 XFCE GUI

## StarFive VisionFive

- `board-image/oerv-starfive-visionfive-base`: openEuler RISC-V 系统镜像，基础系统
- `board-image/oerv-starfive-visionfive-xfce`: openEuler RISC-V 系统镜像，含 XFCE GUI

## StarFive VisionFive2

- `board-image/oerv-starfive-visionfive2-base`: openEuler RISC-V 系统镜像，基础系统
- `board-image/oerv-starfive-visionfive2-xfce`: openEuler RISC-V 系统镜像，含 XFCE GUI
