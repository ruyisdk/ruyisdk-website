---
sidebar_position: 1
---

# Übersicht

## Einführung

Die RuyiSDK-IDE ist eine grafische Entwicklungsumgebung für RISC-V auf Basis des quelloffenen Eclipse Embedded CDT. Sie übernimmt die Unterstützung von Eclipse für eingebettete Systeme und soll nach und nach die SDKs gängiger RISC-V-Entwicklungsboards integrieren.

## Download

[RuyiSDK-IDE herunterladen](https://fast-mirror.isrc.ac.cn/ruyisdk/ide/0.0.3/). Lassen Sie den abschließenden Schrägstrich in der Adresse stehen.

Wählen Sie das Archiv für Ihre Architektur: x86_64, aarch64 oder riscv64. Die IDE enthält eine Java-Laufzeitumgebung (JRE). Eine separate Java-Installation ist nicht nötig.

## IDE starten

1. Entpacken Sie das tar.gz-Archiv und doppelklicken Sie im Ordner `ruyisdk` auf `ruyisdk`.

![Startdatei der RuyiSDK-IDE](@site/docs/IDE/image/ruyisdk-ide-startup-0-download-logo.jpg)

2. Wählen Sie einen Ordner als Arbeitsbereich (Workspace). Beim ersten Start können Sie einen neuen Ordner wählen. Um an bestehenden Projekten weiterzuarbeiten, geben Sie den Pfad des bisherigen Arbeitsbereichs an.

![Arbeitsbereich auswählen](@site/docs/IDE/image/ruyisdk-ide-startup-1-workspace-configuration.jpg)

3. Klicken Sie auf **Launch**, um die IDE zu öffnen.

![Startansicht der RuyiSDK-IDE](@site/docs/IDE/image/ruyisdk-ide-startup-2-main-ui.jpg)

## Plug-in installieren

Um alle RuyiSDK-Funktionen zu nutzen, installieren Sie das RuyiSDK-IDE-Plug-in. Die Installation ist online oder aus einem ZIP-Archiv möglich.

### Online installieren (empfohlen)

Öffnen Sie **Help → Install New Software...**. Klicken Sie auf **Add...**, tragen Sie die folgenden Werte ein und klicken Sie auf **Add**:

- Name: `RuyiSDK Updates (GitHub)`
- Location: `https://ruyisdk.github.io/ruyisdk-eclipse-plugins/`

![RuyiSDK-Update-Site hinzufügen](@site/docs/IDE/image/ruyisdk-ide-eclipse-update-site-online-0-add-repository.jpg)

Sobald die Liste geladen ist, wählen Sie **RuyiSDK IDE** und klicken auf **Next >**, um das Plug-in zu installieren.

![RuyiSDK IDE zur Installation auswählen](@site/docs/IDE/image/ruyisdk-ide-eclipse-update-site-online-1-select-feature.jpg)

Über **Help → Check for Updates** können Sie das Plug-in später aktualisieren.

### Offline installieren

Bei eingeschränktem Netzwerkzugang laden Sie `ruyisdk-eclipse-plugins-<Version>.zip` aus den [GitHub-Releases](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/latest) herunter. Die Abbildungen zeigen Version 0.1.4.

![ZIP-Archiv des Plug-ins herunterladen](@site/docs/IDE/image/ruyisdk-ide-eclipse-update-site-offline-0-download-zip.jpg)

Öffnen Sie **Help → Install New Software...**. Klicken Sie auf **Add...**, wählen Sie über **Archive...** die ZIP-Datei und klicken Sie auf **Add**.

![Heruntergeladenes ZIP-Archiv auswählen](@site/docs/IDE/image/ruyisdk-ide-eclipse-update-site-offline-1-select-zip.jpg)

Wählen Sie **RuyiSDK IDE** und klicken Sie auf **Next >**, um das Plug-in zu installieren.

![RuyiSDK IDE aus dem Archiv installieren](@site/docs/IDE/image/ruyisdk-ide-eclipse-update-site-offline-2-select-feature.jpg)

Laden Sie für ein Update das aktuelle ZIP-Archiv herunter und wiederholen Sie diese Schritte.

## Beispiel

- [Hello World für Sipeed Lichee Pi 4A bauen und debuggen](./cases/sipeed-lpi4a-ide-hello-world.md)

Die Dokumentation zur RuyiSDK-IDE verwendet Ubuntu 22.04 LTS auf x86_64 als Beispiel. Wenn Sie mit einer anderen Ubuntu-Version oder Distribution auf Probleme stoßen, teilen Sie Screenshots und Fehlermeldungen in der [RISC-V-Entwicklercommunity](https://ruyisdk.cn/) oder im [Issue-Tracker](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/issues).

## Aktualisieren

Nach einem Update der IDE oder des RuyiSDK-Plug-ins können Sie im vorhandenen Arbeitsbereich weiterarbeiten. Die Dokumentation wird mit der IDE weiterentwickelt. Verwenden Sie die aktuelle Version, um Fehlerkorrekturen und neue Funktionen zu erhalten.
