---
sidebar_position: 1
---

# 功能说明

ruyi 包管理器提供以下功能。

## 命令查询

| 命令                                                                                         | 含义                                             | 注意事项                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `ruyi update`                                                                                | 更新软件包缓存，使用默认镜像。                   | 软件包缓存将存放在用户目录中，通常为 `~/.cache/ruyi`。 |
| `ruyi news list -h`                                                                          | 查看新闻命令的帮助信息。                         |                                                        |
| `ruyi news list`                                                                             | 列出所有新闻。                                   |                                                        |
| `ruyi news list --new`                                                                       | 仅列出未读新闻。                                 |                                                        |
| `ruyi news read -h`                                                                          | 查看新闻阅读命令的帮助信息。                     |                                                        |
| `ruyi news read 1`                                                                           | 读取特定序号的新闻。                             | 1 为要读取的新闻条目的序号或 ID。                      |
| `ruyi news read`                                                                             | 读取下一条新闻。                                 |                                                        |
| `ruyi news read --quiet`                                                                     | 标记新闻为已读，不输出任何信息。                 | 不输出任何东西，只标记为已读。                         |
| `ruyi list`                                                                                  | 列出所有可用软件包。                             |                                                        |
| `ruyi list -v`                                                                               | 列出所有软件包的详细信息。                       |                                                        |
| `ruyi list profiles`                                                                         | 查看预置的编译环境配置。                         | 与 Python 虚拟环境类似。                               |
| `ruyi install gnu-upstream`                                                                  | 安装最新的 GNU 上游工具链。                      | 默认安装最新版本的 gnu-upstream。                      |
| `ruyi install 'gnu-upstream(0.20231118.0)'`                                                  | 安装指定版本的 GNU 上游工具链。                  | 通过指定版本号安装历史版本。                           |
| `ruyi install 'gnu-upstream(==0.20231118.0)'`                                                | 安装特定版本的 GNU 上游工具链。                  | 版本匹配格式应为 `<op><ver>`。                         |
| `ruyi install --reinstall gnu-upstream`                                                      | 重新安装 GNU 上游工具链。                        |                                                        |
| `ruyi extract ruyisdk-demo`                                                                  | 下载并解包 ruyisdk-demo 源码包。                 | 解包到当前目录。                                       |
| `ruyi venv --toolchain gnu-upstream --emulator qemu-user-riscv-upstream generic ./ruyi_venv` | 在指定目录建立包含工具链和模拟器的编译环境。     | 使用预置的 generic 配置。                              |
| `ruyi self uninstall`                                                                        | 卸载 ruyi 包管理器。                             | 命令会询问确认操作。                                   |
| `ruyi self uninstall -y`                                                                     | 无需确认直接卸载 ruyi 包管理器。                 | 无需确认直接执行。                                     |
| `ruyi self uninstall --purge`                                                                | 彻底卸载 ruyi 包管理器，包括缓存和安装的软件包。 | 包括缓存和已安装的软件包。                             |
| `ruyi self uninstall --purge -y`                                                             | 无需确认彻底卸载 ruyi 包管理器。                 | 无需确认直接执行。                                     |
| `ruyi device provision`                                                                      | 下载所需系统镜像，并为设备安装系统。             | 按照引导进行系统安装。                                 |

---

> 以下内容为表格内容详细说明。

## 刷新软件包缓存

更新软件包缓存，使用默认镜像即可：

```bash
$ ruyi update
```

软件包缓存将存放在用户目录中，通常为 `~/.cache/ruyi` ；在 `XDG_CACHE_HOME` 环境变量被设置时，目录为 `$XDG_CACHE_HOME/ruyi` 。
在本文档中家目录为 `/home/myon` 。

## 查询包管理器更新内容

查看 ruyi 包管理器的更新信息、阅读新闻或将信息设置为已读：

```bash
$ ruyi news list -h
$ ruyi news list
$ ruyi news list --new		  # 仅列出未读新闻

$ ruyi news read -h
$ ruyi news read 1 		      # 1为要读取的新闻条目的序号或ID
$ ruyi news read   		      # 读取下一条新闻
$ ruyi news read --quiet  	# 不输出任何东西，只标记为已读
```

## 查询可用软件包

查看可用的软件包，该命令将列出所有可用的软件包：

```bash
$ ruyi list
List of available packages:

* source/ruyisdk-demo
  - 0.20231114.0 (latest)
* source/coremark
  - 1.0.2-pre.20230125 (prerelease, latest-prerelease)
  - 1.0.1 (latest)
* emulator/qemu-user-riscv-xthead
  - 6.1.0-ruyi.20231207+g03813c9fe8 (latest)
* emulator/qemu-user-riscv-upstream
  - 8.1.2-ruyi.20231121 (latest)
* toolchain/gnu-plct
  - 0.20231212.0 (latest) slug: gnu-plct-20231212
  - 0.20231118.0 () slug: gnu-plct-20231118
* toolchain/gnu-plct-xthead
  - 0.20231212.0 (latest) slug: gnu-plct-xthead-20231212
  - 0.20231118.0 () slug: gnu-plct-xthead-20231118
* toolchain/gnu-upstream
  - 0.20231212.0 (latest) slug: gnu-upstream-20231212
  - 0.20231118.0 () slug: gnu-upstream-20231118
* toolchain/llvm-upstream
  - 17.0.5-ruyi.20231121 (latest) slug: llvm-upstream-20231121
```

软件包前缀表示分类，其中 `source` 代表软件源码包， `toolchain` 代表工具链二进制包， `emulator` 代表模拟器二进制包，`board-image` 代表开发板镜像，`analyzer` 代表分析工具。

如果软件包显示 “no binary for current host” 则该软件包的当前版本不支持本机架构。

列出所有软件包的详细信息：

```bash
$ ruyi list -v
```

## 查询可用编译环境

与 python 的虚拟环境类似，RUYI 包管理器工具使用 `venv` 命令应用配置到指定的工具链以建立编译环境。

RUYI 包管理预置的配置可以使用 `ruyi list profiles` 命令查看：

```bash
$ ruyi list profiles
generic
baremetal-rv64ilp32 (needs flavor(s): {'rv64ilp32'})
sipeed-lpi4a (needs flavor(s): {'xthead'})
milkv-duo
```

## 安装软件包

使用 `install` 命令安装软件包，如 GNU 上游工具链：

```bash
$ ruyi install gnu-upstream
```

上述通过指定软件包名安装的方式默认会安装 latest 的 gnu-upstream，如果想安装某个历史版本的 gnu-upstream，则可以通过指定版本来安装：

```bash
$ ruyi install 'gnu-upstream(0.20231118.0)'
$ ruyi install 'gnu-upstream(==0.20231118.0)'

# match_expr parameter should be in format `<op><ver>`, where `<op>` is one of ['<', '>', '==', '<=', '>=', '!='].
```

若希望重装一个软件包，则可以加上 `--reinstall` 参数：

```bash
$ ruyi install --reinstall gnu-upstream
```

## 安装源码包

ruyi 包管理器同时管理一些源码包，使用 `extract` 命令下载一个源码包并解包到当前目录：

```bash
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
```

## 搭建编译环境

已经安装的工具链与模拟器需要在 ruyi 编译环境中使用，这和 python 的虚拟环境十分类似。
这是由 `venv` 命令实现的：

```bash
$ ruyi venv --toolchain gnu-upstream --emulator qemu-user-riscv-upstream generic ./ruyi_venv
```

这个命令使用预置的 generic 配置，在 `./ruyi_venv` 目录建立包含 gnu-upstream 工具链和
qemu-user-riscv-upstream 模拟器的编译环境。

具体使用参见“编译环境”与“具有 QEMU 支持的编译环境”章节。

## 卸载软件包

注意 ruyi 包管理器没有实现卸载 ruyi 软件包的功能。若您强制中断 ruyi 软件包安装进程或做了其他非预期操作
而会导致软件包功能异常时，请使用 `install --reinstall` 以尝试重试安装该软件包。

## 卸载 RUYI 包管理器

使用下面的命令卸载 Ruyi 包管理器：

```bash
$ ruyi self uninstall
```

这个命令将会询问您以二次确认该操作，如果希望 Ruyi 包管理不询问而直接执行：

```bash
$ ruyi self uninstall -y
```

上面的命令只是删除 Ruyi 本身，并不会删除软件包缓存和安装的 Ruyi 软件包。

如果希望删除所有缓存和安装了的软件包以实现干净的卸载：

```bash
$ ruyi self uninstall --purge
```

同样的这个命令将会询问您以二次确认该操作，如果希望 Ruyi 包管理不询问而直接执行：

```bash
$ ruyi self uninstall --purge -y
```

实现 Ruyi 包管理自身的升级可能会需要 `sudo`，而 Ruyi 包管理被设计为避免进行需要超级用户权限的操作。
故在需要升级 Ruyi 包管理时您需要手动进行该操作，即首先卸载 Ruyi 包管理器，再执行安装 Ruyi 包管理器的过程，
这个过程中您可以自主选择是否保留旧的软件包缓存和 Ruyi 软件包。

## 镜像信息的维护与下载、开发板系统的安装引导

执行如下命令并按照引导执行即可下载所需系统镜像，为设备安装系统：

```bash
$ ruyi device provision
```
