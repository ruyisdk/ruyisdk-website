---
sidebar_position: 3
---

import CodeBlock from '@site/src/components/docs_utils/CodeBlock';

# Verwaltung des Ruyi-Pakets

## Aktualisieren des lokalen Paket-Cache

Holen Sie sich den Inhalt der entfernten Softwarequelle und aktualisieren Sie den lokalen Paket-Cache. Standardmäßig wird das auf GitHub gehostete Spiegelbild verwendet:

<CodeBlock lang="bash" code={`
$ ruyi update
`} />

Der Paket-Cache wird im Benutzerverzeichnis gespeichert, normalerweise unter ``~/.cache/ruyi/packages-index/``; wenn die Umgebungsvariable ``XDG_CACHE_HOME`` gesetzt ist, befindet sich das Verzeichnis unter ``$XDG_CACHE_HOME/ruyi/packages-index/``.

### ``ruyi update`` fehlgeschlagen

Da die aktuellen Paketindexinformationen im GitHub-Repository gehostet werden, kann es bei instabilen Repository-Zugriffen erforderlich sein, in der Konfigurationsdatei ein [alternatives Repository](https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git) zu konfigurieren.

Die Konfigurationsdatei des Ruyi-Paketmanagers wird standardmäßig unter ``~/.config/ruyi/config.toml`` gespeichert, wenn ``XDG_CONFIG_HOME`` konfiguriert ist, befindet sie sich unter ``$XDG_CONFIG_HOME/ruyi/config.toml``. Wenn die Datei nicht existiert, können Sie sie selbst erstellen.

<CodeBlock lang="~/.config/ruyi/config.toml" code={`
[repo]
local = ""
remote = "https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git"
branch = "main"
`} />

Dabei steht ``local`` für das lokale Cache-Verzeichnis, ``remote`` für die Adresse des entfernten Spiegelservers und ``branch`` für den Git-Zweig, in dem sich das Spiegelbild befindet.

Speichern Sie die Konfiguration und versuchen Sie erneut, den lokalen Cache zu aktualisieren:

<CodeBlock lang="bash" code={`
$ ruyi update
`} />

## Nachrichten lesen

Als Sie im vorherigen Abschnitt ``ruyi update`` ausgeführt haben, um die lokale Softwarequelle zu aktualisieren, haben Sie wahrscheinlich gesehen, dass der Ruyi-Paketmanager ungelesene Nachrichten (news item(s)) aufgelistet hat. Hier können Sie rechtzeitig über die Aktualisierungen der Ruyi-Pakete oder andere wichtige Mitteilungen informiert werden.

Durch Ausführen von ``ruyi news list`` können Sie ebenfalls diese Seite aufrufen. Der Unterschied besteht darin, dass alle Nachrichten angezeigt werden, während ungelesene Nachrichten in unterstützten Terminals grün hervorgehoben werden.

Sie können die folgenden Befehle verwenden, um Nachrichten zu durchsuchen, zu lesen und als gelesen zu markieren:

<CodeBlock lang="bash" code={`
$ ruyi news list -h
$ ruyi news list
$ ruyi news list --new        # Nur ungelesene Nachrichten auflisten

$ ruyi news read -h
$ ruyi news read 1            # Nachricht mit der ID 1 lesen
$ ruyi news read              # Alle ungelesenen Nachrichten lesen
$ ruyi news read --quiet      # Nichts ausgeben, nur ungelesene Nachrichten als gelesen markieren
`} />

Ruyi markiert ungelesene Nachrichten, indem es die Titel in ``~/.local/state/ruyi/news.read.txt`` speichert. Wenn ``XDG_STATE_HOME`` konfiguriert ist, befindet sich der Dateipfad unter ``$XDG_STATE_HOME/ruyi/news.read.txt``.

## Pakete auflisten

Ruyi-Pakete sind grob in mehrere Kategorien unterteilt:

- toolchain Werkzeugkette
- source Quellpaket
- emulator Emulator
- board-image Systemabbild
- analyzer Analysetools
- extra Sonstiges

Die Versionsnummern der Pakete folgen strikt den Semver-Richtlinien, was bedeutet, dass sie von den upstream-Versionen abweichen können.

Pakete werden in offiziell veröffentlichte Pakete und Vorabversionen (prerelease) unterteilt. Vorabversionen werden vor der offiziellen Veröffentlichung dieser Version durch upstream bereitgestellt, beheben jedoch Bugs der zuletzt veröffentlichten Version.

Einige früh veröffentlichte Ruyi-Pakete haben auch slug eingeführt, um Versionen zu kennzeichnen. Dies ist ein veraltetes Feature, das in Zukunft vollständig entfernt wird.

Verwenden Sie den Befehl ``ruyi list``, um alle verfügbaren Pakete aufzulisten. Beachten Sie, dass selbst wenn ein Paket/eine Version nicht mit dem aktuellen Systemarchitektur kompatibel ist, es dennoch aufgelistet wird.

Hier ist ein Beispiel auf einer ``x86_64``-Maschine; die tatsächliche Liste wird länger sein:

<CodeBlock lang="bash" code={`
$ ruyi list
List of available packages:

* source/milkv-duo-examples
  - 0.20240719.0+git.52ae647a (latest)
* source/ruyisdk-demo
  - 0.20231114.0 (latest)
* source/coremark
  - 1.0.2-pre.20230125 (prerelease, latest-prerelease)
  - 1.0.1 (latest)
* toolchain/llvm-plct
  - 17.0.6-ruyi.20240511 (latest)
* toolchain/llvm-upstream
  - 17.0.5-ruyi.20231121 (latest) slug: llvm-upstream-20231121
* toolchain/gnu-milkv-milkv-duo-elf-bin
  - 0.20240731.0+git.67688c7335e7 (latest)
* analyzer/dynamorio-riscv
  - 10.93.19979-ruyi.20240914 (latest, no binary for current host)
  - 10.0.19748-ruyi.20240128 (no binary for current host)
* board-image/uboot-revyos-sipeed-lc4a-8g
  - 0.20240127.0 (latest)
* board-image/uboot-oerv-sipeed-lpi4a-8g
  - 0.2309.1 (latest)
* board-image/canmv-linux-sdk-demo-canaan-k230d-rv64ilp32
  - 0.20240731.0 (latest)
  - 0.20240717.0 ()
* emulator/qemu-user-riscv-xthead
  - 6.1.0-ruyi.20231207+g03813c9fe8 (latest)
* emulator/box64-upstream
  - 0.3.1-pre.ruyi.20240901+git.9178effd (prerelease, latest-prerelease, no binary for current host)
  - 0.3.0-ruyi.20240718 (latest, no binary for current host)
  - 0.2.9-pre.ruyi.20240702+git.4b0b3fc9 (prerelease, no binary for current host)
  - 0.2.8-ruyi.20240702 (no binary for current host)
* emulator/qemu-user-riscv-upstream
  - 8.2.0-ruyi.20240128 (latest)
  - 8.1.2-ruyi.20231121 ()
* extra/wps-office
  - 12.1.0-r.17900 (latest)
  - 12.1.0-r.17885 ()
`} />

Der Befehl ``list`` bietet auch die Parameter ``--verbose`` oder ``-v`` an, um detailliertere Informationen auszugeben, was fast alle Informationen aus der Softwarequelle druckt. Da die Ausgabe sehr lang sein kann, wird empfohlen, die Ausgabe in eine Datei oder in Tools wie ``less`` umzuleiten.

Zeilen wie ``toolchain/llvm-plct`` stellen den Namen eines Pakets dar, der bei der Verwendung des ``install``-Befehls angegeben werden muss. In den meisten Fällen reicht es aus, nur den Namen nach dem ``/`` anzugeben, in diesem Beispiel also ``llvm-plct``.

Nach dem Paketnamen folgt eine Liste von Versionsnummern. Diese Versionsnummern können verwendet werden, um eine bestimmte Version eines Pakets oder eine Version, die dem angegebenen Ausdruck entspricht, zu installieren. Der Inhalt in Klammern hinter der Versionsnummer kennzeichnet einige Informationen zu dieser Version.

### ``latest``

Kennzeichnet die neueste Version eines Pakets, die auch die Version ist, die standardmäßig mit dem ``install``-Befehl installiert wird.

### ``prerelease``

Eine Vorabversion. Dies bedeutet, dass dieses Paket diese Version vor der Veröffentlichung durch upstream bereitgestellt hat. Neue Versionen beheben oft Bugs der alten Version, insbesondere wenn eine Vorabversion als notwendig erachtet wird.

Standardmäßig ignoriert der Ruyi-Paketmanager Vorabversionen. Sie können den Ruyi-Paketmanager so konfigurieren, dass Vorabversionen installiert werden, müssen jedoch die damit verbundenen Risiken selbst tragen.

### ``latest-prerelease``

Die neueste Vorabversion. Wenn die Installation von Vorabversionen erlaubt ist und diese Version neuer ist als die ``latest``-Version, wird dies die Version sein, die standardmäßig mit dem ``install``-Befehl installiert wird.

Wenn Sie tatsächlich eine Vorabversion installieren müssen, können Sie die Konfiguration in der Konfigurationsdatei hinzufügen:

<CodeBlock lang="~/.config/ruyi/config.toml" code={`
[packages]
prereleases = true
`} />

### ``no binary for current host``

Dies bedeutet, dass für diese Paketversion kein Binärpaket für die lokale Architektur bereitgestellt wird.

In bestimmten Szenarien sollten Pakete, die nicht für die lokale Architektur bestimmt sind, installiert werden, z. B. wenn Sie box64 auf einer riscv64-Maschine verwenden, um WPS Office auszuführen.

In diesem Fall können Sie angeben, dass ein Binärpaket für eine bestimmte Architektur installiert werden soll:

<CodeBlock lang="bash" code={`
$ ruyi install --host x86_64 wps-office
`} />

## Installation von Binärpaketen

In der Regel sind die Pakete in den folgenden Kategorien Binärpakete:

- toolchain Werkzeugkette
- emulator Emulator
- board-image Systemabbild
- analyzer Analysetools
- extra Sonstiges

Diese Pakete können mit dem ``install``-Befehl installiert werden, z. B. um die GNU upstream gcc-Werkzeugkette zu installieren:

<CodeBlock lang="bash" code={`
$ ruyi install gnu-upstream
$ ruyi install toolchain/gnu-upstream
`} />

Die oben genannte Methode zur Installation durch Angabe des Paketnamens installiert standardmäßig das als latest gekennzeichnete gnu-upstream-Paket. Wenn Sie eine bestimmte ältere Version von gnu-upstream installieren möchten, können Sie dies durch Angabe der Version tun:

<CodeBlock lang="bash" code={`
$ ruyi install 'gnu-upstream(0.20231118.0)'
$ ruyi install 'gnu-upstream(>=0.20231118.0)'
`} />

Die Ausdrücke unterstützen die Operatoren ``<``, ``>``, ``==``, ``<=``, ``>=`` und ``!=``.

Wenn Sie mehrere Pakete installieren möchten:

<CodeBlock lang="bash" code={`
$ ruyi install gnu-plct gnu-upsteam llvm-plct llvm-upstream
`} />

In einigen speziellen Fällen, wie z. B. wenn Sie versehentlich Dateien eines installierten Pakets gelöscht haben, können Sie das Paket erneut installieren, um es wiederherzustellen:

<CodeBlock lang="bash" code={`
$ ruyi install --reinstall gnu-upstream
`} />

Die vom Paketmanager heruntergeladenen Pakete werden unter ``~/.cache/ruyi/distfiles/`` gespeichert. Wenn ``XDG_CACHE_HOME`` angegeben ist, befindet sich der Pfad unter ``$XDG_CACHE_HOME/ruyi/distfiles/``. Diese Pakete liegen normalerweise in komprimierter Form vor und müssen mit Systemwerkzeugen entpackt werden. Wenn die entsprechenden Werkzeuge im System fehlen, wird eine entsprechende Warnung ausgegeben.

Der ``install``-Befehl installiert standardmäßig nur Binärpakete, die mit der lokalen Architektur übereinstimmen. Die entpackten Binärpakete werden im Verzeichnis ``~/.local/share/ruyi/binaries/$(uname -m)/`` gespeichert. Wenn ``XDG_DATA_HOME`` angegeben ist, befindet sich der Pfad unter ``$XDG_DATA_HOME/ruyi/binaries/$(uname -m)/``.

Da Systemabbilder ebenfalls Binärdateien sind, kann der ``install``-Befehl auch zum Herunterladen und Entpacken verwendet werden. In der Regel werden diese Pakete jedoch zusammen mit der Flash-Funktion von Ruyi verwendet. Die entpackten Abbilddateien werden im Verzeichnis ``~/.local/share/ruyi/blobs/`` gespeichert. Wenn ``XDG_DATA_HOME`` angegeben ist, befindet sich der Pfad unter ``$XDG_DATA_HOME/ruyi/blobs/``.

## Installation von Quellpaketen

Die folgenden Kategorien von Paketen sind offensichtlich Quellpakete:

- source Quellpaket

Quellpakete können mit dem ``extract``-Befehl heruntergeladen und im aktuellen Verzeichnis entpackt werden:

<CodeBlock lang="bash" code={`
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
`} />

Der ``extract``-Befehl unterstützt die gleichen Versionsausdrücke wie der ``install``-Befehl.

## Deinstallation von Paketen

Der Ruyi-Paketmanager hat keine Funktion implementiert, um ein bestimmtes Ruyi-Paket zu deinstallieren. Sie können jedoch den folgenden Befehl verwenden, um alle heruntergeladenen und installierten Pakete zu löschen:

<CodeBlock lang="bash" code={`
$ ruyi self clean --distfiles --installed-pkgs
`} />

Wenn Sie darauf bestehen, ein bestimmtes Paket zu löschen, obwohl dies nicht empfohlen wird, können Sie es manuell löschen. Wenn Sie versehentlich einige Dateien gelöscht haben, Ruyi jedoch weiterhin glaubt, dass das Paket installiert ist, können Sie versuchen, es mit ``install --reinstall`` wiederherzustellen.

Bitte beachten Sie, dass, wenn ein Werkzeugkettenpaket gelöscht wird, bereits erstellte virtuelle Umgebungen, die von diesem Paket abhängen, ungültig werden und beim Aktivieren dieser Build-Umgebung keine entsprechenden Warnungen angezeigt werden.
