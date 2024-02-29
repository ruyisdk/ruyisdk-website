---
title: 使用 LLVM 上游工具链配置 RISC-V 编译环境
weight: 3
date: 2017-01-05
description: 
---

注意在 v0.2 版本中，该部分只适用于在 x86-64 host 配置交叉编译环境。

LLVM 上游工具链软件包名为 llvm-upstream ， v0.2 最新版本二进制为 llvm-upstream-20231121 。
由于配置 LLVM 工具链环境依赖 gcc 环境，故同时需要安装 gcc 工具链。

另外尽管 llvm-upstream 在 ``list`` 命令中打印了 slug 信息，但是实际上并不存在该 slug ，故不能指定 slug 安装。

```bash
$ ruyi install llvm-upstream slug:gnu-upstream-20231212
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz to /home/myon/.cache/ruyi/distfiles/RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  232M  100  232M    0     0  7108k      0  0:00:33  0:00:33 --:--:-- 6251k
info: extracting RuyiSDK-20231212-Upstream-Sources-riscv64-unknown-linux-gnu.tar.xz for package gnu-upstream-0.20231212.0
info: package gnu-upstream-0.20231212.0 installed to /home/myon/.local/share/ruyi/binaries/x86_64/gnu-upstream-0.20231212.0
info: downloading https://mirror.iscas.ac.cn/ruyisdk/dist/llvm-17.0.5.ruyi-20231121.amd64.tar.zst to /home/myon/.cache/ruyi/distfiles/llvm-17.0.5.ruyi-20231121.amd64.tar.zst
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  398M  100  398M    0     0  4946k      0  0:01:22  0:01:22 --:--:-- 5737k
info: extracting llvm-17.0.5.ruyi-20231121.amd64.tar.zst for package llvm-upstream-17.0.5-ruyi.20231121
info: package llvm-upstream-17.0.5-ruyi.20231121 installed to /home/myon/.local/share/ruyi/binaries/x86_64/llvm-upstream-17.0.5-ruyi.20231121
```

由预置的 generic 配置建立编译环境：

```bash
$ ruyi venv -t llvm-upstream --sysroot-from gnu-upstream generic ./llvm_venv
info: Creating a Ruyi virtual environment at llvm_venv...
info: The virtual environment is now created.

You may activate it by sourcing the appropriate activation script in the
bin directory, and deactivate by invoking `ruyi-deactivate`.

A fresh sysroot/prefix is also provisioned in the virtual environment.
It is available at the following path:

    /home/myon/ruyisdk/ruyi/llvm_venv/sysroot

The virtual environment also comes with ready-made CMake toolchain file
and Meson cross file. Check the virtual environment root for those;
comments in the files contain usage instructions.
```

``--sysroot-from`` 指定从 gnu-upstream 获取 sysroot ，这是由于 llvm 构建依赖一些 gcc 库。

查看可用的工具链二进制，包括 llvm-upstream 和 gnu-upstream ：

```bash
$ ls llvm_venv/bin/
amdgpu-arch               dsymutil                 llvm-dlltool            llvm-rc                              riscv64-unknown-linux-gnu-cpp
analyze-build             FileCheck                llvm-dwarfdump          llvm-readelf                         riscv64-unknown-linux-gnu-g++
bugpoint                  find-all-symbols         llvm-dwarfutil          llvm-readobj                         riscv64-unknown-linux-gnu-gcc
c-index-test              git-clang-format         llvm-dwp                llvm-reduce                          riscv64-unknown-linux-gnu-gcc-ar
clang                     hmaptool                 llvm-exegesis           llvm-remark-size-diff                riscv64-unknown-linux-gnu-gcc-nm
clang++                   intercept-build          llvm-extract            llvm-remarkutil                      riscv64-unknown-linux-gnu-gcc-ranlib
clang-apply-replacements  ld64.lld                 llvm-gsymutil           llvm-rtdyld                          riscv64-unknown-linux-gnu-ld
clang-change-namespace    ld.lld                   llvm-ifs                llvm-sim                             riscv64-unknown-linux-gnu-nm
clang-check               llc                      llvm-install-name-tool  llvm-size                            riscv64-unknown-linux-gnu-objcopy
clang-cl                  lld                      llvm-jitlink            llvm-split                           riscv64-unknown-linux-gnu-objdump
clang-cpp                 lld-link                 llvm-jitlink-executor   llvm-stress                          riscv64-unknown-linux-gnu-ranlib
clangd                    lli                      llvm-lib                llvm-strings                         riscv64-unknown-linux-gnu-readelf
clang-doc                 lli-child-target         llvm-libtool-darwin     llvm-strip                           riscv64-unknown-linux-gnu-size
clang-extdef-mapping      llvm-addr2line           llvm-link               llvm-symbolizer                      riscv64-unknown-linux-gnu-strings
clang-format              llvm-ar                  llvm-lipo               llvm-tapi-diff                       riscv64-unknown-linux-gnu-strip
clang-include-cleaner     llvm-as                  llvm-lto                llvm-tblgen                          run-clang-tidy
clang-include-fixer       llvm-bcanalyzer          llvm-lto2               llvm-tli-checker                     ruyi-activate
clang-linker-wrapper      llvm-bitcode-strip       llvm-mc                 llvm-undname                         sancov
clang-move                llvm-cat                 llvm-mca                llvm-windres                         sanstats
clang-offload-bundler     llvm-cfi-verify          llvm-ml                 llvm-xray                            scan-build
clang-offload-packager    llvm-config              llvm-modextract         modularize                           scan-build-py
clang-pseudo              llvm-cov                 llvm-mt                 not                                  scan-view
clang-query               llvm-c-test              llvm-nm                 nvptx-arch                           split-file
clang-refactor            llvm-cvtres              llvm-objcopy            obj2yaml                             UnicodeNameMappingGenerator
clang-rename              llvm-cxxdump             llvm-objdump            opt                                  verify-uselistorder
clang-reorder-fields      llvm-cxxfilt             llvm-opt-report         pp-trace                             wasm-ld
clang-repl                llvm-cxxmap              llvm-otool              riscv64-unknown-linux-gnu-addr2line  yaml2obj
clang-scan-deps           llvm-debuginfo-analyzer  llvm-pdbutil            riscv64-unknown-linux-gnu-ar         yaml-bench
clang-tblgen              llvm-debuginfod          llvm-PerfectShuffle     riscv64-unknown-linux-gnu-as
clang-tidy                llvm-debuginfod-find     llvm-profdata           riscv64-unknown-linux-gnu-c++
count                     llvm-diff                llvm-profgen            riscv64-unknown-linux-gnu-cc
diagtool                  llvm-dis                 llvm-ranlib             riscv64-unknown-linux-gnu-c++filt
```

进入 llvm 编译环境：

```bash
$ . llvm_venv/bin/ruyi-activate
«Ruyi llvm_venv» $
```

此时应当可以正常调用 clang ：

```bash
«Ruyi llvm_venv» $ clang --version
clang version 17.0.5
Target: riscv64-unknown-linux-gnu
Thread model: posix
InstalledDir: /home/myon/.local/share/ruyi/binaries/x86_64/llvm-upstream-17.0.5-ruyi.20231121/bin
```

退出编译环境：

```bash
«Ruyi llvm_venv» $ ruyi-deactivate
$
```

注意：由于 ``clang-cl`` 设计本意是兼容 MSVC ，故在 RUYI 编译环境中，尽管该命令存在，实际上并不被支持。该命令将在 0.3 版本移除。
