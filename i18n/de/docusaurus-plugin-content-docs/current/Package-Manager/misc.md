---
sidebar_position: 6
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Weitere Informationen

## Aktualisierung des Ruyi-Paketmanagers

Wenn Sie den vorcompilierten Einzelbinär-Installer für den Ruyi-Paketmanager verwenden, laden Sie einfach die neue Version der Binärdatei herunter und führen Sie den Installationsprozess erneut aus, um die alte Version der Ruyi-Paketmanager-Binärdatei zu überschreiben.

Wenn Sie den Ruyi-Paketmanager über den System-Paketmanager installiert haben, können Sie ihn direkt über den System-Paketmanager aktualisieren:

<CodeBlock lang="bash" code={`$ sudo pacman -Syuu`} />

Dieser Befehl führt ein umfassendes Upgrade auf Arch Linux durch. Beachten Sie, dass Arch Linux keine Teil-Upgrades unterstützt.

## Deinstallation des Ruyi-Paketmanagers

Wenn Sie den Ruyi-Paketmanager über den System-Paketmanager installiert haben, verwenden Sie bitte den System-Paketmanager zur Deinstallation.

Wenn Sie den vorcompilierten Einzelbinär-Installer für den Ruyi-Paketmanager verwenden, können Sie den Ruyi-Paketmanager mit dem folgenden Befehl deinstallieren:

<CodeBlock lang="bash" code={`$ ruyi self uninstall`} />

Dieser Befehl wird um eine zweite Bestätigung für diese Aktion bitten. Wenn Sie möchten, dass der Ruyi-Paketmanager nicht nachfragt und die Deinstallation direkt ausführt:

<CodeBlock lang="bash" code={`$ ruyi self uninstall -y`} />

Der obige Befehl entfernt nur den Ruyi-Paketmanager selbst. Wenn Sie alle Caches und installierten Pakete für eine saubere Deinstallation entfernen möchten:

<CodeBlock lang="bash" code={`$ ruyi self uninstall --purge`} />

Ebenso wird dieser Befehl um eine zweite Bestätigung für diese Aktion bitten. Wenn Sie möchten, dass der Ruyi-Paketmanager nicht nachfragt und die Deinstallation direkt ausführt:

<CodeBlock lang="bash" code={`$ ruyi self uninstall --purge -y`} />

Der Ruyi-Paketmanager wurde so konzipiert, dass er Operationen vermeidet, die Superuser-Rechte erfordern. Wenn der Ruyi-Paketmanager in einem Verzeichnis wie ``/usr/local/bin/`` installiert ist, das Superuser-Rechte für Änderungen benötigt, wird der Befehl ``ruyi self uninstall`` fehlschlagen.

In diesem Fall können Sie alle Caches und installierten Pakete manuell löschen (da sie im Home-Verzeichnis installiert sind, benötigen Sie keine Superuser-Rechte zum Löschen):

<CodeBlock lang="bash" code={`$ ruyi self clean --all`} />

Danach können Sie den Ruyi-Paketmanager manuell entfernen.

## Fehler melden

Bitte [ein Issue im Ruyi-Paketmanager-Repository](https://github.com/ruyisdk/ruyi/issues/new) erstellen.

## Telemetriedatensammlung

Der Ruyi-Paketmanager sammelt über die Telemetriedatensammelfunktion einige Betriebsdaten der Benutzer, während sie den Ruyi-Paketmanager verwenden, um uns zu helfen, das Benutzerverhalten besser zu verstehen und den Ruyi-Paketmanager zu verbessern. Sie können die Telemetriedatensammlung aktivieren oder deaktivieren, indem Sie die Umgebungsvariable `RUYI_TELEMETRY_OPTOUT` setzen. `1`, `true` oder `yes` bedeutet, dass die Telemetrie deaktiviert ist, was dem unten genannten `off` entspricht; standardmäßig ist die Telemetriedatensammlung aktiviert.

Es gibt drei Stufen der Telemetriedatensammlung:

- `local`: Telemetriedaten werden nur lokal gespeichert und ohne ausdrückliche Zustimmung des Benutzers nicht an einen Remote-Server gesendet.
- `on`: Telemetriedaten werden an einen Remote-Server gesendet.
- `off`: Deaktiviert die Telemetriedatensammlung.

Standardmäßig ist die Telemetriedatensammlung auf `on` eingestellt, was bedeutet, dass bei jedem `ruyi`-Aufruf einige nicht sensible Betriebsdaten und einige Statusinformationen von `ruyi` aufgezeichnet und wöchentlich an einen von `RuyiSDK` verwalteten Remote-Server in Festlandchina gesendet werden. Der Upload erfolgt an einem zufälligen Tag, bestimmt durch eine anonyme Installations-ID.

Sie können die Konfigurationsdatei von `ruyi` bearbeiten oder einfach über Umgebungsvariablen die Stufe der Telemetriedatensammlung festlegen.

Wir sammeln folgende Daten:

* Grundlegende Informationen über die ausgeführte Maschine:
    * Architektur und Betriebssystem
    * Wenn die Architektur RISC-V ist:
        * ISA-Fähigkeiten
        * Modell des Entwicklungsboards
        * Anzahl der logischen CPUs
    * OS-Release-ID (entspricht ungefähr dem Distributionstyp)
    * Typ und Version von libc
    * Typ der Shell (bash, fish, zsh usw.)
* Die Version von `ruyi` zum Zeitpunkt des Hochladens der Daten
* Verschiedene Aufrufmodi der `ruyi`-Unterbefehle:
    * Es werden keine Parameter offengelegt
    * Die Granularität der Aufrufzeit beträgt 1 Minute

Sie können unsere Datenschutzrichtlinie auf der offiziellen Website von RuyiSDK einsehen.