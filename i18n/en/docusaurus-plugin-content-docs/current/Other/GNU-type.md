---
sidebar_position: 4
---

# RuyiSDK Compilation Tools

### Compilation Toolchains Provided by RuyiSDK

RuyiSDK offers a variety of compilation toolchains tailored for different RISC-V development boards and application scenarios.

| Compilation Toolchain Type             | Description                                                          | Related Links                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **GNU Toolchain**                      |                                                                     | [Repository](https://github.com/RuyiSDK/riscv-gnu-toolchain)                                                                  |
| gnu-upstream                          | Standard GNU toolchain                                              |                                                                                                                               |
| gnu-plct                              | Supports Xiangshan Nanhu microarchitecture 'gnu-plct(==0.20240324.0)'|                                                                                                                               |
| gnu-plct-xthead                       | Suitable for Xuantie                                                |                                                                                                                               |
| gnu-plct-rv64ilp32-elf                | Non-universal toolchain, supports rv64ilp32 bare-metal toolchain, target code format is elf | [Repository](https://github.com/RuyiSDK/riscv-gnu-toolchain-rv64ilp32)[Article](https://mp.weixin.qq.com/s/argIGP4_rUKDm9IRIB-YTg) |
| **LLVM Toolchain**                     |                                                                     |                                                                                                                               |
| llvm-upstream                         |                                                                     |                                                                                                                               |
| **QEMU Emulator**                      |                                                                     | [Repository](https://github.com/ruyisdk/qemu)                                                                                 |
| qemu-system-riscv-upstream            |                                                                     |                                                                                                                               |
| qemu-user-riscv-upstream              |                                                                     |                                                                                                                               |
| qemu-user-riscv-xthead                |                                                                     |                                                                                                                               |

### Diversity of Compilation Toolchains

As shown in the table above, the current RuyiSDK compilation toolchains have different versions due to their ability to implement various extended instruction sets, resulting in a diversity of compilation toolchains. The reasons for this are as follows:

1. **Processor Architecture Evolution**: As processor architectures continue to evolve, new instruction set extensions are introduced to meet different needs. To fully utilize these new instruction set extensions, compilation toolchains are updated accordingly, leading to different versions.
2. **Vendor Customization and Optimization**: Different vendors may customize the same instruction set to varying degrees, leading to customized compilation toolchains.
3. **Evolution of Standards and Specifications**: Although extended instruction sets are standardized, different versions of toolchains may exhibit varying performance, stability, and compatibility under the same standards.
4. **Specific Application Requirements**: Different application fields have varying requirements for extended instruction sets, such as embedded systems, machine learning, and image processing. Different versions of compilation toolchains are optimized for specific fields.

The above reasons contribute to the diversity of compilation toolchains, providing developers with more choices to meet increasingly complex development scenarios.