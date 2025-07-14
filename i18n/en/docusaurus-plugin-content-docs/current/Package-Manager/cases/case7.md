---
sidebar_position: 7
---

# Building the milkv-duo-examples Sample Program

First, install the necessary dependencies:

```shell
$ ruyi install gnu-milkv-milkv-duo-musl-bin
```

Extract and build `milkv-duo-examples`:
```shell
$ mkdir test-duo-examples
$ cd test-duo-examples
$ ruyi extract milkv-duo-examples
```

Modify the contents of `envsetup.sh`:

```bash
#!/bin/bash

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
echo "script_dir: ${script_dir}"

milkv_debug=0

milkv_chip=
milkv_arch=

host_tools_pkg="gnu-milkv-milkv-duo-musl-bin"
host_tools=${script_dir}/host-tools/ruyi-venv

function print_info()    { printf "\e[1;92m%s\e[0m\n" "$1"; }
function print_warning() { printf "\e[1;93m%s\e[0m\n" "$1"; }
function print_note()    { printf "\e[1;94m%s\e[0m\n" "$1"; }
function print_err()     { printf "\e[1;31mError: %s\e[0m\n" "$1"; }

function choose_target() {
	echo "Select Product:"
	print_info "1. Duo (CV1800B)"
	print_info "2. Duo256M (SG2002) or DuoS (SG2000)"
	read -p "Which would you like: " chip_index

	if [ "${chip_index}" -eq 1 ]; then
		milkv_chip="CV180X"
		milkv_arch="riscv64"
	elif [ "${chip_index}" -eq 2 ]; then
		milkv_chip="CV181X"
		milkv_arch="riscv64"
	else
		print_err "Nothing selected for Chip."
		return 1
	fi

	print_note "CHIP: ${milkv_chip}"
	print_note "ARCH: ${milkv_arch}"
}

function check_host_tools() {
	if [ ! -d ${host_tools} ]; then
		print_warning "host-tools does not exist, download it now..."
		ruyi install ${host_tools_pkg}
		mkdir -p $(dirname ${host_tools})
		ruyi venv -t ${host_tools_pkg} milkv-duo ${host_tools}
		if [ $? -ne 0 ]; then
			print_err "Get the host-tools pkg failed!"
			return 1
		fi
	else
		if [ ! -e ${host_tools}/bin/ruyi-activate ]; then
			print_warning "Ruyi Virtual Environment broken!"
			print_warning "Please manually delete it first. [ ${host_tools} ]"
			print_warning "Then source the script again."
			return 2
		fi
	fi
}

choose_target
[[ "${?}" -eq 0 ]] || return 1

pushd ${script_dir}
check_host_tools
[[ "${?}" -eq 0 ]] || {
	popd
	return 1
}
popd

sys_inc="${script_dir}/include/system"

if [[ "${milkv_arch}" == "riscv64" ]]; then

	arch_cflags="-mcpu=c906fdv -march=rv64imafdcv0p7xthead -mcmodel=medany -mabi=lp64d"
	arch_ldflags="-D_LARGEFILE_SOURCE -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64"

	export TOOLCHAIN_PREFIX=riscv64-unknown-linux-musl-

else
	print_err "Invalid ARCH parameter!"
	return 1
fi

if [[ "${milkv_chip}" == "CV180X" ]]; then
	sys_lib="${script_dir}/libs/system/musl_riscv64"
elif [[ "${milkv_chip}" == "CV181X" ]]; then
	sys_lib="${script_dir}/libs/system/musl_riscv64"
else
	print_err "Invalid CHIP parameter!"
	return 1
fi

if [ "${milkv_debug}" -eq 1 ]; then
	debug_cflags="-g -O0"
else
	debug_cflags="-O3 -DNDEBUG"
fi

export CC="${TOOLCHAIN_PREFIX}gcc"
export CFLAGS="${arch_cflags} ${debug_cflags} -I${sys_inc}"
export LDFLAGS="${arch_ldflags} -L${sys_lib}"

export CHIP="${milkv_chip}"

source ${host_tools}/bin/ruyi-activate

print_info "Environment is ready."
```

Activate the virtual environment:

```shell
$ source envsetup.sh
```

You should now be able to build successfully:

```shell
$ cd i2c/ssd1306_i2c
$ make
```

