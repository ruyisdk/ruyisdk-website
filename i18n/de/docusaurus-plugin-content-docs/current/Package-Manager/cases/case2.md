---
sidebar_position: 2
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Verwendung der vom Anbieter veröffentlichten Binär-Toolchain zum Bauen (am Beispiel von MilkV Duo)

Dieser Artikel verwendet die Milkv-Duo-Build-Umgebung, um coremark zu erstellen.

Zuerst betreten Sie die Build-Umgebung:

<CodeBlock lang="bash" code={`# Installieren Sie die Build-Toolchain gnu-milkv-milkv-duo-musl-bin
$ ruyi install gnu-milkv-milkv-duo-musl-bin
# Erstellen Sie die virtuelle Umgebung milkv-venv mit dem allgemeinen Profil
$ ruyi venv -t gnu-milkv-milkv-duo-musl-bin generic milkv-venv
# Aktivieren Sie die virtuelle Umgebung
$ . milkv-venv/bin/ruyi-activate
«Ruyi milkv-venv» $`} />

Der Quellcode von coremark kann direkt aus dem Ruyi-Software-Repository heruntergeladen werden:

<CodeBlock lang="bash" code={`«Ruyi milkv-venv» $ mkdir coremark
«Ruyi milkv-venv» $ cd coremark
«Ruyi milkv-venv» $ ruyi extract coremark
info: downloading https://mirror.iscas.ac.cn/RuyiSDK/dist/coremark-1.01.tar.gz to /home/myon/.cache/ruyi/distfiles/coremark-1.01.tar.gz
  % Total    % Received % Xferd  Durchschnittsgeschwindigkeit   Zeit    Zeit     Zeit  Aktuell
                                 Dload  Upload   Total   Verbraucht    Verbleibend  Geschwindigkeit
100  391k  100  391k    0     0  1400k      0 --:--:-- --:--:-- --:--:-- 1404k
info: extracting coremark-1.01.tar.gz for package coremark-1.0.1
info: package coremark-1.0.1 extracted to current working directory`} />

Dieser Vorgang lädt den Quellcode von coremark aus dem Ruyi-Software-Repository herunter und entpackt ihn in das **aktuelle Verzeichnis**.

Da die verwendete Toolchain ``gnu-milkv-milkv-duo-bin`` ist, müssen wir das Build-Script bearbeiten, um den bin-Ordner zu überprüfen:

<CodeBlock lang="bash" code={`«Ruyi milkv-venv» $ sed -i 's/\\bgcc\\b/riscv64-unknown-linux-musl-gcc/g' linux64/core_portme.mak`} />

Bauen Sie coremark:

<CodeBlock lang="bash" code={`«Ruyi milkv-venv» $ make PORT_DIR=linux64 LFLAGS_END=-march=rv64gcv0p7xthead link
riscv64-unknown-linux-musl-gcc -O2 -Ilinux64 -I. -DFLAGS_STR=\\""-O2   -march=rv64gcv0p7xthead"\\" -DITERATIONS=0  core_list_join.c core_main.c core_matrix.c core_state.c core_util.c linux64/core_portme.c -o ./coremark.exe -march=rv64gcv0p7xthead
Link performed along with compile
«Ruyi milkv-venv» $ file coremark.exe
coremark.exe: ELF 64-bit LSB executable, UCB RISC-V, RVC, double-float ABI, version 1 (SYSV), dynamisch verlinkt, Interpreter /lib/ld-musl-riscv64v0p7_xthead.so.1, mit debug_info, nicht gestripped`} />

Es ist zu sehen, dass das Binärformat für die RISC-V-Architektur erfolgreich erstellt wurde. Beachten Sie, dass dieser gesamte Prozess, wenn er in einer riscv64-Umgebung durchgeführt wird, keine Cross-Kompilierung ist.

Verlassen Sie die virtuelle Umgebung

<CodeBlock lang="bash" code={`«Ruyi milkv-venv» $ ruyi-deactivate
$`} />

## Ausführen auf dem neuesten Milkv Duo-Image

Übertragen Sie die coremark-Binärdatei auf Milkv Duo, ändern Sie die IP-Adresse von Milkv Duo gemäß der tatsächlichen Situation.

<CodeBlock lang="bash" code={`$ scp -O ./coremark.exe root@192.168.42.1:~`} />

Führen Sie die Datei auf Milkv Duo aus

<CodeBlock lang="bash" code={`[root@milkv-duo]~# ./coremark.exe
2K Leistungsrunparameter für coremark.
CoreMark-Größe    : 666
Gesamtticks       : 14911
Gesamte Zeit (Sek.) : 14.911000
Iterations/Sek   : 2011.937496
Iterationen       : 30000
Compiler-Version  : GCC13.1.0
Compiler-Flags    : -O2   -static
Speicherort       : Bitte geben Sie hier den Speicherort der Daten an
                        (z.B. Code im Flash, Daten im Heap usw.)
seedcrc          : 0xe9f5
[0]crclist       : 0xe714
[0]crcmatrix     : 0x1fd7
[0]crcstate      : 0x8e3a
[0]crcfinal      : 0x5275
Korrektes Verhalten validiert. Siehe readme.txt für Ausführungs- und Berichtsregeln.
CoreMark 1.0 : 2011.937496 / GCC13.1.0 -O2   -static / Heap`} />