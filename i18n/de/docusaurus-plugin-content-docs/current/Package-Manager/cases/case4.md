---
sidebar_position: 4
---

# Fastboot-Methode zum Flashen des Entwicklungsboards (am Beispiel von Licheepi 4A)

Derzeit bietet der RuyiSDK-Paketmanager eine einfachere Methode zur Installation des Betriebssystems. Durch die folgenden Schritte und die entsprechende Anleitung kann die Installation abgeschlossen werden.

## Umgebung

Dieser Artikel basiert auf der folgenden Umgebung:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

## Board mit dem Host verbinden

Licheepi 4A unterstützt das Booten vom onboard eMMC oder von der SD-Karte. Das Flashen kann auf zwei verschiedene Arten erfolgen:

1. Verbinden Sie das Board per USB mit dem PC und flashen Sie es mit `fastboot`.
2. Schließen Sie die SD-Karte per Kartenleser an den PC an, schreiben Sie das Abbild mit `dd` darauf und setzen Sie die Karte in das Board ein.

In diesem Beispiel wird die erste Methode verwendet. Diese Flashing-Methode ist auch für das Flashen von Images auf das onboard eMMC des MilkV Meles geeignet.

:::info Systemkonfiguration für `fastboot`

`ruyi` fragt erst nach einem fehlgeschlagenen Befehl, ob es diesen mit `sudo` ausführen soll. `fastboot flash` wartet jedoch unbegrenzt, wenn es kein Gerät erkennt. Deshalb fordert Ruyi Sie vor dem Flashen dazu auf, die Ausgabe von `fastboot devices` zu prüfen:

```text
Some flashing steps require the use of fastboot, in which case you should
ensure the target device is showing up in fastboot devices output.
Please confirm it yourself before the flashing begins.

Is the device identified by fastboot now? (y/N)
```

Führen Sie `fastboot devices` in einem zweiten Terminal aus und antworten Sie erst mit `y`, wenn das Gerät erkannt wird. Andernfalls kann der Flash-Vorgang hängen bleiben.

Ruyi richtet die benötigten `udev`-Regeln nicht ein, da sie von der Distribution und der Systemkonfiguration abhängen. Führen Sie `ruyi` aus Sicherheitsgründen nicht als `root` aus. Passen Sie das folgende Beispiel bei Bedarf an und beachten Sie die Dokumentation Ihrer Distribution.
:::

Licheepi 4A wird über ein USB-Kabel mit dem PC verbunden und über fastboot geflasht. Wenn Sie den Flashing-Prozess nur mit einem normalen Benutzer durchführen möchten, müssen möglicherweise udev-Regeln konfiguriert werden. Hier finden Sie ein Beispiel für eine Regel, die nur als Referenz dient:

```udev
SUBSYSTEM=="usb", ATTR{idVendor}="2345", ATTR{idProduct}=="7654", MODE="0666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}="1234", ATTR{idProduct}=="8888", MODE="0666", GROUP="plugdev"
```

Prüfen Sie anschließend mit `fastboot devices`, ob das Board erkannt wird. Die Ausgabe sollte eine Zeile wie `0123456789abcdef fastboot` enthalten.

## Betriebssystem flashen

Stellen Sie sicher, dass der RuyiSDK-Paketmanager installiert ist und dass `ruyi -V` korrekt die Versionsinformationen ausgibt, bevor Sie fortfahren.

Der RuyiSDK-Paketmanager bietet die Funktion, Betriebssysteme auf RISC-V-Entwicklungsboards zu installieren. Um ein Image auf ein RISC-V-Entwicklungsboard zu installieren, führen Sie einfach den folgenden Befehl aus:

```bash input="1"
$ ruyi device provision
```

Dieser Befehl gibt die derzeit unterstützten RISC-V-Entwicklungsboards zurück. Nach der Auswahl des Entwicklungsboards werden alle unterstützten Betriebssysteme für das ausgewählte Board angezeigt:

```text
RuyiSDK Device Provisioning Wizard

This is a wizard intended to help you install a system on your device for your
development pleasure, all with ease.

You will be asked some questions that help RuyiSDK understand your device and
your intended configuration, then packages will be downloaded and flashed onto
the device's storage, that you should somehow make available on this host
system beforehand.

Note that, as Ruyi does not run as root, but raw disk access is most likely
required to flash images, you should arrange to allow your user account sudo
access to necessary commands such as dd. Flashing will fail if the sudo
configuration does not allow so.

Continue? (y/N) y

The following devices are currently supported by the wizard. Please pick your device:

1. Allwinner Nezha D1
2. Canaan Kendryte K230
3. Milk-V Duo
4. Milk-V Pioneer Box
5. SiFive HiFive Unmatched
6. Sipeed Lichee RV
7. Sipeed LicheePi 4A
8. StarFive VisionFive
9. StarFive VisionFive2

Choice? (1-9)

```

Im obigen Beispiel, wenn Sie ein Image auf das Sipeed LicheePi 4A installieren möchten, geben Sie einfach die entsprechende Nummer ein: `7`


```text
Choice? (1-9) 7

The device has the following variants. Please choose the one corresponding to your hardware at hand:

  1. Sipeed LicheePi 4A (8G RAM)
  2. Sipeed LicheePi 4A (16G RAM)

Choice? (1-2) 2

The following system configurations are supported by the device variant you have chosen. Please pick the one you want
to put on the device:

  1. openEuler RISC-V (headless) for Sipeed LicheePi 4A (16G RAM)
  2. openEuler RISC-V (XFCE) for Sipeed LicheePi 4A (16G RAM)
  3. RevyOS for Sipeed LicheePi 4A (16G RAM)

Choice? (1-3) 3

We are about to download and install the following packages for your device:

 * board-image/revyos-sipeed-lpi4a
 * board-image/uboot-revyos-sipeed-lpi4a-16g

Proceed? (y/N)

```

Sie müssen lediglich den Anweisungen des Assistenten folgen.
