---
title: "RV64ILP32 裸机工具链与 profile 现已可用"
authors: [white]
---

# RV64ILP32 裸机工具链与 profile 现已可用

为了您的跟踪前沿开发动态方便，RuyiSDK 团队现已打包了 RV64ILP32 这一实验性 ABI 的裸机工具链供您使用。
由于是裸机工具链，此工具链不自带 sysroot，且未开启 multilib：可用的 ABI 为 `ilp32d`。

## 使用示例

给定如下的 C 程序：

```c
// test.c
long long add(long long *a, long long b)
{
    return *a + b;  // Should be realized with `ld` and `add`
}

void check(int);

void check_sizes(void)
{
    check(sizeof(int));        // a0 should be 4
    check(sizeof(long));       // a0 should be 4
    check(sizeof(long long));  // a0 should be 8
    check(sizeof(void *));     // a0 should be 4
}
```

使用相应的工具链包与 profile，我们将可编译出符合 RV64ILP32 ABI 的目标代码：

```shell-session
$ ruyi update
$ ruyi install gnu-plct-rv64ilp32-elf
$ ruyi venv -t gnu-plct-rv64ilp32-elf --without-sysroot baremetal-rv64ilp32 /tmp/venv
$ source /tmp/venv/bin/ruyi-activate
$ /tmp/venv11/bin/riscv64-plct-elf-gcc -O2 -c -o test.o test.c
```

检查目标代码是否符合预期：

```shell-session
$ riscv64-plct-elf-readelf -h test.o | grep 32
  Class:                             ELF32
  Flags:                             0x25, RVC, X32, double-float ABI
```

```shell-session
$ riscv64-plct-elf-objdump -dw test.o

test.o:     file format elf32-littleriscv


Disassembly of section .text:

00000000 <add>:
   0:   6108                    ld      a0,0(a0)
   2:   952e                    add     a0,a0,a1
   4:   8082                    ret

00000006 <check_sizes>:
   6:   3141                    addiw   sp,sp,-16
   8:   4511                    li      a0,4
   a:   e406                    sd      ra,8(sp)
   c:   00000097                auipc   ra,0x0
  10:   000080e7                jalr    ra # c <check_sizes+0x6>
  14:   4511                    li      a0,4
  16:   00000097                auipc   ra,0x0
  1a:   000080e7                jalr    ra # 16 <check_sizes+0x10>
  1e:   4521                    li      a0,8
  20:   00000097                auipc   ra,0x0
  24:   000080e7                jalr    ra # 20 <check_sizes+0x1a>
  28:   60a2                    ld      ra,8(sp)
  2a:   4511                    li      a0,4
  2c:   2141                    addiw   sp,sp,16
  2e:   00000317                auipc   t1,0x0
  32:   00030067                jr      t1 # 2e <check_sizes+0x28>
```

可见，此工具链确实生成了指针宽度为 32 位，但利用了 RV64 能力的目标代码。
