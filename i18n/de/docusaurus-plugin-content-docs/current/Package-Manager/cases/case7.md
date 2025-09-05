---
sidebar_position: 7
---

import CodeBlock from '@site/src/components/common/docs_utils/CodeBlock';


# Kompilieren der `milkv-duo-examples` Beispielprogramme

Zuerst die notwendigen Abhängigkeiten installieren:

<CodeBlock lang="bash" code={`
$ ruyi install gnu-milkv-milkv-duo-musl-bin
`} />

Entpacken und Kompilieren der `milkv-duo-examples`:

<CodeBlock lang="bash" code={`
$ mkdir test-duo-examples
$ cd test-duo-examples
$ ruyi extract milkv-duo-examples
`} />

Ändern Sie den Inhalt der `envsetup.sh`:

<CodeBlock lang="bash" code={`
#!/bin/bash

script_dir=$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" &> /dev/null && pwd)
echo "script_dir: \${script_dir}"

milkv_debug=0

milkv_chip=
milkv_arch=

host_tools_pkg="gnu-milkv-milkv-duo-musl-bin"
host_tools=\${script_dir}/host-tools/ruyi-venv

function print_info()    { printf "\\e[1;92m%s\\e[0m\\n" "$1"; }
function print_warning() { printf "\\e[1;93m%s\\e[0m\\n" "$1"; }
function print_note()    { printf "\\e[1;94m%s\\e[0m\\n" "$1"; }
function print_err()     { printf "\\e[1;31mFehler: %s\\e[0m\\n" "$1"; }

function choose_target() {
    echo "Produkt auswählen:"
    print_info "1. Duo (CV1800B)"
    print_info "2. Duo256M (SG2002) oder DuoS (SG2000)"
    read -p "Welches möchten Sie: " chip_index

    if [ "\${chip_index}" -eq 1 ]; then
        milkv_chip="CV180X"
        milkv_arch="riscv64"
    elif [ "\${chip_index}" -eq 2 ]; then
        milkv_chip="CV181X"
        milkv_arch="riscv64"
    else
        print_err "Kein Chip ausgewählt."
        return 1
    fi

    print_note "CHIP: \${milkv_chip}"
    print_note "ARCH: \${milkv_arch}"
}

function check_host_tools() {
    if [ ! -d \${host_tools} ]; then
        print_warning "host-tools existiert nicht, wird jetzt heruntergeladen..."
        ruyi install \${host_tools_pkg}
        mkdir -p $(dirname \${host_tools})
        ruyi venv -t \${host_tools_pkg} milkv-duo \${host_tools}
        if [ $? -ne 0 ]; then
            print_err "Das Herunterladen des host-tools-Pakets ist fehlgeschlagen!"
            return 1
        fi
    else
        if [ ! -e \${host_tools}/bin/ruyi-activate ]; then
            print_warning "Die virtuelle Ruyi-Umgebung ist beschädigt!"
            print_warning "Bitte löschen Sie sie zuerst manuell. [ \${host_tools} ]"
            print_warning "Führen Sie dann das Skript erneut aus."
            return 2
        fi
    fi
}

choose_target
[[ "\${?}" -eq 0 ]] || return 1

pushd \${script_dir}
check_host_tools
[[ "\${?}" -eq 0 ]] || {
    popd
    return 1
}
popd

sys_inc="\${script_dir}/include/system"

if [[ "\${milkv_arch}" == "riscv64" ]]; then

    arch_cflags="-mcpu=c906fdv -march=rv64imafdcv0p7xthead -mcmodel=medany -mabi=lp64d"
    arch_ldflags="-D_LARGEFILE_SOURCE -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64"

    export TOOLCHAIN_PREFIX=riscv64-unknown-linux-musl-

else
    print_err "Ungültiger ARCH-Parameter!"
    return 1
fi

if [[ "\${milkv_chip}" == "CV180X" ]]; then
    sys_lib="\${script_dir}/libs/system/musl_riscv64"
elif [[ "\${milkv_chip}" == "CV181X" ]]; then
    sys_lib="\${script_dir}/libs/system/musl_riscv64"
else
    print_err "Ungültiger CHIP-Parameter!"
    return 1
fi

if [ "\${milkv_debug}" -eq 1 ]; then
    debug_cflags="-g -O0"
else
    debug_cflags="-O3 -DNDEBUG"
fi

export CC="\${TOOLCHAIN_PREFIX}gcc"
export CFLAGS="\${arch_cflags} \${debug_cflags} -I\${sys_inc}"
export LDFLAGS="\${arch_ldflags} -L\${sys_lib}"

export CHIP="\${milkv_chip}"

source \${host_tools}/bin/ruyi-activate

print_info "Die Umgebung ist bereit."
`} />

Starten der virtuellen Umgebung:

<CodeBlock lang="bash" code={`
$ source envsetup.sh
`} />

Der Build-Vorgang sollte nun erfolgreich sein:

<CodeBlock lang="bash" code={`
$ cd i2c/ssd1306_i2c
$ make
`} />
