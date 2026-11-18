---
sidebar_position: 1
---

# CoreMark mit der Ruyi-Toolchain bauen (LicheePi 4A)

Dieses Beispiel führt von der Installation des RuyiSDK-Paketmanagers über die Einrichtung einer RISC-V-Umgebung zum Kompilieren und Emulieren bis zum Build und zur Ausführung von CoreMark auf dem LicheePi 4A.

## Testumgebung

- Hardware: LicheePi 4A (TH1520)
- Software: Debian oder openEuler für RISC-V

## RuyiSDK-Paketmanager installieren

1. Folgen Sie der [Installationsanleitung für den RuyiSDK-Paketmanager](/docs/Package-Manager/installation). Verwenden Sie auf dem Board das Paket für `riscv64`.

## Entwicklungsumgebung einrichten

2. Suchen Sie im Paketindex nach der Toolchain:

```bash input="1"
$ ruyi list --name-contains gnu-plct --category-is toolchain
```

3. Installieren Sie die GNU-Toolchain für das LicheePi 4A:

```bash input="1"
$ ruyi install gnu-plct-xthead
```

4. Zeigen Sie die verfügbaren Profile an:

```bash input="1"
$ ruyi list profiles
```

5. Legen Sie die virtuelle Umgebung `venv-sipeed` mit der passenden Toolchain, dem passenden Sysroot und gegebenenfalls einem Emulator an. Ohne Versionsangabe wählt Ruyi die neueste Version im Paketindex, auch wenn lokal eine andere Version installiert ist.

```bash input="2,5,8,11,14"
# Hilfe zur Einrichtung anzeigen
$ ruyi venv -h

# Virtuelle Umgebung anlegen
$ ruyi venv -t gnu-plct-xthead sipeed-lpi4a venv-sipeed

# Verfügbare Werkzeuge prüfen
$ ls venv-sipeed/bin/

# Umgebung aktivieren
$ . venv-sipeed/bin/ruyi-activate

# Compiler in der aktiven Umgebung prüfen
«Ruyi venv-sipeed» sipeed@lpi4a1590:~$ riscv64-plctxthead-linux-gnu-gcc --version
```

Wenn Sie ohne virtuelle Umgebung arbeiten, können Sie den Compiler auch direkt aus dem `bin`-Verzeichnis des installierten Toolchain-Pakets in Ihren `PATH` aufnehmen.

6. Laden Sie die CoreMark-Quellen herunter und entpacken Sie sie:

```bash input="2,5,8"
# Arbeitsverzeichnis anlegen
$ mkdir coremark && cd coremark

# Quellen entpacken
$ ruyi extract coremark

# Inhalt prüfen
$ ls -al
```

## CoreMark für das Zielsystem bauen

7. Passen Sie die Build-Konfiguration wie in der CoreMark-README beschrieben an:

```bash input="1"
$ sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
```

8. Bauen Sie `coremark.exe`:

```bash input="2,4"
# Build starten
$ make PORT_DIR=linux64 link

$ ls -al
# Bei Erfolg erscheint coremark.exe im Verzeichnis.
```

9. Prüfen Sie die Architektur der erzeugten Datei:

```bash input="1"
$ file coremark.exe
```

## Programm ausführen

10. Starten Sie das RISC-V-Programm direkt auf dem Board:

```bash input="1"
$ ./coremark.exe
```
