---
sidebar_position: 1
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Verwendung der Ruyi-Compilerumgebung (am Beispiel von Licheepi 4A)

Anhand des Open-Source-Benchmarkprogramms Coremark wird der Prozess vom Installieren über den ruyi-Paketmanager bis hin zum Aufbau einer RISC-V-Compiler- und Simulationsumgebung demonstriert. Dabei wird der Quellcode von Coremark lokal kompiliert und auf dem Licheepi 4A-Entwicklungsboard ausgeführt.

## Umgebungsbeschreibung

- Hardware-Umgebung: Licheepi 4A Entwicklungsboard (th1520)
- Software-Umgebung: Debian/openEuler für RISC-V

## Installation des ruyi-Paketmanagers

1. [Optional] Entfernen Sie den derzeit installierten ruyi-Paketmanager sowie alle zugehörigen Daten.

<<<<<<< HEAD
<CodeBlock lang="bash" code={

`ruyi self uninstall --purge`

} />

2. Laden Sie das `ruyi`-Tool herunter, gewähren Sie ihm Ausführungsrechte und fügen Sie es der Umgebungsvariable hinzu: Laden Sie das neueste `ruyi`-Tool von [ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/) oder dem [ISCAS-Mirrorsource](https://mirror.iscas.ac.cn/RuyiSDK/ruyi/releases/) herunter.

<CodeBlock lang="bash" code={

`# Laden Sie die riscv64-Version des ruyi-Paketmanagers herunter, legen Sie sie im PATH ab und gewähren Sie ihr Ausführungsrechte

=======
<CodeBlock lang="bash" code={`ruyi self uninstall --purge`} />

2. Laden Sie das `ruyi`-Tool herunter, gewähren Sie ihm Ausführungsrechte und fügen Sie es der Umgebungsvariable hinzu: Laden Sie das neueste `ruyi`-Tool von [ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/) oder dem [ISCAS-Mirrorsource](https://mirror.iscas.ac.cn/RuyiSDK/ruyi/releases/) herunter.

<CodeBlock lang="bash" code={`# Laden Sie die riscv64-Version des ruyi-Paketmanagers herunter, legen Sie sie im PATH ab und gewähren Sie ihr Ausführungsrechte
>>>>>>> 7803df1 (Update de codeblocks)
wget https://github.com/ruyisdk/ruyi/releases/download/0.25.0/ruyi-0.25.0.riscv64

sudo cp ruyi-0.25.0.riscv64 /usr/local/bin/ruyi

sudo chmod +x ruyi
<<<<<<< HEAD

cd`

} />

3. Überprüfen Sie, ob der ruyi-Paketmanager verwendet werden kann.

<CodeBlock lang="bash" code={

`ruyi --version`

} />

4. Aktualisieren Sie den Index der Softwarequellen.

<CodeBlock lang="bash" code={

`ruyi update`

} />
=======
cd`} />

3. Überprüfen Sie, ob der ruyi-Paketmanager verwendet werden kann.

<CodeBlock lang="bash" code={`ruyi --version`} />

4. Aktualisieren Sie den Index der Softwarequellen.

<CodeBlock lang="bash" code={`ruyi update`} />
>>>>>>> 7803df1 (Update de codeblocks)

## Bereitstellung der Entwicklungsumgebung mit dem ruyi-Paketmanager:

5. Überprüfen Sie die Paketindexinformationen des Softwarerepositories.

<<<<<<< HEAD
<CodeBlock lang="bash" code={

`ruyi list`

} />

6. Installieren Sie gnu: ruyi install `<package-name>`

<CodeBlock lang="bash" code={

`# Installieren der für Licheepi 4A geeigneten Compiler-Toolchain gnu-plct-xthead 

ruyi install gnu-plct-xthead`

} />

7. Überprüfen Sie die vordefinierten Compilerumgebungen.

<CodeBlock lang="bash" code={

`ruyi list profiles`

} />
=======
<CodeBlock lang="bash" code={`ruyi list`} />

6. Installieren Sie gnu: ruyi install `<package-name>`

<CodeBlock lang="bash" code={`# Installieren der für Licheepi 4A geeigneten Compiler-Toolchain gnu-plct-xthead 
ruyi install gnu-plct-xthead`} />

7. Überprüfen Sie die vordefinierten Compilerumgebungen.

<CodeBlock lang="bash" code={`ruyi list profiles`} />
>>>>>>> 7803df1 (Update de codeblocks)

8. Erstellen Sie die ruyi-Virtual Environment venv-sipeed mit dem angegebenen Toolchain- und Emulator-Konfigurations.
   > Beachten Sie, dass beim Erstellen der virtuellen Umgebung die korrekte Compiler-Version und Sysroot-Art ausgewählt werden muss.
   > Wenn keine Versionsnummer angegeben wird, wird standardmäßig die neueste Version aus den Softwarequellen verwendet, nicht die lokal installierte Version.

<<<<<<< HEAD
<CodeBlock lang="bash" code={

`ruyi venv -h


=======
<CodeBlock lang="bash" code={`ruyi venv -h
>>>>>>> 7803df1 (Update de codeblocks)

# Erstellen der virtuellen Umgebung venv-sipeed

ruyi venv -t gnu-plct-xthead sipeed-lpi4a venv-sipeed 



# Überprüfen der Tools in der Compilerumgebung

ls venv-sipeed/bin/ 



# Aktivieren der virtuellen Umgebung (die virtuelle Umgebung kann als ein Container verstanden werden, der eine Isolierung der Laufzeitumgebung ermöglicht. Nach der Aktivierung wird in der venv-sipeed-Umgebung die Toolchain der Version gnu-plct-xthead genutzt. Alternativ kann auch eine Umgebungsvariable für /home/sipeed/.local/share/ruyi/binaries/riscv64/gnu-plct-xthead-2.8.0-ruyi.20240222/bin konfiguriert werden, um gcc direkt zu verwenden.)

. venv-sipeed/bin/ruyi-activate 



# Überprüfen, ob gcc in der aktuellen virtuellen Umgebung verfügbar ist
<<<<<<< HEAD

«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version`

} />

9. Laden Sie den Quellcode von Coremark herunter und extrahieren Sie ihn, um ein Kompilierungsziel zu erhalten.

<CodeBlock lang="bash" code={

`mkdir coremark && cd coremark

ruyi extract coremark

ls -al`

} />
=======
«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version`} />

9. Laden Sie den Quellcode von Coremark herunter und extrahieren Sie ihn, um ein Kompilierungsziel zu erhalten.

<CodeBlock lang="bash" code={`mkdir coremark && cd coremark
ruyi extract coremark
ls -al`} />
>>>>>>> 7803df1 (Update de codeblocks)

## Cross-Kompilierung von Coremark

10. Stellen Sie die Kompilierungskonfiguration im Coremark-Quellcode ein (siehe README-Dokument des Coremark-Repositories).

<<<<<<< HEAD
<CodeBlock lang="bash" code={

`sed -i 's/\\bgcc\\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak`

} />

11. Führen Sie die Cross-Kompilierung und den Aufbau durch, um das ausführbare Programm coremark.exe zu erhalten.

<CodeBlock lang="bash" code={

`make PORT_DIR=linux64 link

ls -al    # das neue ausführbare Programm coremark.exe`

} />

12. Überprüfen Sie die Eigenschaften des riscv64-executables.

<CodeBlock lang="bash" code={

`file coremark.exe

# Die Rückgabe der Befehle zeigt architekturspezifische Informationen der Datei an`

} />
=======
<CodeBlock lang="bash" code={`sed -i 's/\\bgcc\\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak`} />

11. Führen Sie die Cross-Kompilierung und den Aufbau durch, um das ausführbare Programm coremark.exe zu erhalten.

<CodeBlock lang="bash" code={`make PORT_DIR=linux64 link
ls -al    # das neue ausführbare Programm coremark.exe`} />

12. Überprüfen Sie die Eigenschaften des riscv64-executables.

<CodeBlock lang="bash" code={`file coremark.exe
# Die Rückgabe der Befehle zeigt architekturspezifische Informationen der Datei an`} />
>>>>>>> 7803df1 (Update de codeblocks)

## Ausführungsvalidierung

13. Führen Sie das riscv64 coremark-executable direkt aus.

<<<<<<< HEAD
<CodeBlock lang="bash" code={

`./coremark.exe`

} />
=======
<CodeBlock lang="bash" code={`./coremark.exe`} />
>>>>>>> 7803df1 (Update de codeblocks)
