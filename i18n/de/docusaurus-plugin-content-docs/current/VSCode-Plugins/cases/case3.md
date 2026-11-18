---
sidebar_position: 3
---

# LED auf dem Milk-V Duo (256M) mit RuyiSDK Examples blinken lassen

Diese Anleitung zeigt, wie Sie das Beispiel **Blink** in der Erweiterung finden, die benötigten Pakete installieren, die Quellen entpacken und die LED auf dem Board zum Blinken bringen.

## Voraussetzungen

- Installieren Sie die RuyiSDK-Erweiterung aus dem VS Code Marketplace.
- Stellen Sie eine Internetverbindung für RuyiSDK Examples her.
- Starten Sie ein Milk-V Duo (256M). Folgen Sie bei Bedarf der [offiziellen Milk-V-Duo-Dokumentation](https://milkv.io/docs/duo/getting-started/boot).
- Verbinden Sie Board und Host mit demselben Netzwerk. Die Standard-IP-Adresse des Boards lautet `192.168.42.1`.

## Vorgehen

### 1. Das Beispiel Blink finden

1. Drücken Sie in VS Code `Ctrl+Shift+P`, geben Sie `ruyi home` ein und wählen Sie **Ruyi: Open Home**.
2. Wählen Sie auf der Karte **RuyiSDK Examples** die Schaltfläche **Open RuyiSDK Examples**.

   ![Ansicht RuyiSDK Examples](@site/docs/VSCode-Plugins/cases/images/case3-examples-panel.png)

3. Wählen Sie in der Liste **Milk-V Duo (256M)** mit der Kennzeichnung SG2002 · Sophgo · Milk-V.

   ![Eintrag für Milk-V Duo (256M)](@site/docs/VSCode-Plugins/cases/images/case3-board-entry.png)

4. Wählen Sie **Blink**, um die Anleitung zum Beispiel zu lesen.

> Sie können die Ansicht auch mit `ruyi.board-docs` über die Befehlspalette öffnen.

### 2. Toolchain installieren

1. Klicken Sie in der Seitenleiste auf das **Ruyi**-Symbol, um die Startseite der Erweiterung zu öffnen.
2. Suchen und installieren Sie `gnu-plct` in **Packages**.

   ![Installation der Toolchain gnu-plct](@site/docs/VSCode-Plugins/cases/images/case3-install-toolchain.png)

### 3. Virtuelle Umgebung anlegen

1. Klicken Sie in **Virtual Environments** auf `+`:

   ![Virtuelle Umgebung anlegen](@site/docs/VSCode-Plugins/cases/images/case3-create-venv.png)

   - Wählen Sie das Profil `manual`.
   - Wählen Sie die installierte Toolchain `gnu-plct`.
   - Wählen Sie bei Bedarf einen Emulator.
   - Geben Sie Name und Pfad an. Legen Sie die Umgebung an und klicken Sie auf ihren Namen, um sie zu aktivieren.

### 4. Beispielquellen entpacken

1. Klicken Sie im Explorer mit der rechten Maustaste auf das Arbeitsverzeichnis und wählen Sie **Extract RuyiSDK Package**.
2. Wählen Sie `milkv-duo-examples`, um das Paket ins aktuelle Verzeichnis zu entpacken.

   ![Menüeintrag Extract RuyiSDK Package](@site/docs/VSCode-Plugins/cases/images/case3-extract-package.png)

### 5. Blink-Programm bauen

1. Öffnen Sie das VS-Code-Terminal und aktivieren Sie die Umgebung in **Virtual Environments**. Dadurch steht die Toolchain im `PATH` des Terminals zur Verfügung. Wechseln Sie ins Unterverzeichnis `blink`:

   ```bash
   cd blink
   ```

2. Verwenden Sie die Toolchain der virtuellen Umgebung:

   ```bash
   riscv64-plct-linux-gnu-gcc blink.c -o blink \
       -I../include/system \
       -L../libs/system/musl_riscv64 \
       -lwiringx
   ```

   Alternativ können Sie die Einstellungen an das Makefile des Projekts übergeben:

   ```bash
   make TOOLCHAIN_PREFIX=riscv64-plct-linux-gnu- \
        CFLAGS="-I../include/system" \
        LDFLAGS="-L../libs/system/musl_riscv64 -lwiringx"
   ```

3. Prüfen Sie die erzeugte Binärdatei:

   ```bash
   file blink
   ```

   ![Ausgabe nach erfolgreichem Build](@site/docs/VSCode-Plugins/cases/images/case3-compile-success.png)

### 6. Programm übertragen und ausführen

1. Kopieren Sie das Programm auf das Board:

   ```bash
   scp blink root@192.168.42.1:/root/
   ```

2. Verbinden Sie sich per SSH. Standardmäßig lautet der Benutzername `root` und das Passwort `milkv`:

   ```bash
   ssh root@192.168.42.1
   ```

3. Deaktivieren Sie das Blink-Skript des Systems, damit es dem Beispiel nicht in die Quere kommt:

   ```bash
   mv /mnt/system/blink.sh /mnt/system/blink.sh_backup && sync
   reboot
   ```

4. Melden Sie sich nach dem Neustart erneut an und starten Sie das Programm:

   ```bash
   ssh root@192.168.42.1
   ./blink
   ```

5. Das Terminal gibt den LED-Zustand aus, während die blaue LED auf dem Board blinkt:

   ```
   Duo LED GPIO (wiringX) 25: High
   Duo LED GPIO (wiringX) 25: Low
   Duo LED GPIO (wiringX) 25: High
   Duo LED GPIO (wiringX) 25: Low
   ...
   ```

6. Drücken Sie `Ctrl+C`, um das Programm zu beenden.

### 7. Ursprüngliche LED-Funktion wiederherstellen

Stellen Sie nach dem Test das ursprüngliche Blink-Skript wieder her:

```bash
ssh root@192.168.42.1
mv /mnt/system/blink.sh_backup /mnt/system/blink.sh && sync
reboot
```

## Hinweise

- Dieses Beispiel verwendet das Milk-V Duo (256M) mit SG2002. Das Milk-V Duo (64M) verwendet einen CV1800B.
- Wenn Sie Hilfe von Copilot möchten, wählen Sie im Beispiel oben rechts die blaue Schaltfläche **Open in VS Code**. Der Inhalt wird in Copilot Chat übernommen.
- Ohne Board können Sie beim Anlegen der virtuellen Umgebung einen passenden QEMU-Emulator auswählen und ihn im Terminal starten.
