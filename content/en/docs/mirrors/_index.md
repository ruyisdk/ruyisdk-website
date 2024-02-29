---
title: 用户软件源搭建
description: 
date: 2017-01-04
weight: 8
---

软件源搭建功能在 v0.2 尚未开发完全，仅有建立 manifest 的功能。

建立 manifest ：

```bash
$ ruyi admin manifest ./source/zlib-ng-2.1.5.tar.gz
[
  {
    "name": "zlib-ng-2.1.5.tar.gz",
    "size": 2410601,
    "checksums": {
      "sha512": "9212d87c63a2da4e5355a7a1c75380aeba40fbd0ea3d71d3784cb3eac94237f9bea2a1b7993a08f39d4197725c4c133087d3a9d213d3944aa48a7559de2be920",
      "sha256": "3f6576971397b379d4205ae5451ff5a68edf6c103b2f03c4188ed7075fbb5f04"
    }
  }
]
```

