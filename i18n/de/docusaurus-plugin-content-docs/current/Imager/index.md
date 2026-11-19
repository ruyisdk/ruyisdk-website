---
sidebar_position: 1
title: Ruyi Imager
sidebar_label: Ruyi Imager
description: Mit Ruyi Imager ein Betriebssystem auf RISC-V-Entwicklungsboards installieren.
---

Ruyi Imager ist ein grafisches Werkzeug zum Schreiben von Systemabbildern für RISC-V-Entwicklungsboards.

## Installation

Laden Sie das zu Ihrem Betriebssystem und Ihrer Prozessorarchitektur passende Installationspaket von [GitHub Releases](https://github.com/ruyisdk/ruyi-imager/releases/latest) herunter.

| Betriebssystem | Prozessorarchitektur     | Installationspaket |
|----------------|--------------------------|--------------------|
| Windows        | x86_64                   | `.exe`-Installer   |
| Linux          | x86_64, aarch64, riscv64  | `.deb` oder `.tar.gz` |
| macOS          | aarch64, x86_64          | `.tar.gz`          |

Unter Windows können Sie den `.exe`-Installer ausführen. Unter Debian oder Ubuntu können Sie das `.deb`-Paket installieren.

## Ein Systemabbild schreiben

1. Wählen Sie Ihr Entwicklungsboard und das Betriebssystem aus oder öffnen Sie eine lokale Abbilddatei.
2. Schließen Sie die Speicherkarte oder das Entwicklungsboard an und wählen Sie das Zielgerät. Beachten Sie die Anschlussanweisungen des Boards.
3. Prüfen Sie Abbild und Zielgerät und starten Sie den Schreibvorgang. Starten Sie das System anschließend gemäß der Board-Dokumentation.

:::warning
Der Schreibvorgang überschreibt Daten auf dem Zielgerät. Sichern Sie Ihre Daten und prüfen Sie das Zielgerät sorgfältig. Trennen Sie die Verbindung erst, wenn der Schreibvorgang abgeschlossen ist.
:::

## Weitere Ressourcen

- [Quellcode und Fehlermeldungen](https://github.com/ruyisdk/ruyi-imager)
- [Downloads](https://github.com/ruyisdk/ruyi-imager/releases/latest)
