# 使用示例

以开源基准测试程序 coremark 为例，展示从 ruyi 工具安装到使用 ruyi 工具搭建 RISC-V 的编译、模拟环境，完成 coremark 源码本地编译并在 Licheepi 4A开发板上运行的过程。

## 环境说明

硬件环境：Licheepi 4A开发板（th1520）

软件环境：Debian/openEuler for RISC-V

## ruyi工具的安装

1. [可选] 清除ruyi缓存

```bash
ruyi self uninstall --purge
```

2. 下载 ruyi 工具并为其赋可执行权限并配置到环境变量中：在[ruyi GitHub Releases](https://github.com/ruyisdk/ruyi/releases/) 或 [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)下载最新的ruyi工具。

```bash
# 下载riscv64版本的ruyi，将其放到path路径下，并赋予其可执行权限
wget https://github.com/ruyisdk/ruyi/releases/download/0.5.0/ruyi-0.5.0.riscv64
sudo cp ruyi-0.5.0.riscv64 /usr/local/bin/ruyi
sudo chmod +x ruyi
cd
```

3. 验证ruyi可否使用

```bash
ruyi --version
```

4. 更新最新的软件源索引

```bash
ruyi update
```

## 使用ruyi工具部署开发环境：

5. 查看软件仓软件包索引信息

```bash
ruyi list
```

6. 安装gnu：ruyi install `<package-name>`

```bash
#安装适用于Licheepi 4A的编译工具链gnu-plct-xthead 
ruyi install gnu-plct-xthead 
```

7. 查看预置编译环境

```bash
ruyi list profiles
```

8. 由指定的工具链、模拟器配置建立 RUYI 虚拟环境venv-sipeed。
   > 注意在虚拟环境创建时，需要指定正确的编译器版本和sysroot类型。
   >

```bash
ruyi venv -h

##创建虚拟环境venv-sipeed
ruyi venv -t gnu-plct-xthead sipeed-lpi4a venv-sipeed 

#查看编译环境中得工具
ls venv-sipeed/bin/ 

#激活虚拟环境（虚拟环境可以理解成一个容器，实现运行环境隔离的设计，激活后，在venv-sipeed这个环境中，使用的就是gnu-plct-xthead版本工具链。不创建虚拟环境也可以为/home/sipeed/.local/share/ruyi/binaries/riscv64/gnu-plct-xthead-2.8.0-ruyi.20240222/bin 配置环境变量，直接使用环境变量指定的gcc编译）
. venv-sipeed/bin/ruyi-activate 

#查看当前虚拟环境下的gcc是否可用
«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version 
```

9. 下载解压coremark源码作为编译对象

```bash
mkdir coremark && cd coremark
ruyi extract coremark
ls -al
```

## 交叉编译coremark

10. 设置coremark源码中的编译配置信息(参考coremark仓库自述文档)

```bash
sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
```

11. 执行交叉编译和构建，得到可执行程序coremark.exe

    ```bash
    make PORT_DIR=linux64 link
    ls -al    #新增可执行程序coremark.exe
    ```
12. 查看rv64可执行程序文件属性信息。

    ```bash
    file coremark.exe
    # 命令回显信息显示了文件的架构相关信息
    ```

## 运行验证

13. 直接运行riscv64 coremark可执行程序

```bash
./coremark.exe
```
