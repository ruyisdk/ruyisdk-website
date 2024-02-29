---
title: RUYI 编译环境
description: 
date: 2017-01-04
weight: 8
---

RUYI 包管理器使用 ``venv`` 命令应用配置到指定的工具链以建立编译环境。这和 python 的虚拟环境类似。

RUYI 包管理预置的配置可以使用 ``list profiles`` 命令查看

```bash
$ ruyi list profiles
generic
sipeed-lpi4a (needs flavor(s): {'xthead'})
milkv-duo
```

## 工具链与预置配置组合

RUYI 包管理在建立编译环境之前会检查该环境是否合法，但是并不保证建立成功的环境一定可用于构建。

这里列出了经过测试可用的配置组合：

| 工具链 | sysroot | 预置配置 |
|:-:|:-:|:-:|
| gnu-upstream | 自带 | generic |
| gnu-plct | 自带 | generic |
| gnu-plct | 自带 | milkv-duo |
| gnu-plct-xthead | 自带 | sipeed-lpi4a |
| llvm-upstream | gnu-upstream | generic |
| llvm-upstream | gnu-plct | generic |
