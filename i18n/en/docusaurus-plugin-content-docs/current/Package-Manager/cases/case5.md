---
sidebar_position: 5
---

# Integration with CMake and Meson

## cmake

First, ensure that you have cmake and ninja installed. If not, you can install them using the following commands:

```shell
# Ubuntu/Debian
sudo apt-get install cmake ninja-build
# Fedora
sudo dnf install cmake ninja-build
```

Download zlib:

```shell
wget https://github.com/zlib-ng/zlib-ng/archive/refs/tags/2.2.2.tar.gz
mkdir zlib-ng
cd zlib-ng
```

Install and activate the gnu-plct toolchain for compilation:

```shell
ruyi install gnu-plct
ruyi venv -t gnu-plct generic venv
. venv/bin/ruyi-activate
```

Extract zlib:

```shell
tar -xf ./zlib-ng-2.2.2.tar.gz
cd zlib-ng-2.2.2
```

Build zlib using cmake:
For the rationale behind these parameters, refer to the toolchain.riscv64-plct-linux-gnu.cmake file in the venv directory.

```shell
cmake . -G Ninja -DCMAKE_C_COMPILER=riscv64-plct-linux-gnu-gcc -DZLIB_COMPAT=ON -DWITH_GTEST=OFF
ninja
```

Check the compiled file:
```shell
$ file libz.so.1.3.1.zlib-ng 
libz.so.1.3.1.zlib-ng: ELF 64-bit LSB shared object, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, BuildID[sha1]=bb6bdf59fa0fd746b3a6d3586ff1cfabcbe4a6e9, with debug_info, not stripped
```

## meson

Install meson:

```shell
# Ubuntu/Debian
sudo apt-get install meson
# Fedora
sudo dnf install meson
```

As above, first install and activate the gnu-plct toolchain for compilation:

```shell
ruyi install gnu-plct
ruyi venv -t gnu-plct generic venv
. venv/bin/ruyi-activate
```

Download taisei:

```shell
git clone --recurse-submodules --depth=1 https://github.com/taisei-project/taisei
cd taisei
```

According to venv/meson-cross.ini, configure and compile with meson for cross-compilation as follows:

```shell
meson setup --cross-file /home/cyan/zlib-ng/venv/meson-cross.ini build/
meson compile -C build/
```

Check the compiled file:

```shell
$ file build/src/taisei
taisei: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64-lp64d.so.1, BuildID[sha1]=8fb80413e4a41ffeb75450b80a4b068c504b152e, for GNU/Linux 4.15.0, with debug_info, not stripped
```