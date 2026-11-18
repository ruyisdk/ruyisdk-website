# Hello World für Sipeed Lichee Pi 4A mit der RuyiSDK-IDE bauen und debuggen

## Testumgebung

- Betriebssystem: Ubuntu 24.04 x86_64
- IDE: Eclipse IDE for Embedded C/C++ Developers 2026-06 (4.40.0)

## RuyiSDK-Paketmanager in der IDE installieren

Starten Sie die IDE und öffnen Sie im Menü **RuyiSDK** den Eintrag **Ruyi Installation**. Folgen Sie dem Installationsassistenten. Starten Sie anschließend die IDE über **File → Restart** neu.

![Assistent zur Ruyi-Installation](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/ruyi-installation.jpg)

## Ein C/C++-Projekt anlegen

Öffnen Sie **File → New** und wählen Sie im Fenster **C/C++ Project** den Assistenten **Classic C++ Project**.

![Auswahl der Projektvorlage](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/new-project-0-templates.jpg)

Wählen Sie unter **Project type** den Eintrag **Executable → Hello World RISC-V C++ Project** und unter **Toolchains** den Eintrag **RISC-V Cross GCC**.

![Projekttyp und Toolchain](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/new-project-1-type-selection.jpg)

Leeren Sie auf der Seite **Basic Settings** das Feld **Linker other options**.

![Linker-Einstellungen](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/new-project-2-basic-settings.jpg)

Auf der Seite **GNU RISC-V Cross Toolchain** sind keine Einstellungen nötig. Klicken Sie auf **Finish**.

![Toolchain-Assistent abschließen](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/new-project-3-toolchain.jpg)

Das Projekt muss jetzt noch nicht gebaut werden.

## Virtuelle Umgebung für das Projekt anlegen

Klicken Sie im **Project Explorer** mit der rechten Maustaste auf das Projekt und wählen Sie **RuyiSDK → New Venv...**. Wählen Sie unter **Profiles** das Profil `sipeed-lpi4a` und unter **Toolchains** die neueste Version von `gnu-plct-xthead`. Aktivieren Sie **Enable** neben **Emulators** und wählen Sie die neueste Version von `qemu-user-riscv-xthead`. Klicken Sie auf **Finish** und warten Sie, bis die Umgebung angelegt ist.

![Einstellungen der virtuellen Umgebung](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/project-new-venv-conf.jpg)

## Virtuelle Umgebung anwenden und Projekt bauen

Klicken Sie im **Project Explorer** mit der rechten Maustaste auf das Projekt und wählen Sie **RuyiSDK → Apply Venv...**. Wählen Sie eine Umgebung aus und klicken Sie auf **OK**.

![Virtuelle Umgebung anwenden](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/project-apply-venv.jpg)

Merken Sie sich die Namen der Run- und Debug-Startkonfigurationen, die im Dialog angezeigt werden.

![Namen der Startkonfigurationen](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/venv-apply-info-dialog.jpg)

Klicken Sie im **Project Explorer** erneut mit der rechten Maustaste auf das Projekt und wählen Sie **Build Project**.

![Build des Projekts](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/project-building.jpg)

Nach erfolgreichem Build erhalten Sie eine ausführbare Datei mit der Endung `.elf`.

## Programm mit QEMU ausführen oder debuggen

### Ausführen

Öffnen Sie über den Pfeil neben der grünen Startschaltfläche **Run Configurations...**. Klappen Sie links **C/C++ Application** auf und wählen Sie den Eintrag für Ihr Projekt und Ihre virtuelle Umgebung. Klicken Sie auf **Run**.

![Ausgabe des ausgeführten Programms](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/toolbar-run-configuration-result.jpg)

Das Programm wird erfolgreich ausgeführt.

### Debuggen

Öffnen Sie über den Pfeil neben dem grünen Käfersymbol **Debug Configurations...**. Klappen Sie **C/C++ Remote Application** auf und wählen Sie den Eintrag für Ihr Projekt und Ihre virtuelle Umgebung. Klicken Sie auf **Debug**.

![Debug-Konfiguration](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/toolbar-debug-configuration.jpg)

![Programm im Debugger](@site/docs/IDE/cases/image/sipeed-lpi4a-ide-hello-world/debug-in-progress.jpg)

Im Debugger sehen Sie unter anderem Threads, Stackframes und Datentypen.
