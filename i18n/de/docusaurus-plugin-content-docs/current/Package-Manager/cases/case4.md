---
sidebar_position: 4
---

import CodeBlock from '@site/src/components/common/docs_utils/CodeBlock';

# Fastboot-Methode zum Flashen des Entwicklungsboards (am Beispiel von Licheepi 4A)

Derzeit bietet der ruyi-Paketmanager eine einfachere Methode zur Installation des Betriebssystems. Durch die folgenden Schritte und die entsprechende Anleitung kann die Installation abgeschlossen werden.

## Umgebung

Dieser Artikel basiert auf der folgenden Umgebung:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

#### Weitere Hinweise

Licheepi 4A unterstützt das Booten vom onboard eMMC oder von der SD-Karte. Das Flashen kann auf zwei verschiedene Arten erfolgen:

1. Das RISC-V-Entwicklungsboard wird über ein USB-Kabel mit dem PC verbunden.
2. Die SD-Karte des RISC-V-Entwicklungsboards wird über einen Kartenleser mit dem PC verbunden.

In diesem Beispiel wird die erste Methode verwendet. Diese Flashing-Methode ist auch für das Flashen von Images auf das onboard eMMC des MilkV Meles geeignet.

Wenn das Flashen des Images mit einem normalen Benutzer fehlschlägt, versucht ruyi, die Berechtigungen mit ``sudo`` zu erhöhen.

Licheepi 4A wird über ein USB-Kabel mit dem PC verbunden und über fastboot geflasht. Wenn Sie den Flashing-Prozess nur mit einem normalen Benutzer durchführen möchten, müssen möglicherweise udev-Regeln konfiguriert werden. Hier finden Sie ein Beispiel für eine Regel, die nur als Referenz dient:

<CodeBlock lang="99-custom.rules" code={`
SUBSYSTEM=="usb", ATTR{idVendor}="2345", ATTR{idProduct}=="7654", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}="1234", ATTR{idProduct}=="8888", MODE="0666", GROUP="plugdev"
`} />

## Betriebssysteminstallation

Stellen Sie sicher, dass der ruyi-Paketmanager installiert ist und dass `ruyi -V` korrekt die Versionsinformationen ausgibt, bevor Sie fortfahren.

Der ruyi-Paketmanager bietet die Funktion, Betriebssysteme auf RISC-V-Entwicklungsboards zu installieren. Um ein Image auf ein RISC-V-Entwicklungsboard zu installieren, führen Sie einfach den folgenden Befehl aus:

<CodeBlock lang="bash" code={`
ruyi device provision
`} />

Dieser Befehl gibt die derzeit unterstützten RISC-V-Entwicklungsboards zurück. Nach der Auswahl des Entwicklungsboards werden alle unterstützten Betriebssysteme für das ausgewählte Board angezeigt:

<CodeBlock lang="bash" code={`
RuyiSDK Device Provisioning Wizard

Dieser Assistent soll Ihnen helfen, ein System auf Ihrem Gerät für Ihre Entwicklungszwecke zu installieren, und das alles mit Leichtigkeit.

Es werden einige Fragen gestellt, die RuyiSDK helfen, Ihr Gerät und Ihre gewünschte Konfiguration zu verstehen. Anschließend werden Pakete heruntergeladen und auf den Speicher des Geräts geflasht, den Sie zuvor auf diesem Hostsystem verfügbar machen sollten.

$ Beachten Sie, dass Ruyi nicht als root ausgeführt wird, aber der Zugriff auf Rohdatenträger höchstwahrscheinlich erforderlich ist, um Images zu flashen. Sie sollten daher sicherstellen, dass Ihr Benutzerkonto sudo-Zugriff auf notwendige Befehle wie dd hat. Das Flashen schlägt fehl, wenn die sudo-Konfiguration dies nicht zulässt.

Fortfahren? (y/N) y

Die folgenden Geräte werden derzeit vom Assistenten unterstützt. Bitte wählen Sie Ihr Gerät aus:

1. Allwinner Nezha D1
2. Canaan Kendryte K230
3. Milk-V Duo
4. Milk-V Pioneer Box
5. SiFive HiFive Unmatched
6. Sipeed Lichee RV
7. Sipeed LicheePi 4A
8. StarFive VisionFive
9. StarFive VisionFive2

Auswahl? (1-9)

`} />

Im obigen Beispiel, wenn Sie ein Image auf das Sipeed LicheePi 4A installieren möchten, geben Sie einfach die entsprechende Nummer ein: `7`


<CodeBlock lang="bash" code={`
Auswahl? (1-9) 7

Das Gerät hat die folgenden Varianten. Bitte wählen Sie diejenige aus, die Ihrer Hardware entspricht:

  1. Sipeed LicheePi 4A (8G RAM)
  2. Sipeed LicheePi 4A (16G RAM)

Auswahl? (1-2) 2

Die folgenden Systemkonfigurationen werden von der ausgewählten Gerätevariante unterstützt. Bitte wählen Sie diejenige aus, die Sie auf dem Gerät installieren möchten:

  1. openEuler RISC-V (headless) für Sipeed LicheePi 4A (16G RAM)
  2. openEuler RISC-V (XFCE) für Sipeed LicheePi 4A (16G RAM)
  3. RevyOS für Sipeed LicheePi 4A (16G RAM)

Auswahl? (1-3) 3

Wir sind dabei, die folgenden Pakete für Ihr Gerät herunterzuladen und zu installieren:

 * board-image/revyos-sipeed-lpi4a
 * board-image/uboot-revyos-sipeed-lpi4a-16g

Fortfahren? (y/N)

`} />

Sie müssen lediglich den Anweisungen des Assistenten folgen.
