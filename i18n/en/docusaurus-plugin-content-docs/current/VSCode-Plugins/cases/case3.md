---
sidebar_position: 3
---

# Blink the LED on Milk-V Duo (256M) with RuyiSDK Examples

This tutorial shows how to find the LED Blink example in the extension and use its package manager, virtual environment, and source extraction features to make the board's LED blink.

## Prerequisites

- Install the RuyiSDK extension from the VS Code Marketplace.
- Connect to the internet to access RuyiSDK Examples.
- Boot a Milk-V Duo (256M). See the [official Milk-V Duo documentation](https://milkv.io/docs/duo/getting-started/boot).
- Connect the board and host to the same network. The board's default IP address is `192.168.42.1`.

## Steps

### 1. Find the Blink example

1. In VS Code, press `Ctrl+Shift+P`, type `ruyi home`, and choose **Ruyi: Open Home**.
2. On the **RuyiSDK Examples** card, select **Open RuyiSDK Examples**.

   ![RuyiSDK Examples panel](@site/docs/VSCode-Plugins/cases/images/case3-examples-panel.png)

3. In the board list, select **Milk-V Duo (256M)**, labeled SG2002 · Sophgo · Milk-V.

   ![Milk-V Duo (256M) entry](@site/docs/VSCode-Plugins/cases/images/case3-board-entry.png)

4. Select **Blink** to read the example instructions.

> You can also open the panel by running `ruyi.board-docs` from the Command Palette.

### 2. Install the toolchain

1. Select the **Ruyi** icon in the sidebar to open the extension home page.
2. In **Packages**, find and install `gnu-plct`.

   ![Installing the gnu-plct toolchain](@site/docs/VSCode-Plugins/cases/images/case3-install-toolchain.png)

### 3. Create a virtual environment

1. In **Virtual Environments**, click `+`:

   ![Creating a virtual environment](@site/docs/VSCode-Plugins/cases/images/case3-create-venv.png)

   - Select the `manual` profile.
   - Select the installed `gnu-plct` toolchain.
   - Optionally select an emulator.
   - Enter a name and path, create the environment, and click its name to activate it.

### 4. Extract the sample code

1. In Explorer, right-click your working directory and select **Extract RuyiSDK Package**.
2. Find and select `milkv-duo-examples` to extract it into the current directory.

   ![Extract RuyiSDK Package menu item](@site/docs/VSCode-Plugins/cases/images/case3-extract-package.png)

### 5. Build the Blink program

1. Open the VS Code terminal and activate the environment by selecting it in **Virtual Environments**. The toolchain is added to the terminal's `PATH`. Switch to the `blink` directory:

   ```bash
   cd blink
   ```

2. Build with the toolchain from the virtual environment:

   ```bash
   riscv64-plct-linux-gnu-gcc blink.c -o blink \
       -I../include/system \
       -L../libs/system/musl_riscv64 \
       -lwiringx
   ```

   Or pass the settings to the project's Makefile:

   ```bash
   make TOOLCHAIN_PREFIX=riscv64-plct-linux-gnu- \
        CFLAGS="-I../include/system" \
        LDFLAGS="-L../libs/system/musl_riscv64 -lwiringx"
   ```

3. Check the resulting binary:

   ```bash
   file blink
   ```

   ![Successful build output](@site/docs/VSCode-Plugins/cases/images/case3-compile-success.png)

### 6. Copy and run the program

1. Copy the program to the board:

   ```bash
   scp blink root@192.168.42.1:/root/
   ```

2. Connect over SSH. The default username is `root` and the default password is `milkv`:

   ```bash
   ssh root@192.168.42.1
   ```

3. Disable the system's Blink script to prevent it from interfering:

   ```bash
   mv /mnt/system/blink.sh /mnt/system/blink.sh_backup && sync
   reboot
   ```

4. After the reboot, reconnect and run the program:

   ```bash
   ssh root@192.168.42.1
   ./blink
   ```

5. The terminal reports the LED state as the blue LED on the board blinks:

   ```
   Duo LED GPIO (wiringX) 25: High
   Duo LED GPIO (wiringX) 25: Low
   Duo LED GPIO (wiringX) 25: High
   Duo LED GPIO (wiringX) 25: Low
   ...
   ```

6. Press `Ctrl+C` to stop the program.

### 7. Restore the default LED behavior

After testing, restore the system's original Blink script:

```bash
ssh root@192.168.42.1
mv /mnt/system/blink.sh_backup /mnt/system/blink.sh && sync
reboot
```

## Notes

- This tutorial uses the Milk-V Duo (256M) with an SG2002. The Milk-V Duo (64M) uses a CV1800B.
- To get help from Copilot, select the blue **Open in VS Code** button in the upper-right corner of the example. Its contents are copied to Copilot Chat.
- If you do not have a board, select a suitable QEMU emulator when you create the virtual environment and run it from the terminal.
