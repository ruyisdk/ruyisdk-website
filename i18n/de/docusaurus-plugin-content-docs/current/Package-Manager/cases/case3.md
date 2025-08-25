---
sidebar_position: 3
---

import CodeBlock from '@site/src/components/common/docs_utils/CodeBlock';

# dd-Methode zur Installation auf einem Entwicklungsboard (am Beispiel MilkV Duo)

Derzeit bietet der Ruyi-Paketmanager eine einfachere Möglichkeit zur Installation von Betriebssystemen, die durch die folgenden Schritte und entsprechenden Anleitungen abgeschlossen werden kann.

## Umgebung

Dieser Artikel basiert auf folgender Umgebung:
- Hardware: x86_64 PC
- Software: Ubuntu 22.04

#### Weitere Hinweise

Die meisten RISC-V-Entwicklungsboards unterstützen das Booten von Micro SD-Karten oder NVME SSDs und verwenden typischerweise das ``dd``-Tool, um das Abbild direkt auf das Laufwerk zu schreiben. ``ruyi device provision`` unterstützt diese Schreibweise.

Obwohl der Ruyi-Paketmanager so konzipiert ist, dass er keine Operationen ausführt, die Superuser-Rechte benötigen, ist das Schreiben auf das Laufwerk oft eine Berechtigung erforderlich. Daher wird der Ruyi-Paketmanager, wenn der Aufruf des ``dd``-Befehls durch einen normalen Benutzer fehlschlägt, versuchen, die Berechtigungen mit ``sudo`` zu erhöhen. In diesem Fall muss der Benutzer möglicherweise ein Passwort eingeben, das direkt von ``sudo`` gelesen wird und für den Ruyi-Paketmanager transparent ist.

Festplattabbilder beanspruchen nach dem Entpacken oft viel Speicherplatz. Vor der Verwendung des Ruyi-Paketmanagers zum Schreiben eines Abbildes sollte unbedingt genügend Speicherplatz vorhanden sein; einige vom Hersteller bereitgestellte Abbilder erweitern nach dem Schreiben nicht automatisch die Partitionen, um den gesamten Speicherplatz zu nutzen, sodass der Benutzer möglicherweise selbst die Partitionsgröße erweitern muss.

## Installation des Betriebssystems

Stellen Sie sicher, dass der Ruyi-Paketmanager installiert ist und dass der Test `ruyi -V` korrekt Versionsinformationen anzeigt, bevor Sie mit folgenden Schritten fortfahren.

Der Ruyi-Paketmanager bietet die Funktion, Betriebssysteme auf RISC-V-Entwicklungsboards zu installieren. Um ein Abbild für ein beliebiges Modell eines RISC-V-Entwicklungsboards zu installieren, muss lediglich ausgeführt werden:

<CodeBlock lang="bash" code={`
$ ruyi device provision
`} />

Dieser Befehl gibt die derzeit vom Tool unterstützten RISC-V-Entwicklungsboards zurück. Wählen Sie das Entwicklungsboard aus, um alle unterstützten Betriebssysteme für das angegebene Entwicklungsboard zu erhalten:

<CodeBlock lang="bash" code={`
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
  3. Canaan Kendryte K230D
  4. Canaan Kendryte K510
  5. Milk-V Duo
  6. Milk-V Duo S
  7. Milk-V Mars
  8. Milk-V Mars CM
  9. Milk-V Meles
  10. Milk-V Pioneer Box
  11. Milk-V Vega
  12. Pine64 Star64
  13. SiFive HiFive Unmatched
  14. Sipeed Lichee Cluster 4A
  15. Sipeed Lichee Console 4A
  16. Sipeed LicheePi 4A
  17. Sipeed Lichee RV
  18. Sipeed LicheeRV Nano
  19. Sipeed Maix-I
  20. Sipeed Tang Mega 138K Pro
  21. StarFive VisionFive
  22. StarFive VisionFive2
  23. WCH CH32V103 EVB
  24. WCH CH32V203 EVB
  25. WCH CH32V208 EVB
  26. WCH CH32V303 EVB
  27. WCH CH32V305 EVB
  28. WCH CH32V307 EVB
  29. WCH CH582F EVB
  30. WCH CH592X EVB

Choice? (1-30)
`} />

Die Ausgabe sollte der tatsächlichen Situation entsprechen. In diesem Beispiel hat MilkV Duo die Nummer 5.

<CodeBlock lang="bash" code={`
Choice? (1-30) 5

The device has the following variants. Please choose the one corresponding to your hardware at hand:

  1. Milk-V Duo (64M RAM)
  2. Milk-V Duo (256M RAM)

Choice? (1-2)
`} />

Beachten Sie, dass MilkV Duo zwei Versionen hat, die die SOCs CV1800B und SG2002 verwenden, wobei die Version mit SG2002 auch als Duo 256M bezeichnet wird.

Hier wählen wir als Beispiel die Version mit 64M RAM, also die Version mit SOC CV1800B.

<CodeBlock lang="bash" code={`
Choice? (1-2) 1

The following system configurations are supported by the device variant you have chosen. Please pick the one you want to put on the device:

  1. Milk-V Duo Official Arduino SDK (64M RAM, SD card)
  2. Milk-V Duo Official buildroot SDK (64M RAM, SD card)
  3. Milk-V Duo Official buildroot SDK (64M RAM, Lite, SD card)
`} />

Wählen Sie hier je nach Bedarf aus, als Beispiel wählen wir ``2``.

<CodeBlock lang="bash" code={`
Choice? (1-3) 2

We are about to download and install the following packages for your device:

 * board-image/buildroot-sdk-milkv-duo

Proceed? (y/N)
`} />

Ruyi wird darauf hinweisen, welche Pakete im Verzeichnis board-image heruntergeladen werden und fragen, ob fortgefahren werden soll. Geben Sie ``y`` ein, um fortzufahren.

Nach Abschluss des Downloads und der Entpackung werden Sie aufgefordert, den Pfad zum Laufwerk einzugeben:

<CodeBlock lang="bash" code={`
For initializing this target device, you should plug into this host system the
device's storage (e.g. SD card or NVMe SSD), or a removable disk to be
reformatted as a live medium, and note down the corresponding device file
path(s), e.g. /dev/sdX, /dev/nvmeXnY for whole disks; /dev/sdXY, /dev/nvmeXnYpZ
for partitions. You may consult e.g. sudo blkid output for the
information you will need later.

Please give the path for the target's whole disk:
`} />

Zu diesem Zeitpunkt können Sie das gewünschte Laufwerk anschließen, dessen Abbild Sie schreiben möchten, und den absoluten Pfad des Geräts eingeben und auf den Abschluss des Schreibvorgangs warten.
