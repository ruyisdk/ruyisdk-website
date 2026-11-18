---
sidebar_position: 2
---

# Milk-V Duo mit der Erweiterung bauen und debuggen

Dieses Beispiel knüpft an die IDE-Dokumentation an. Sie installieren die Toolchain, erstellen eine virtuelle Umgebung und führen Ihr Programm über SSH und `gdbserver` aus VS Code aus oder debuggen es.

## Vorgehen

1. Öffnen Sie VS Code und klicken Sie in der Seitenleiste auf das **Ruyi**-Symbol.
2. Installieren Sie `gnu-milkv-milkv-duo-musl-bin` in **Packages**.
3. Klicken Sie in **Virtual Environments** auf `+`:
   - Wählen Sie das Profil `milkv-duo`.
   - Wählen Sie die Toolchain `gnu-milkv-milkv-duo-musl-bin`.
   - Geben Sie Name und Pfad an. Legen Sie die Umgebung an und klicken Sie auf ihren Namen, um sie zu aktivieren.
4. Klicken Sie im Explorer mit der rechten Maustaste auf das Zielverzeichnis und wählen Sie **Extract RuyiSDK Package**, um `milkv-duo-examples` zu entpacken.
5. Bauen Sie das Programm im VS-Code-Terminal mit der aktiven virtuellen Umgebung. Alternativ können Sie einen VS-Code-Task einrichten, der die Toolchain aus der Umgebung aufruft.
6. Übertragen Sie das Programm und führen Sie es aus:
   - Kopieren Sie es mit `scp` auf das Gerät. Das Makefile in der IDE-Dokumentation enthält dafür das Ziel `upload`.
   - Starten Sie das Programm in einer SSH-Sitzung oder richten Sie in VS Code eine **C/C++ Remote Application** ein.
7. Starten Sie den Debugger:
   - Stellen Sie `gdbserver` auf dem Gerät bereit und starten Sie es, zum Beispiel mit `gdbserver :2345 ./your_binary`.
   - Verbinden Sie sich auf dem Host mit `riscv64-unknown-linux-musl-gdb` aus der virtuellen Umgebung:

   ```bash input="1,2"
   riscv64-unknown-linux-musl-gdb ./your_binary
   target remote <device-ip>:2345
   ```

## Hinweise

- Die vollständige IDE-Konfiguration finden Sie unter [Entwicklung für Milk-V Duo mit der IDE](/docs/IDE/cases/milkv-duo-ide).
