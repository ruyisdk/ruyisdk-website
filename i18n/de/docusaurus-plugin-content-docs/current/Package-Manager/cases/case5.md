---
sidebar_position: 5
---

# Integration mit CMake und Meson

## cmake

Stellen Sie zunächst sicher, dass Sie cmake und ninja installiert haben. Falls nicht, können Sie die folgenden Befehle verwenden:

```shell
# Ubuntu/Debian
sudo apt-get install cmake ninja-build
# Fedora
sudo dnf install cmake ninja-build
```

Laden Sie zlib herunter:

```shell
wget https://github.com/zlib-ng/zlib-ng/archive/refs/tags/2.2.2.tar.gz
mkdir zlib-ng
cd zlib-ng
```

Installieren und aktivieren Sie die gnu-plct-Toolchain für die Kompilierung:

```shell
ruyi install gnu-plct
ruyi venv -t gnu-plct generic venv
. venv/bin/ruyi-activate
```

Entpacken Sie zlib:

```shell
tar -xf ./zlib-ng-2.2.2.tar.gz
cd zlib-ng-2.2.2
```

Verwenden Sie cmake, um zlib zu erstellen:
Warum diese Parameter verwendet werden, können Sie in der Datei toolchain.riscv64-plct-linux-gnu.cmake im venv-Verzeichnis nachlesen.

```shell
cmake . -G Ninja -DCMAKE_C_COMPILER=riscv64-plct-linux-gnu-gcc -DZLIB_COMPAT=ON -DWITH_GTEST=OFF
ninja
```

Überprüfen Sie die kompilierten Dateien:
```shell
$ file libz.so.1.3.1.zlib-ng 
libz.so.1.3.1.zlib-ng: ELF 64-bit LSB shared object, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, BuildID[sha1]=bb6bdf59fa0fd746b3a6d3586ff1cfabcbe4a6e9, with debug_info, not stripped
```

## meson

Installieren Sie meson:

```shell
# Ubuntu/Debian
sudo apt-get install meson
# Fedora
sudo dnf install meson
```

Wie oben, installieren und aktivieren Sie zunächst die gnu-plct-Toolchain für die Kompilierung:

```shell
ruyi install gnu-plct
ruyi venv -t gnu-plct generic venv
. venv/bin/ruyi-activate
```

Laden Sie taisei herunter:

```shell
git clone --recurse-submodules --depth=1 https://github.com/taisei-project/taisei
cd taisei
```

Gemäß der Datei venv/meson-cross.ini erfolgt die Konfiguration und Kompilierung für die Cross-Kompilierung mit meson wie folgt:

```shell
meson setup --cross-file /home/cyan/zlib-ng/venv/meson-cross.ini build/
meson compile -C build/
```

Überprüfen Sie die kompilierten Dateien:

```shell
$ file build/src/taisei
taisei: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-riscv64-lp64d.so.1, BuildID[sha1]=8fb80413e4a41ffeb75450b80a4b068c504b152e, for GNU/Linux 4.15.0, with debug_info, not stripped
```