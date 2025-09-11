# Canaan K230D User Manual

## Installing System Image

### Direct Download and Installation

RuyiSDK currently provides two types of image files: LP64 and ILP32. You can download and install them through RuyiSDK by following these steps:

1. Ensure that you have downloaded and installed `ruyi`. Please refer to the [RuyiSDK Package Manager Installation Guide](https://ruyisdk.org/docs/Package-Manager/installation) for installation instructions (it is recommended to download the latest version). After installation, you can execute `ruyi --version` to check the version information.
2. Execute `ruyi update` to update the RuyiSDK software repository. This operation will update the latest software package and resource indexes to your local machine, facilitating subsequent queries and installations with the latest information.
3. Execute `ruyi device provision` to enter the system image installation wizard. Follow the prompts to select the `Canaan Kendryte K230D` development board, board specifications, image file type, and other information. The wizard will guide you through the image burning process.

   Currently, RuyiSDK provides RV64ILP32 (Xuantie new 32-bit kernel + 32-bit rootfs) and RV64LP64 (conventional 64-bit system) for K230D. It is recommended to install the RV64ILP32 system to experience the advantages of the new 32-bit system in dynamic memory space consumption.

   ```bash
   The following system configurations are supported by the device variant you have chosen. 
   Please pick the one you want to put on the device:

     1. Canaan Kendryte K230D CanMV Linux SDK demo, RV64ILP32 ABI
     2. Canaan Kendryte K230D CanMV Linux SDK demo, RV64LP64 ABI

   ```

### Source Code Build

> Note: `k230d_canmv_ilp32_defconfig` requires Ubuntu 22.04 or 24.04 and the installation of the rv64ilp32 toolchain. Therefore, please perform the source code build in an Ubuntu 22.04 or Ubuntu 24.04 environment.

The K230D RuyiSDK repository is located at: https://github.com/ruyisdk/k230_linux_sdk

The K230D SDK provides [build instructions](https://github.com/ruyisdk/k230_linux_sdk/blob/dev/README_zh.md) for the image. After the build is completed, the image files are stored in the `output` directory. Depending on the defconfig executed, the image files for 64ILP32 and 64LP64 are stored in the following paths:

```bash
# 64ILP32
output/k230d_canmv_ilp32_defconfig/images/sysimage-sdcard.img

# 64LP64
output/k230d_canmv_lp64_defconfig/images/sysimage-sdcard.img
```

After the build is completed, please extract the files and burn them to a TF card. Insert the TF card into the device, and power on the device to start using it.

```bash
# Assuming /dev/sdb is the TF card device node, execute the following command to burn the TF card:

$ sudo dd if=sysimage-sdcard.img of=/dev/sdb bs=1M oflag=sync
```

## Booting

The system automatically boots when the device is powered on. If the red light on the development board is on, it indicates that the board is powered on normally. The root account has no default password, and you can view the serial port information at this time.

If the development board is connected to a screen, the LVGL DEMO will automatically run after a short while, showcasing resource usage. The DEMO also includes touch interaction.