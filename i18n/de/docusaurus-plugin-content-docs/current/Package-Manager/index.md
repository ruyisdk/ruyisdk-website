---
sidebar_position: 1
---

# Funktionsübersicht

Der ruyi Paketmanager bietet hauptsächlich die folgenden Funktionen.

## Befehlsabfrage

| Befehl                                                                                         | Bedeutung                     | Hinweise                                |
| -------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------- |
| `ruyi update`                                                                                | Aktualisiert den Paket-Cache und verwendet das Standard-Image.             | Der Paket-Cache wird im Benutzerverzeichnis gespeichert, normalerweise unter `~/.cache/ruyi`. |
| `ruyi news list -h`                                                                          | Zeigt die Hilfeseite für den Nachrichtenbefehl an.                |                                     |
| `ruyi news list`                                                                             | Listet alle Nachrichten auf.                     |                                     |
| `ruyi news list --new`                                                                       | Listet nur ungelesene Nachrichten auf.                    |                                     |
| `ruyi news read -h`                                                                          | Zeigt die Hilfeseite für den Nachrichtenlesebefehl an.              |                                     |
| `ruyi news read 1`                                                                           | Liest die Nachricht mit der spezifischen Nummer.                  | 1 ist die Nummer oder ID des zu lesenden Nachrichtenartikels.                 |
| `ruyi news read`                                                                             | Liest die nächste Nachricht.                    |                                     |
| `ruyi news read --quiet`                                                                     | Markiert die Nachricht als gelesen, ohne Informationen auszugeben.            | Gibt nichts aus, sondern markiert nur als gelesen.                     |
| `ruyi list`                                                                                  | Listet alle verfügbaren Pakete auf.                  |                                     |
| `ruyi list -v`                                                                               | Listet detaillierte Informationen zu allen Paketen auf.               |                                     |
| `ruyi list profiles`                                                                         | Zeigt die vordefinierten Konfigurationen für virtuelle Umgebungen an.                |                     |
| `ruyi install gnu-upstream`                                                                  | Installiert die neueste GNU Upstream-Toolchain.            | Standardmäßig wird die neueste Version von gnu-upstream installiert.             |
| `ruyi install 'gnu-upstream(0.20231118.0)'`                                                  | Installiert die angegebene Version der GNU Upstream-Toolchain.          | Installiert eine ältere Version durch Angabe der Versionsnummer.                      |
| `ruyi install 'gnu-upstream(==0.20231118.0)'`                                                | Installiert eine spezifische Version der GNU Upstream-Toolchain.          | Das Versionsübereinstimmungsformat sollte `<op><ver>` sein.               |
| `ruyi install --reinstall gnu-upstream`                                                      | Installiert die GNU Upstream-Toolchain neu.             |                                     |
| `ruyi extract ruyisdk-demo`                                                                  | Lädt das ruyisdk-demo Quellpaket herunter und entpackt es.      | Entpackt in das aktuelle Verzeichnis.                            |
| `ruyi venv --toolchain gnu-upstream --emulator qemu-user-riscv-upstream generic ./ruyi_venv` | Erstellt eine virtuelle Umgebung mit der angegebenen Toolchain und dem Emulator im angegebenen Verzeichnis.      | Verwendet die vordefinierte generische Konfiguration.                   |
| `ruyi version`                                                                               | Zeigt die Version des ruyi Paketmanagers an.              |                                     |
| `ruyi self uninstall`                                                                        | Deinstalliert den ruyi Paketmanager.               | Der Befehl fragt nach einer Bestätigung.                          |
| `ruyi self uninstall -y`                                                                     | Deinstalliert den ruyi Paketmanager ohne Bestätigung.         | Wird ohne Bestätigung ausgeführt.                           |
| `ruyi self uninstall --purge`                                                                | Deinstalliert den ruyi Paketmanager vollständig, einschließlich Cache und installierter Pakete. | Beinhaltet Cache und installierte Pakete.                       |
| `ruyi self uninstall --purge -y`                                                             | Deinstalliert den ruyi Paketmanager vollständig ohne Bestätigung.         | Wird ohne Bestätigung ausgeführt.                           |
| `ruyi self clean`                                                                            | Löscht das Datenverzeichnis.                           | Es können Parameter angegeben werden, um anzugeben, welche Verzeichnisse gelöscht werden sollen.               |
| `ruyi device provision`                                                                      | Lädt das erforderliche System-Image herunter und installiert das System auf dem Gerät.          | Befolgt die Anleitung zur Systeminstallation.                         |

## Datenverzeichnis

+ ruyi Hauptprogramm ``/usr/local/bin/ruyi`` oder in einem anderen Verzeichnis, das im ``PATH`` enthalten ist
+ Benutzerkonfigurationsdatei ``~/.config/ruyi/config.toml``
+ Benutzer-Cache ``~/.cache/ruyi``
+ Benutzerdaten, einschließlich heruntergeladener und entpackter ruyi Pakete ``~/.local/share/ruyi``
+ Benutzerdatenstatus ``~/.local/state/ruyi``

Ruyi unterstützt die Konfiguration dieser Verzeichnisse mit XDG-Umgebungsvariablen.

## Mehr

Die Dokumentation des ruyi Paketmanagers kann im [Repository-Dokument](https://github.com/ruyisdk/ruyi) eingesehen werden (derzeit nur in Englisch verfügbar).