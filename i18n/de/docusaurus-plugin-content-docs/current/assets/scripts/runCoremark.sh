#!/usr/bin/env bash
# ./runCoremark.sh [COMPILER] [ARCH]
# eg. ./runCoremark.sh /home/cxo/RuyiSDK/GCC/ruyi-unbuntu-2022-gcc13/bin/riscv64-ruyi-linux-gnu-gcc rv64gc

if [ $# -lt 2 ]; then
    echo "You should specify two parameters."
    echo "Usage: ./runCoremark.sh [COMPILER] [ARCH]"
    echo "For example:"
    echo "./runCoremark.sh /home/cxo/RuyiSDK/GCC/ruyi-unbuntu-2022-gcc13/bin/riscv64-ruyi-linux-gnu-gcc rv64gc"
    exit 1
fi

compiler=$1
arch=$2
if [ ! -d coremark ]; then
    echo "You don't have coremark in this folder. Please use the command below to download:"
    echo "git clone https://github.com/eembc/coremark.git"
    exit 1
fi
cd coremark || exit

if [ ! -d rv64 ]; then
    mkdir rv64 && cp simple/* rv64/
    sed -i 's/ee_u32         ee_ptr_int/unsigned long long         ee_ptr_int/g' rv64/core_portme.h
fi

if [ -f coremark.exe ]; then
    rm coremark.exe
fi
make compile PORT_DIR=rv64 CC="$compiler" LD="$compiler" XCFLAGS="-march=$arch"
version=$($compiler --version | grep -Eo "[0-9]+\.[0-9]+\.[0-9]+")
echo "mv coremark.exe coremark_${version}_${arch}.exe"
mv coremark.exe "coremark_${version}_${arch}.exe"
