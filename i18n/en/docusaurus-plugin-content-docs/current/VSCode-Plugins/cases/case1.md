---
sidebar_position: 1
---

# CoreMark: Build with Extension (Example: LicheePi 4A)

This example uses CoreMark to demonstrate the basic workflow of completing toolchain installation, virtual environment creation, source extraction, build, and execution within the extension. For detailed instructions, see [Building with Ruyi Compilation Environment](/en/docs/Package-Manager/cases/case1).

## Steps

1. Open VS Code and click the **Ruyi** icon in the sidebar to enter the extension homepage.
2. In the **Packages** view, install `gnu-plct-xthead`.
3. In the **Virtual Environments** view, click `+` to create a new virtual environment:
   - Select `sipeed-lpi4a` as the Profile.
   - Choose the installed `gnu-plct-xthead` toolchain.
   - (Optional) Select a simulator.
   - Specify a name and path, then create and activate the environment by clicking its name.
4. In the Explorer, right-click the target directory and select **Extract RuyiSDK Package** to unpack the `coremark` source code.
5. Configure the build settings in the CoreMark source (refer to the CoreMark repository README):

   ```bash input="2"
   # Modify gcc according to CoreMark build instructions
   $ sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
   ```

6. Open the VS Code terminal (with PATH inherited from the activated environment), navigate to the `coremark` directory, and run the build:

   ```bash input="2"
   # Cross-compile and build to generate the executable coremark.exe
   make PORT_DIR=linux64 link
   ```

7. Transfer the generated executable to the LicheePi 4A and run it (using `scp`, serial, NFS, etc.).

## Notes

- To run in local simulation, select an appropriate QEMU simulator and execute in the terminal.
- For device flashing and image deployment, refer to the package manager case documentation (the extension does not yet provide a flashing wizard).
