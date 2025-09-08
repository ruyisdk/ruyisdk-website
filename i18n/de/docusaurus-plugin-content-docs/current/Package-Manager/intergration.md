---
sidebar_position: 4
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Verwendung von integrierten Funktionen

Der Ruyi-Paketmanager bietet neben den grundlegenden Funktionen zur Verwaltung von Softwarepaketen auch Integrationen für Toolchains, Emulatoren, Images und andere Pakete.

Sie können:

+ Auf die gängigen Quellcode-Pakete von RuyiSDK zugreifen
+ Toolchains und Emulatoren bequem kombinieren, um eine Ruyi-virtuelle Umgebung für eine bestimmte RISC-V-CPU-Plattform einzurichten, ohne zu viele Details verstehen zu müssen
+ Unabhängige Umgebungen im System erstellen, um eine Isolation der Umgebungen für unterschiedliche Versionen von Compiler-Toolchains und Bibliotheksdateien zu gewährleisten, was die Effizienz des Entwicklungsprozesses sichert
+ Ein System-Image, das Sie verwenden möchten, auf ein RISC-V-SOC-Entwicklungsboard mit einer bestimmten Modell- und Konfigurationsnummer flashen
+ Ein gut unterstütztes Echtzeitbetriebssystem für einen bestimmten RISC-V-Mikrocontroller finden

## Ruyi virtuelle Umgebung

Der Ruyi-Paketmanager bietet mit dem Befehl ``venv`` die Möglichkeit, Toolchains und Emulatoren zu kombinieren, um eine virtuelle Umgebung zu erstellen. Die Entwicklungsumgebung stellt die erforderlichen Konfigurationen für verschiedene Entwicklungsboards bereit und übergibt automatisch die benötigten Parameter für den Build.

### Konfiguration der virtuellen Umgebung

Im Ruyi-Software-Repository sind bereits einige vorkonfigurierte Einstellungen verfügbar, die ohne Installation verwendet werden können. Diese Konfigurationen können mit dem Befehl ``ruyi list profiles`` aufgelistet werden:

<CodeBlock lang="bash" code={`
$ ruyi list profiles
generic
baremetal-rv64ilp32 (needs flavor(s): {'rv64ilp32'})
xiangshan-nanhu
sipeed-lpi4a (needs flavor(s): {'xthead'})
milkv-duo
`} />

Einige Konfigurationen benötigen eine Ruyi-Toolchain-Version, die bestimmte flavor(s) unterstützt. Diese Informationen können Sie in der Ausgabe von ``ruyi list --verbose`` abrufen, um zu überprüfen, ob eine bestimmte Toolchain diese Merkmale unterstützt. Alternativ können Sie auch auf die Tabelle im Abschnitt „Toolchain- und vorkonfigurierte Konfigurationen“ zurückgreifen.

### Toolchain- und vorkonfigurierte Konfigurationen

Der Ruyi-Paketmanager überprüft vor der Erstellung der virtuellen Umgebung, ob Konflikte bestehen, garantiert jedoch nicht, dass die erstellte Umgebung verwendbar ist. Um diese Funktion flexibel zu verwenden, sollten Sie ein gewisses Verständnis für diese Toolchains haben. In der Regel können Sie einfach die folgende Tabelle verwenden.

Hier sind die getesteten und bestätigten Konfigurationen aufgeführt:

|   Toolchain   |   sysroot   |  Vorkonfiguration  |  Build-Ziel |
| :--------------------: | :----------: | :-----------------: | :---: |
|        gnu-plct        |     integriert     |       generic       | Linux-Betriebssystem für die Architektur riscv64 |
|        gnu-plct        |     integriert     |      milkv-duo      | Image des MilkV Duo-Entwicklungsboards mit glibc |
|        gnu-plct        |     integriert     |   xiangshan-nanhu   | Xiangshan Nanhu |
|      gnu-upstream      |     integriert     |       generic       | Linux-Betriebssystem für die Architektur riscv64 |
|    gnu-plct-xthead    |     integriert     |    sipeed-lpi4a    | Thead C910 |
| gnu-plct-rv64ilp32-elf |      keine      | baremetal-rv64ilp32 | Bare-Metal rv64ilp32 |
|     llvm-plct         |   gnu-plct   |       generic       | Linux-Betriebssystem für die Architektur riscv64 |
|     llvm-upstream     | gnu-upstream |       generic       | Linux-Betriebssystem für die Architektur riscv64 |

|   Herstellerveröffentlichte Binär-Toolchain   |   sysroot   |  Vorkonfiguration  |  Build-Ziel |
| :--------------------: | :----------: | :-----------------: | :---: |
| gnu-milkv-milkv-duo-elf-bin  |     keine     |   generic   | Bare-Metal für die MilkV Duo-Serie (erfordert zusätzliche Parameter) |
| gnu-milkv-milkv-duo-bin      |     integriert   |   generic   | Image des MilkV Duo-Entwicklungsboards mit glibc (erfordert zusätzliche Parameter) |
| gnu-milkv-milkv-duo-musl-bin |     integriert   |   generic   | Image des MilkV Duo-Entwicklungsboards mit musl (erfordert zusätzliche Parameter) |

Für weitere Informationen zu Compiler-Toolchains siehe [RuyiSDK Compiler-Tools](../Other/GNU-type).

### Erstellung einer virtuellen Umgebung

Details zur Verwendung des ``venv``-Befehls können Sie mit dem Parameter ``-h`` einsehen:

<CodeBlock lang="bash" code={`
$ ruyi venv -h
`} />

Hier sind einige Beispiele:

<CodeBlock lang="bash" code={`
# Erstellen einer RISC-V-virtuellen Umgebung mit der GNU-Upstream-Toolchain:
$ ruyi venv -t gnu-upstream generic ./generic-venv

# Erstellen einer Milkv-Duo-virtuellen Umgebung mit der PLCT-Toolchain:
$ ruyi venv -t gnu-plct milkv-duo ./milkv-venv

# Erstellen einer Xiangshan-Nanhu-virtuellen Umgebung mit der PLCT-Toolchain:
$ ruyi venv -t gnu-plct xiangshan-nanhu ./nanhu-venv

# LLVM benötigt in der Regel die sysroot von GCC:
$ ruyi venv -t llvm-upstream --sysroot-from gnu-plct generic ./llvm-venv

# Erstellen einer Livestream-virtuellen Umgebung mit einer bestimmten Version der Plattform-Toolchain:
$ ruyi venv -t "gnu-plct-xthead(==0.20231212.0)" sipeed-lpi4a ./sipeed-venv

# Ausführen eines cross-compilierten RISC-V-Binärs mit dem Upstream-QEMU-Emulator
$ ruyi venv -t gnu-plct generic -e qemu-user-riscv-upstream ./qemu-venv

# Ausführen eines cross-compilierten RISC-V-Binärs mit dem Tongfang QEMU-Emulator
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a -e qemu-user-riscv-xthead ./xthead-qemu-venv

# Mehrere Toolchains, wobei gnu-upstream die sysroot bereitstellt
$ ruyi venv -t llvm-upstream -t gnu-upstream generic ./upstream-venv
`} />

Virtuelle Umgebungen dienen zur Integration von Toolchains, Emulatoren und weiteren Tools. Bevor Sie die Build-Umgebung erstellen, stellen Sie sicher, dass die entsprechenden Ruyi-Pakete installiert sind.

### Integration in die virtuelle Umgebung

Hier wird die Integration anhand von gnu-upstream im Detail beschrieben. Pfade, ``PS1`` und andere umgebungsbezogene Informationen sollten nach dem Verständnis angepasst werden.

Zuerst installieren Sie die benötigten Pakete folgendes Beispiel:

<CodeBlock lang="bash" code={`
$ ruyi install gnu-upstream qemu-user-riscv-upstream
`} />

Erstellen Sie ein sauberes Verzeichnis für die Ausführung des Beispiels:

<CodeBlock lang="bash" code={`
$ mkdir hello-ruyi
$ cd hello-ruyi
`} />

Ziehen Sie den Quellcode des ruyisdk-Demos:

<CodeBlock lang="bash" code={`
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
`} />

Erstellen Sie die virtuelle Umgebung:

<CodeBlock lang="bash" code={`
$ ruyi venv -t gnu-upstream -e qemu-user-riscv-upstream generic ./myhone-venv
info: Erstellen einer Ruyi-virtuellen Umgebung unter myhone-venv...
info: Die virtuelle Umgebung wurde jetzt erstellt.

Sie können sie aktivieren, indem Sie das entsprechende Aktivierungsskript im
bin-Verzeichnis ausführen, und deaktivieren, indem Sie \`ruyi-deactivate\` aufrufen.

Ein neues sysroot/präfix wurde ebenfalls in der virtuellen Umgebung bereitgestellt.
Es ist unter dem folgenden Pfad verfügbar:

    /home/myhone/hello-ruyi/myhone-venv/sysroot

Die virtuelle Umgebung enthält auch eine fertige CMake-Toolchain-Datei
und eine Meson-Cross-Datei. Überprüfen Sie das Wurzelverzeichnis der virtuellen Umgebung auf diese;
Kommentare in den Dateien enthalten Benutzungsanweisungen.
`} />

Diese virtuelle Umgebung integriert die gnu-upstream-Toolchain und den qemu-user-riscv-upstream-Emulator unter der generischen Konfiguration für das Ziel-Betriebssystem riscv64 Linux und erstellt die Build-Umgebung im Verzeichnis ``./myhome-venv`` (es kann auch ein absoluter Pfad verwendet werden). Die Ausgabe des Befehls gibt Informationen zur Aktivierung der Build-Umgebung, um die Build-Umgebung zu verlassen, den absoluten Pfad des sysroot-Verzeichnisses sowie einige andere Informationen zurück.

Im Verzeichnis der virtuellen Umgebung können Sie die mit der Build-Umgebung verbundenen Dateien sehen:

<CodeBlock lang="bash" code={`
$ ls ./myhone-venv/
bin                                        ruyi-venv.toml
binfmt.conf                                sysroot
meson-cross.ini                            sysroot.riscv64-unknown-linux-gnu
meson-cross.riscv64-unknown-linux-gnu.ini  toolchain.cmake
ruyi-cache.v1.toml                         toolchain.riscv64-unknown-linux-gnu.cmake
`} />

Die Datei ``binfmt.conf`` ist ein Beispielkonfigurationsdatei für systemd-binfmt, und ``toolchain.cmake`` sowie ``meson-cross.ini`` können für die Cross-Kompilierung von Projekten verwendet werden. ``sysroot`` ist das für diese virtuelle Umgebung verwendete sysroot und das ``bin``-Verzeichnis enthält die verfügbaren Befehle und Skripte dieser Build-Umgebung.

Im ``bin``-Verzeichnis können Sie die verfügbaren Toolchain-Binärdateien sehen:

<CodeBlock lang="bash" code={`
$ ls ./myhone-venv/bin/
riscv64-unknown-linux-gnu-addr2line  riscv64-unknown-linux-gnu-gcc-ranlib     riscv64-unknown-linux-gnu-nm
riscv64-unknown-linux-gnu-ar         riscv64-unknown-linux-gnu-gcov           riscv64-unknown-linux-gnu-objcopy
riscv64-unknown-linux-gnu-as         riscv64-unknown-linux-gnu-gcov-dump      riscv64-unknown-linux-gnu-objdump
riscv64-unknown-linux-gnu-c++        riscv64-unknown-linux-gnu-gcov-tool      riscv64-unknown-linux-gnu-ranlib
riscv64-unknown-linux-gnu-cc         riscv64-unknown-linux-gnu-gdb            riscv64-unknown-linux-gnu-readelf
riscv64-unknown-linux-gnu-c++filt    riscv64-unknown-linux-gnu-gdb-add-index  riscv64-unknown-linux-gnu-size
riscv64-unknown-linux-gnu-cpp        riscv64-unknown-linux-gnu-gfortran       riscv64-unknown-linux-gnu-strings
riscv64-unknown-linux-gnu-elfedit    riscv64-unknown-linux-gnu-gprof          riscv64-unknown-linux-gnu-strip
riscv64-unknown-linux-gnu-g++        riscv64-unknown-linux-gnu-ld             ruyi-activate
riscv64-unknown-linux-gnu-gcc        riscv64-unknown-linux-gnu-ld.bfd         ruyi-qemu
riscv64-unknown-linux-gnu-gcc-ar     riscv64-unknown-linux-gnu-ldd
riscv64-unknown-linux-gnu-gcc-nm     riscv64-unknown-linux-gnu-lto-dump
`} />

Es sind die gesamten Toolchain-Befehle enthalten, sowie der QEMU-Benutzermodus-Emulator, der als ``ruyi-qemu`` umbenannt wurde, und das Skript ``ruyi-activate``, das zum Aktivieren der virtuellen Umgebung verwendet wird. Das Script verlinkt tatsächlich auf die Ruyi-Toolchain-Funktionen.

Durch das Ausführen von ``source`` ruyi-activate wird die Build-Umgebung aktiviert und ``PS1`` wird geändert:

<CodeBlock lang="bash" code={`
$ source ./myhone-venv/bin/ruyi-activate
«Ruyi myhone-venv» $
`} />

Gleichzeitig wird auch ``PATH`` geändert, sodass nun direkt auf die Toolchain zugegriffen werden kann:

<CodeBlock lang="bash" code={`
«Ruyi myhone-venv» $ whereis riscv64-unknown-linux-gnu-gcc
riscv64-unknown-linux-gnu-gcc: /home/myhone/hello-ruyi/myhone-venv/bin/riscv64-unknown-linux-gnu-gcc
«Ruyi myhone-venv» $ riscv64-unknown-linux-gnu-gcc --version
riscv64-unknown-linux-gnu-gcc (RuyiSDK 20231212 Upstream-Sources) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.
Dies ist freie Software; siehe die Quelle für Kopierbedingungen. Es gibt KEINE
Garantie; nicht einmal für MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
`} />

In der Ruyi virtuellen Umgebung wird, zusätzlich zu den automatisch an die Toolchain übergebenen Konfigurationsarchitektur-Optionen, die Verwendung von Toolchain und Emulator nicht wesentlich verändert. Weitere Inhalte finden Sie im Abschnitt „Anwendungsbeispiele“. 

Bauen Sie das ruyisdk-Demo:

<CodeBlock lang="bash" code={`
$ cd rvv-autovec
$ make
`} />

Nach der Verwendung der virtuellen Umgebung können Sie die Build-Umgebung verlassen, und alles wird auf den vorherigen Zustand zurückgesetzt:

<CodeBlock lang="bash" code={`
«Ruyi myhone-venv» $ ruyi-deactivate
$
`} />

## Ruyi-Image-Integration

Die Image-Integration von Ruyi bietet die Möglichkeit, Images für Entwicklungsboards zu flashen und Dokumentationen für Mikrocontrollergeräte bereitzustellen. Diese Funktion ist mit dem RuyiSDK-Projekt [RISC-V Entwicklungsboards und Betriebssystem-Supportmatrix](https://github.com/ruyisdk/support-matrix/) verbunden.

Diese Funktion bietet einen Assistenten, der das Flashen von System-Images auf RISC-V-Geräte mithilfe von ``dd`` und ``fastboot`` unterstützt und bietet auch Leitfäden für RISC-V-Mikrocontroller, die nicht regulär geflasht werden können.

<CodeBlock lang="bash" code={`
$ ruyi device provision
`} />

Weitere detaillierte Beispiele können im Abschnitt „Anwendungsbeispiele“ nachgeschlagen werden.
