# 使用示例

以开源基准测试程序 coremark 为例，展示从 ruyi 包管理器安装到使用 ruyi 包管理器搭建 RISC-V 的编译、模拟环境，完成 coremark 源码本地编译并在 Licheepi 4A 开发板上运行的过程。

## 环境说明

- 硬件环境：Licheepi 4A 开发板（th1520）
- 软件环境：Debian/openEuler for RISC-V

## ruyi 包管理器的安装

1. [可选] 清除当前已经安装的 ruyi 包管理器及其所有数据。

```bash
ruyi self uninstall --purge
```

2. 下载 `ruyi` 工具并为其赋可执行权限并配置到环境变量中：从[ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/) 或 [ISCAS 镜像源](https://mirror.iscas.ac.cn/RuyiSDK/ruyi/releases/)下载最新的 `ruyi` 工具。

```bash
# 下载 riscv64 版本的 ruyi 包管理器，将其放到 path 路径下，并赋予其可执行权限
wget https://github.com/RuyiSDK/ruyi/releases/download/0.5.0/ruyi-0.5.0.riscv64
sudo cp ruyi-0.5.0.riscv64 /usr/local/bin/ruyi
sudo chmod +x ruyi
cd
```

3. 验证 ruyi 包管理器可否使用

```bash
ruyi --version
```

4. 更新最新的软件源索引

```bash
ruyi update
```

详细请见[此处](../Package-Manager/installation.md)

## 使用 ruyi 包管理器部署开发环境：

5. 查看软件仓软件包索引信息

```bash
ruyi list
```

6. 安装 gnu：ruyi install `<package-name>`

```bash
#安装适用于 Licheepi 4A 的编译工具链 gnu-plct-xthead
ruyi install gnu-plct-xthead
```

7. 查看预置编译环境

```bash
ruyi list profiles
```

8. 由指定的工具链、模拟器配置建立 Ruyi 虚拟环境 venv-sipeed。
   > 注意在虚拟环境创建时，需要指定正确的编译器版本和 sysroot 类型。

```bash
ruyi venv -h

##创建虚拟环境 venv-sipeed
ruyi venv -t gnu-plct-xthead sipeed-lpi4a venv-sipeed

#查看编译环境中得工具
ls venv-sipeed/bin/

#激活虚拟环境（虚拟环境可以理解成一个容器，实现运行环境隔离的设计，激活后，在 venv-sipeed 这个环境中，使用的就是 gnu-plct-xthead 版本工具链。不创建虚拟环境也可以为 /home/sipeed/.local/share/ruyi/binaries/riscv64/gnu-plct-xthead-2.8.0-ruyi.20240222/bin 配置环境变量，直接使用环境变量指定的gcc编译）
. venv-sipeed/bin/ruyi-activate

#查看当前虚拟环境下的 gcc 是否可用
«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version
```

9. 下载解压 coremark 源码作为编译对象

```bash
mkdir coremark && cd coremark
ruyi extract coremark
ls -al
```

## 交叉编译 coremark

10. 设置 coremark 源码中的编译配置信息(参考 coremark 仓库自述文档)

```bash
sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
```

11. 执行交叉编译和构建，得到可执行程序 coremark.exe

```bash
make PORT_DIR=linux64 link
ls -al    #新增可执行程序coremark.exe
```

12. 查看 rv64 可执行程序文件属性信息。

```bash
file coremark.exe
# 命令回显信息显示了文件的架构相关信息
```

## 运行验证

13. 直接运行 riscv64 coremark 可执行程序

```bash
./coremark.exe
```
