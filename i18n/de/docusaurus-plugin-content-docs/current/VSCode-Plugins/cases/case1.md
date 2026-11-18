---
sidebar_position: 1
---

# CoreMark mit der Erweiterung bauen (LicheePi 4A)

Dieses Beispiel zeigt, wie Sie mit der Erweiterung eine Toolchain installieren, eine virtuelle Umgebung anlegen und CoreMark entpacken, bauen und ausführen. Weitere Informationen finden Sie unter [Mit der Ruyi-Toolchain bauen](/docs/Package-Manager/cases/case1).

## Vorgehen

1. Öffnen Sie VS Code und klicken Sie in der Seitenleiste auf das **Ruyi**-Symbol.
2. Installieren Sie `gnu-plct-xthead` in der Ansicht **Packages**.
3. Klicken Sie in **Virtual Environments** auf `+`:
   - Wählen Sie das Profil `sipeed-lpi4a`.
   - Wählen Sie die installierte Toolchain `gnu-plct-xthead`.
   - Wählen Sie bei Bedarf einen Emulator.
   - Geben Sie Name und Pfad an. Legen Sie die Umgebung an und klicken Sie auf ihren Namen, um sie zu aktivieren.
4. Klicken Sie im Explorer mit der rechten Maustaste auf das Zielverzeichnis und wählen Sie **Extract RuyiSDK Package**, um `coremark` zu entpacken.
5. Passen Sie die Build-Konfiguration wie in der README des CoreMark-Projekts beschrieben an:

   ```bash input="2"
   # GCC durch den Cross-Compiler ersetzen
   $ sed -i 's/\bgcc\b/riscv64-plctxthead-linux-gnu-gcc/g' linux64/core_portme.mak
   ```

6. Öffnen Sie das VS-Code-Terminal, das den `PATH` der aktiven Umgebung übernimmt, wechseln Sie in das Verzeichnis `coremark` und starten Sie den Build:

   ```bash input="2"
   # CoreMark für die Zielplattform bauen und coremark.exe erzeugen
   make PORT_DIR=linux64 link
   ```

7. Übertragen Sie das Programm etwa per `scp`, serieller Verbindung oder NFS auf das LicheePi 4A und führen Sie es dort aus.

## Hinweise

- Wenn Sie das Programm lokal ausführen möchten, wählen Sie einen passenden QEMU-Emulator und verwenden Sie ihn im Terminal.
- Informationen zum Flashen und Installieren von Images finden Sie in den Beispielen zum Paketmanager. Die Erweiterung bietet derzeit keinen Assistenten dafür.
