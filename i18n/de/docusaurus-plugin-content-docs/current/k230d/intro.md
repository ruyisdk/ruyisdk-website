import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Canaan K230D Benutzerhandbuch

## Systemabbildinstallation

### Direkter Download und Installation

RuyiSDK bietet derzeit zwei Abbilddateien an: LP64 und ILP32. Diese können über RuyiSDK heruntergeladen und installiert werden. Die spezifischen Schritte sind wie folgt:

1. Stellen Sie sicher, dass Sie `ruyi` heruntergeladen und installiert haben. Bitte lesen Sie die [RuyiSDK-Paketmanager-Installationsanleitung](https://ruyisdk.org/docs/Package-Manager/installation) (es wird empfohlen, die neueste Version herunterzuladen). Nach der Installation können Sie `ruyi --version` ausführen, um die Versionsinformationen zu überprüfen.
2. Führen Sie `ruyi update` aus, um die RuyiSDK-Softwarequelle zu aktualisieren. Dieser Vorgang aktualisiert die neuesten Softwarepakete und Ressourcenindizes der Softwarequelle lokal, um sicherzustellen, dass nachfolgende Abfragen und Installationen die neuesten Informationen erhalten.
3. Führen Sie `ruyi device provision` aus, um den Systemabbild-Installationsassistenten zu starten. Folgen Sie den Anweisungen, wählen Sie das Entwicklungsboard `Canaan Kendryte K230D`, die Spezifikationen des Entwicklungsboards, den Abbilddateityp usw. Der Assistent führt Sie durch den Abbrennprozess des Abbilds.

   Derzeit bietet RuyiSDK für K230D RV64ILP32 (Xuantie neuer 32-Bit-Kernel + 32-Bit-rootfs) und RV64LP64 (konventionelles 64-Bit-System) an. Es wird empfohlen, das RV64ILP32-System zu installieren, um die Vorteile des neuen 32-Bit-Systems in Bezug auf den dynamischen Speicherverbrauch zu erleben.

<<<<<<< HEAD
<<<<<<< HEAD
   <CodeBlock lang="bash" code={

   `   The following system configurations are supported by the device variant you have chosen. 

      Please pick the one you want to put on the device:

   

        1. Canaan Kendryte K230D CanMV Linux SDK demo, RV64ILP32 ABI

        2. Canaan Kendryte K230D CanMV Linux SDK demo, RV64LP64 ABI`

   } />
=======
=======
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf
   <CodeBlock lang="bash" code={`   The following system configurations are supported by the device variant you have chosen. 
   Please pick the one you want to put on the device:

     1. Canaan Kendryte K230D CanMV Linux SDK demo, RV64ILP32 ABI
     2. Canaan Kendryte K230D CanMV Linux SDK demo, RV64LP64 ABI`} />
<<<<<<< HEAD
>>>>>>> 7803df1 (Update de codeblocks)
=======
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf

### Quellcode-Kompilierung

> Hinweis: `k230d_canmv_ilp32_defconfig` erfordert Ubuntu 22.04 oder 24.04 und die Installation der rv64ilp32-Toolchain. Daher sollte die Quellcode-Kompilierung in einer Ubuntu 22.04- oder Ubuntu 24.04-Umgebung durchgeführt werden.

Die RuyiSDK-Adresse für K230D lautet: https://github.com/ruyisdk/k230_linux_sdk

Das K230D SDK bietet eine [Kompilierungsanleitung](https://github.com/ruyisdk/k230_linux_sdk/blob/dev/README_zh.md) für das Abbild. Nach der Kompilierung befinden sich die Abbilddateien im Verzeichnis `output`. Je nach ausgeführtem defconfig werden sie in den folgenden Pfaden gespeichert:

<<<<<<< HEAD
<<<<<<< HEAD
<CodeBlock lang="bash" code={

`# 64ILP32

=======
<CodeBlock lang="bash" code={`# 64ILP32
>>>>>>> 7803df1 (Update de codeblocks)
=======
<CodeBlock lang="bash" code={`# 64ILP32
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf
output/k230d_canmv_ilp32_defconfig/images/sysimage-sdcard.img



# 64LP64
<<<<<<< HEAD
<<<<<<< HEAD

output/k230d_canmv_lp64_defconfig/images/sysimage-sdcard.img`

} />

Nach der Kompilierung entpacken Sie die Datei und brennen sie auf eine TF-Karte. Stecken Sie die TF-Karte in das Gerät und schalten Sie das Gerät ein, um es zu verwenden.

<CodeBlock lang="bash" code={

`# Angenommen, /dev/sdb ist der Geräteknoten der TF-Karte, führen Sie den folgenden Befehl aus, um die TF-Karte zu brennen:



sudo dd if=sysimage-sdcard.img of=/dev/sdb bs=1M oflag=sync`

} />
=======
output/k230d_canmv_lp64_defconfig/images/sysimage-sdcard.img`} />

Nach der Kompilierung entpacken Sie die Datei und brennen sie auf eine TF-Karte. Stecken Sie die TF-Karte in das Gerät und schalten Sie das Gerät ein, um es zu verwenden.

<CodeBlock lang="bash" code={`# Angenommen, /dev/sdb ist der Geräteknoten der TF-Karte, führen Sie den folgenden Befehl aus, um die TF-Karte zu brennen:

sudo dd if=sysimage-sdcard.img of=/dev/sdb bs=1M oflag=sync`} />
>>>>>>> 7803df1 (Update de codeblocks)
=======
output/k230d_canmv_lp64_defconfig/images/sysimage-sdcard.img`} />

Nach der Kompilierung entpacken Sie die Datei und brennen sie auf eine TF-Karte. Stecken Sie die TF-Karte in das Gerät und schalten Sie das Gerät ein, um es zu verwenden.

<CodeBlock lang="bash" code={`# Angenommen, /dev/sdb ist der Geräteknoten der TF-Karte, führen Sie den folgenden Befehl aus, um die TF-Karte zu brennen:

sudo dd if=sysimage-sdcard.img of=/dev/sdb bs=1M oflag=sync`} />
>>>>>>> 7803df14c8e9d3d8cd0d62575fe9f8861bbbd7bf

## Start

Das System startet automatisch, wenn das Gerät eingeschaltet wird. Wenn die rote LED auf dem Entwicklungsboard leuchtet, bedeutet dies, dass das Entwicklungsboard ordnungsgemäß eingeschaltet ist. Das root-Konto hat standardmäßig kein Passwort. Zu diesem Zeitpunkt können Sie die seriellen Port-Informationen überprüfen.

Wenn das Entwicklungsboard mit einem Bildschirm verbunden ist, wird nach kurzer Zeit automatisch die LVGL-DEMO ausgeführt, um die Ressourcennutzung anzuzeigen. Die DEMO enthält auch Touch-Interaktionen.