---
sidebar_position: 4
---

# RuyiSDK Kompilierungswerkzeuge

### Kompilierungswerkzeugkette von RuyiSDK

RuyiSDK bietet verschiedene Arten von Kompilierungswerkzeugketten an, die für unterschiedliche RISC-V Entwicklungsboards und Anwendungsszenarien geeignet sind.

| Typ der Kompilierungswerkzeugkette | Beschreibung                                                  | Relevante Links                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **GNU Werkzeugkette**              |                                                            | [Repository](https://github.com/RuyiSDK/riscv-gnu-toolchain)                                                          |
| gnu-upstream                       | Standard GNU Werkzeugkette                                   |                                                                                                                       |
| gnu-plct                           | Unterstützt die Xiangshan Nanhu Mikroarchitektur 'gnu-plct(==0.20240324.0)' |                                                                                                                       |
| gnu-plct-xthead                    | Geeignet für XuanTie                                        |                                                                                                                       |
| gnu-plct-rv64ilp32-elf             | Nicht allgemeine Werkzeugkette, unterstützt rv64ilp32 Bare-Metal Werkzeugkette, Zielcodeformat ist elf | [Repository](https://github.com/RuyiSDK/riscv-gnu-toolchain-rv64ilp32)[Artikel](https://mp.weixin.qq.com/s/argIGP4_rUKDm9IRIB-YTg) |
| **LLVM Werkzeugkette**             |                                                            |                                                                                                                       |
| llvm-upstream                      |                                                            |                                                                                                                       |
| **QEMU Emulator**                  |                                                            | [Repository](https://github.com/ruyisdk/qemu)                                                                         |
| qemu-system-riscv-upstream         |                                                            |                                                                                                                       |
| qemu-user-riscv-upstream           |                                                            |                                                                                                                       |
| qemu-user-riscv-xthead             |                                                            |                                                                                                                       |

### Vielfalt der Kompilierungswerkzeugketten

Wie in der obigen Tabelle dargestellt, hat die RuyiSDK Kompilierungswerkzeugkette aufgrund der Fähigkeit, verschiedene erweiterte Befehlssätze zu implementieren, unterschiedliche Versionen hervorgebracht, was zu einer Vielfalt der Kompilierungswerkzeugketten führt. Die Gründe dafür sind wie folgt:

1. **Entwicklung der Prozessorarchitektur**: Die Prozessorarchitektur wird kontinuierlich aktualisiert und iteriert, wobei neue Befehlssatzerweiterungen eingeführt werden, um unterschiedlichen Anforderungen gerecht zu werden. Um diese neuen Befehlssatzerweiterungen vollständig nutzen zu können, wird die Kompilierungswerkzeugkette ebenfalls aktualisiert, was zu verschiedenen Versionen führt.
2. **Herstelleranpassungen und -optimierungen**: Verschiedene Hersteller passen denselben Befehlssatz in unterschiedlichem Maße an, was zu einer Anpassung der Kompilierungswerkzeugkette führt.
3. **Entwicklung von Standards und Normen**: Obwohl die erweiterten Befehlssätze standardisiert sind, zeigen verschiedene Versionen der Werkzeugkette unter denselben Standards unterschiedliche Leistungen, Stabilität und Kompatibilität.
4. **Spezifische Anwendungsanforderungen**: Verschiedene Anwendungsbereiche haben unterschiedliche Anforderungen an erweiterte Befehlssätze, wie z.B. eingebettete Systeme, maschinelles Lernen, Bildverarbeitung usw. Verschiedene Versionen der Kompilierungswerkzeugkette werden für spezifische Bereiche optimiert.

Die oben genannten Gründe führen zu einer Diversifizierung der Kompilierungswerkzeugketten, die den Entwicklern mehr Auswahlmöglichkeiten bieten und komplexeren Entwicklungsszenarien gerecht werden.