---
sidebar_position: 1
---

# Funktionsübersicht

- **Pakete**. Ruyi-Pakete in der Seitenleiste von VS Code suchen, installieren und deinstallieren.
- **Virtuelle Umgebungen**. Ruyi-Umgebungen mit dem Assistenten erstellen und aktivieren. Terminal und Build-Werkzeuge übernehmen die Umgebung automatisch.
- **Neuigkeiten und Statusleiste**. Nachrichten lesen, Statusmeldungen sehen und die aktive virtuelle Umgebung wechseln.
- **Quellpakete**. Offizielle Beispiele oder Quellpakete über das Kontextmenü im Explorer herunterladen und entpacken.

  ![Startseite der RuyiSDK-Erweiterung](@site/docs/VSCode-Plugins/image/image-1.png)

Anleitungen finden Sie unter [Pakete](packages), [Virtuelle Umgebungen](venv), [Neuigkeiten](news) und [Quellpakete entpacken](extract).

## Benutzeroberfläche

- Über **Ruyi** in der Aktivitätsleiste erreichen Sie **Packages** und **Virtual Environments**. Die Statusleiste zeigt die aktuelle virtuelle Umgebung und den Zugang zu den Neuigkeiten.
- Klicken Sie auf eine virtuelle Umgebung, um sie zu aktivieren. Das integrierte Terminal und CMake- oder Meson-Builds übernehmen dann `PATH` und die Cross-Kompilierungseinstellungen aus Dateien wie `toolchain.cmake` und `meson-cross.ini`.

## Beispiel für den Entwicklungsablauf

Das folgende Beispiel zeigt, wie Sie ein kleines Programm in VS Code für RISC-V cross-kompilieren und ausführen.

### Hello World mit der Erweiterung

1. Installieren Sie unter **Packages** die Toolchain `gnu-upstream` und bei Bedarf `qemu-user-riscv-upstream` für die lokale Emulation.
2. Klicken Sie unter **Virtual Environments** auf `+`, wählen Sie das Profil `generic` und die Toolchain `gnu-upstream` aus und geben Sie einen Namen und Pfad an. Erstellen und aktivieren Sie die Umgebung.
3. Legen Sie im Arbeitsbereich die Datei `hello.c` an.

```c
#include <stdio.h>
int main() {
    printf("Hello, RuyiSDK!\n");
    return 0;
}
```

4. Öffnen Sie das VS-Code-Terminal mit der aktiven Umgebung und führen Sie Build und Programm aus.

```bash input="1,2"
riscv64-unknown-linux-gnu-gcc hello.c -o hello
ruyi-qemu ./hello
```

> Bei einer Installation von Ruyi über `pipx` sind [Probleme bekannt](https://github.com/ruyisdk/ruyisdk/issues/414). Führen Sie zuerst `pipx ensurepath` aus und starten Sie das Terminal neu, damit `ruyi-qemu` verfügbar ist. Setzen Sie außerdem `PYTHONPATH` auf den Installationspfad von Ruyi, zum Beispiel `export PYTHONPATH="$HOME/.local/pipx/venvs/ruyi/lib/python3.x/site-packages:$PYTHONPATH"`.

Wenn `Hello, RuyiSDK!` ausgegeben wird, waren Build und Ausführung erfolgreich.

![Hello-World-Ausgabe](@site/docs/VSCode-Plugins/image/image.png)

#### Hinweise

- Falls Sie QEMU nicht verwenden, können Sie die ausführbare Datei auf das Zielgerät übertragen. Beachten Sie die Dokumentation des Geräts und die Anwendungsfälle.
- Einen umfangreicheren Build zeigt das [CoreMark-Beispiel für LicheePi 4A](./cases/case1.md).

## Weitere Informationen

- [Repository und Fehlerberichte](https://github.com/ruyisdk/ruyisdk-vscode-extension)
- [RuyiSDK-Website](/de/)
