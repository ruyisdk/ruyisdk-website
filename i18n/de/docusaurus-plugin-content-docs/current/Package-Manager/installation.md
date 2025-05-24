---
sidebar_position: 2
---

# Installation

Lassen Sie uns mit der Installation des RuyiSDK-Paketmanagers beginnen.

Dieses Dokument verwendet ``~`` als Kurznotation für das Home-Verzeichnis des aktuellen regulären Benutzers und verwendet, falls erforderlich, ``/home/myhone`` als Beispiel für einen absoluten Pfad zum Home-Verzeichnis.

## Installation mit vorgefertigten Binärdateien

Derzeit wurden für das RuyiSDK-Paketmanagement-Tool vorgefertigte Binärdateien für die **Linux**-Betriebssysteme mit den Architekturen **amd64**, **arm64** und **riscv64** bereitgestellt. Dieses Tool ist unabhängig vom System-Python und hat ein breiteres Anwendungsgebiet.

Diese werden sowohl auf GitHub Release als auch auf dem ISCAS-Repository veröffentlicht:

- [ruyi GitHub Releases](https://github.com/RuyiSDK/ruyi/releases/)
- [ISCAS-Mirror-Source](https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/)

Um den Installationsprozess zu beschreiben, verwenden wir das ISCAS-Mirror-Source-Beispiel. Führen Sie zunächst ``uname -m`` aus, um die Systemarchitektur zu überprüfen und die entsprechende Binärdatei herunterzuladen.

Wenn die Ausgabe ``x86_64`` ist:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.26.0/ruyi.amd64
```

Wenn die Ausgabe ``aarch64`` ist:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.26.0/ruyi.arm64
```

Wenn die Ausgabe ``riscv64`` ist:

```bash
$ wget https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/0.26.0/ruyi.riscv64
```

Im Folgenden nehmen wir die Architektur ``x86_64`` als Beispiel, um dem heruntergeladenen Binary Ausführungsrechte zu erteilen:

```bash
$ chmod +x ./ruyi.amd64
```

Installieren Sie die Binärdatei in das Verzeichnis, das im ``PATH`` enthalten ist:

```bash
$ sudo cp -v ruyi.amd64 /usr/local/bin/ruyi
```

Wenn Ihr ``PATH`` das Verzeichnis ``~/.local/bin/`` enthält, könnte es die empfehlenswertere Wahl sein, ``ruyi`` in ``~/.local/bin/ruyi`` zu installieren. Installationen und Deinstallationen in diesem Verzeichnis benötigen keine Superuser-Rechte.

Bitte beachten Sie, dass der Name der Binärdatei ``ruyi`` sein muss.

## Installation mit dem System-Paketmanager

Derzeit können Arch-Linux-Benutzer den Ruyi-Paketmanager über den System-Paketmanager installieren und deinstallieren. Im Vergleich zur Verwendung der vorgefertigten Binärdateien ist die Wartung einfacher; die Verwendung von System-Python kann auch bessere Leistung bieten.

Installieren Sie aus dem AUR, Beispiel mit ``yay``, beachten Sie, dass Sie als regulärer Benutzer arbeiten sollten:

```bash
$ yay -S ruyi
```

Um aus dem Arch Linux CN Software-Repository zu installieren, fügen Sie eine Konfiguration hinzu, indem Sie das ISCAS Open Source Mirror verwenden:

```bash
[archlinuxcn]
Server = https://mirror.iscas.ac.cn/archlinuxcn/$arch
```

Installieren Sie mit ``pacman``:

```bash
$ sudo pacman -Sy
$ sudo pacman -S ruyi
```

## Überprüfen Sie Ihre Installation

```bash
$ ruyi version
```

Der Befehl sollte ordnungsgemäß ausgeführt werden und die Version sowie Copyright-Informationen anzeigen. Wenn dies nicht der Fall ist, überprüfen Sie die Systemumgebung oder versuchen Sie die Installation erneut.

## Erste Schritte

Damit ist der Ruyi-Paketmanager erfolgreich auf Ihrem System installiert. Sie können die Hilfe von Ruyi selbst konsultieren, um sich mit der Anwendung vertraut zu machen, oder dieses Dokument weiter lesen.

Hilfeinformationen auflisten:

```bash
$ ruyi --help
```