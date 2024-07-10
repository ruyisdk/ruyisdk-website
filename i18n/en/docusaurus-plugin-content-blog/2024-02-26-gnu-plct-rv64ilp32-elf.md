---
title: "RV64ILP32 bare-metal toolchain & profile now available"
authors: [white]
---

# RV64ILP32 bare-metal toolchain & profile now available

For your convenience following bleeding-edge development, the RuyiSDK team
has packaged a bare-metal toolchain targetting the experimental RV64ILP32 ABI.
Because this is a bare-metal toolchain, no sysroot is provided, and multilib
is not enabled: the ABI to use is `ilp32d`.

## Usage example

Given the following C program:

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

We can now build object code conforming to the RV64ILP32 ABI with the proper
toolchain package and profile:

```shell-session
$ ruyi update
$ ruyi install gnu-plct-rv64ilp32-elf
$ ruyi venv -t gnu-plct-rv64ilp32-elf --without-sysroot baremetal-rv64ilp32 /tmp/venv
$ source /tmp/venv/bin/ruyi-activate
$ /tmp/venv11/bin/riscv64-plct-elf-gcc -O2 -c -o test.o test.c
```

Checking that everything works as intended:

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

It can thus be shown that the toolchain indeed generates object code with
32-bit pointer width, but also leveraging RV64 capabilities.
