---
sidebar_position: 2
---

# Milk-V Duo: Build and Debug with Extension

This example follows the IDE documentation to demonstrate how to use the extension for toolchain installation and virtual environment creation, and how to run and debug within VS Code using SSH/gdbserver.

## Steps

1. Open VS Code and click the **Ruyi** icon in the sidebar to enter the extension homepage.
2. In the **Packages** view, install `gnu-milkv-milkv-duo-musl-bin`.
3. In the **Virtual Environments** view, click `+` to create a new virtual environment:
   - Select `milkv-duo` as the Profile.
   - Choose `gnu-milkv-milkv-duo-musl-bin` as the toolchain.
   - Specify a name and path, then create and activate the environment by clicking its name.
4. Obtain the source code: in the Explorer, right-click the target directory and select **Extract RuyiSDK Package** to unpack the `milkv-duo-examples` source.
5. In the VS Code terminal (with the virtual environment activated), run the build, or create VS Code tasks that invoke the toolchain from the virtual environment.

6. Transfer and run:
   - Use `scp` to transfer the target program to the device (see the `upload` target in the Makefile from the IDE documentation).
   - Run the program in an SSH terminal, or configure VS Code’s C/C++ Remote Application to run remotely.

7. Debug:
   - On the device, prepare `gdbserver` and run, for example: `gdbserver :2345 ./your_binary`.
   - On the host, use `riscv64-unknown-linux-musl-gdb` from the virtual environment to connect to the device:

```bash input="1,2"
riscv64-unknown-linux-musl-gdb ./your_binary
target remote <device-ip>:2345
```

## Notes

- For more complete IDE configuration and demonstrations, please refer to [Milkv Duo IDE Development Workflow](/en/docs/IDE/cases/milkv-duo-ide).
