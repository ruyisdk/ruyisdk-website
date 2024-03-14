# 使用示例

以开源基准测试程序 coremark 为例，展示在x86_64 PC上实现从 ruyi 工具安装到使用 ruyi 工具搭建 RISC-V 的编译、模拟环境，完成 coremark 源码交叉编译并在 qemu 模拟器上成功执行的过程。

## 环境说明

硬件环境：x86_64

软件环境：ubuntu 22.04

## ruyi工具的安装

1. [可选] 清除ruyi缓存

```bash
ruyi self uninstall --purge
```

2. 下载 ruyi 工具并为其赋可执行权限并配置到环境变量中：在[ruyi GitHub Releases](https://github.com/ruyisdk/ruyi/releases/) 或 [ISCAS 镜像源](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)下载最新的ruyi工具。

```bash

cd /usr/local/ruyi/
wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/testing/ruyi.amd64.20231211
mv ruyi.amd64.20231107 ruyi
sudo chmod +x ruyi
export PATH=/usr/local/ruyi:$PATH
echo $PATH
cd 
```

3. 验证ruyi可否使用

```bash
ruyi --version
```

4. 查看ruyi帮助

```bash
ruyi --help
```

## 使用ruyi工具部署开发环境：

5. 查看软件仓软件包索引信息

```bash
ruyi list
```

6. 查看详细信息

```bash
ruyi list -v
```

7. 安装gnu：ruyi install `<package-name>`

```bash
ruyi install  gnu-upstream
```

8. 安装qemu

```bash
ruyi install qemu-user-riscv-upstream
```

9. 查看预置编译环境

```bash
ruyi list profiles
```

10. 由指定的工具链、模拟器配置建立 RUYI 虚拟环境venv1

```bash
ruyi venv --help
ruyi venv -t gnu-upstream -e qemu-user-riscv-upstream   generic  venv1
```

11. 查看虚拟环境bin目录下已安装的工具链、模拟器

```bash
ls  venv1/bin
```

12. 激活虚拟环境

```
.  venv1/bin/ruyi-activate
```

13. 检查虚拟环境中编译工具的版本信息

```bash
riscv64-unknown-linux-gnu-gcc --version
ruyi-qemu --version
```

14. 下载解压coremark源码作为编译对象

```bash
mkdir coremark && cd coremark
ruyi extract coremark
ls -al
```

## 交叉编译coremark

15. 设置coremark源码中的编译配置信息(参考coremark仓库自述文档)

```bash
sed -i 's/\bgcc\b/riscv64-unknown-linux-gnu-gcc/g'  linux64/core_portme.mak
```

16. 执行交叉编译和构建，得到可执行程序coremark.exe

    ```bash
    make PORT_DIR=linux64 link
    ls -al    #新增可执行程序coremark.exe
    ```
17. 查看rv64可执行程序文件属性信息。

    ```bash
    file coremark.exe
    # 命令回显信息显示了文件的架构相关信息
    ```

## qemu-user 模式下运行 riscv64 coremark 可执行程序

18. qemu user模式下执行riscv64 coremark可执行程序

```bash
ruyi-qemu   coremark.exe
```

19. 退出虚拟环境

```bash
ruyi-deactivate
```
