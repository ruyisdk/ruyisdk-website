---
sidebar_position: 6
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Verwendung von QEMU und LLVM

Dieses Beispiel basiert auf [Coremark für MilkV Duo erstellen](case2.md)

Zunächst installieren Sie die erforderlichen Abhängigkeiten:
<<<<<<< HEAD
<<<<<<< HEAD
<CodeBlock lang="shell" code={
`ruyi install llvm-upstream gnu-plct qemu-user-riscv-upstream`
} />

Erstellen Sie eine virtuelle Umgebung und aktivieren Sie diese:
<CodeBlock lang="shell" code={
`ruyi venv -t llvm-upstream --sysroot-from gnu-plct -e qemu-user-riscv-upstream generic venv
. venv/bin/ruyi-activate`
} />

Entpacken Sie Coremark und kompilieren Sie es:
<CodeBlock lang="shell" code={
`«Ruyi milkv-venv» $ mkdir coremark
=======
<CodeBlock lang="shell" code={`ruyi install llvm-upstream gnu-plct qemu-user-riscv-upstream`} />

Erstellen Sie eine virtuelle Umgebung und aktivieren Sie diese:
<CodeBlock lang="shell" code={`ruyi venv -t llvm-upstream --sysroot-from gnu-plct -e qemu-user-riscv-upstream generic venv
. venv/bin/ruyi-activate`} />

Entpacken Sie Coremark und kompilieren Sie es:
<CodeBlock lang="shell" code={`«Ruyi milkv-venv» $ mkdir coremark
>>>>>>> 7803df1 (Update de codeblocks)
=======
<CodeBlock lang="shell" code={`ruyi install llvm-upstream gnu-plct qemu-user-riscv-upstream`} />

Erstellen Sie eine virtuelle Umgebung und aktivieren Sie diese:
<CodeBlock lang="shell" code={`ruyi venv -t llvm-upstream --sysroot-from gnu-plct -e qemu-user-riscv-upstream generic venv
. venv/bin/ruyi-activate`} />

Entpacken Sie Coremark und kompilieren Sie es:
<CodeBlock lang="shell" code={`«Ruyi milkv-venv» $ mkdir coremark
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf
«Ruyi milkv-venv» $ cd coremark
«Ruyi milkv-venv» $ ruyi extract coremark

«Ruyi milkv-venv» $ sed -i 's/\\bgcc\\b/riscv64-unknown-linux-gnu-gcc/g' linux64/core_portme.mak
<<<<<<< HEAD
<<<<<<< HEAD
«Ruyi milkv-venv» $ make PORT_DIR=linux64 link`
} />

Führen Sie Coremark nun über QEMU aus:
<CodeBlock lang="shell" code={
`$ ruyi-qemu coremark.exe
=======
«Ruyi milkv-venv» $ make PORT_DIR=linux64 link`} />

Führen Sie Coremark nun über QEMU aus:
<CodeBlock lang="shell" code={`$ ruyi-qemu coremark.exe
>>>>>>> 7803df1 (Update de codeblocks)
=======
«Ruyi milkv-venv» $ make PORT_DIR=linux64 link`} />

Führen Sie Coremark nun über QEMU aus:
<CodeBlock lang="shell" code={`$ ruyi-qemu coremark.exe
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf
2K performance run parameters for coremark.
CoreMark Size    : 666
Total ticks      : 19567
Total time (secs): 19.567000
Iterations/Sec   : 10221.290949
Iterations       : 200000
Compiler version : GCCClang 17.0.5
Compiler flags   : -O2   -lrt
Memory location  : Please put data memory location here
                        (e.g. code in flash, data on heap etc)
seedcrc          : 0xe9f5
[0]crclist       : 0xe714
[0]crcmatrix     : 0x1fd7
[0]crcstate      : 0x8e3a
[0]crcfinal      : 0x4983
Correct operation validated. See readme.txt for run and reporting rules.
<<<<<<< HEAD
<<<<<<< HEAD
CoreMark 1.0 : 10221.290949 / GCCClang 17.0.5 -O2   -lrt / Heap`
} />
=======
CoreMark 1.0 : 10221.290949 / GCCClang 17.0.5 -O2   -lrt / Heap`} />
>>>>>>> 7803df1 (Update de codeblocks)
=======
CoreMark 1.0 : 10221.290949 / GCCClang 17.0.5 -O2   -lrt / Heap`} />
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf
