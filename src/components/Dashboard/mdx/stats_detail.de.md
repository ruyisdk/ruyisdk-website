# 📊 Details zu den RuyiSDK-Statistiken

## Für Leserinnen und Leser

Vielen Dank für Ihr Interesse an den RuyiSDK-Statistiken. Bevor Sie die einzelnen Kennzahlen lesen, beachten Sie bitte die folgenden Hintergrundinformationen:

**Der RuyiSDK-Software-Stack umfasst zwei Produktkategorien**
- **Basissoftware**: GNU-Toolchains, LLVM-Toolchains, QEMU-Emulator, V8, OpenJDK, Go und weitere Komponenten.
- **Entwicklungswerkzeuge**: RuyiSDK-Paketmanager, VS-Code-Erweiterung, Eclipse-Plugins und weitere Werkzeuge.

**Die Distributionskanäle sind vielfältig, und die statistische Abdeckung ist begrenzt**
- Anpassungen an Basissoftware werden hauptsächlich an Upstream-Communitys zurückgegeben. Die Distribution folgt den jeweiligen Upstream-Communitys, daher lassen sich die Daten nur schwer einheitlich erfassen.
- Entwicklungswerkzeuge werden über mehrere Kanäle verteilt, darunter ISCAS-Spiegelserver, GitHub, Anwendungsmärkte und Paketquellen von Linux-Distributionen, damit Nutzer die passende Quelle wählen können.
- Von diesen Kanälen bieten **ISCAS-Spiegelserver (die offizielle RuyiSDK-Softwarequelle)** und **GitHub Releases** programmierbaren Zugriff auf Download-Logs. Daher decken die Statistiken **hauptsächlich diese beiden Kanäle** ab.
- Andere Kanäle, etwa Anwendungsmärkte und Paketquellen von Linux-Distributionen, sind wegen eingeschränkter Datenschnittstellen derzeit nicht enthalten. Bitte prüfen Sie entsprechende Kennzahlen auf den jeweiligen Marktseiten.

**Zweck und Grenzen der Daten**
Alle Statistiken dienen ausschließlich als Referenz für Produktverbesserungen. Aufgrund objektiver Einschränkungen können die Daten ungenau sein. Bitte betrachten Sie vor allem Trends und Richtungen.

Die folgenden Abschnitte enthalten eine Übersicht der Kanalabdeckung sowie detaillierte Definitionen der einzelnen Kennzahlen.

---

## RuyiSDK-Distributionskanäle und Einbeziehung in die offiziellen Statistiken

| Kanal | Paketmanager | VS-Code-Erweiterung | Eclipse-Plugins | In Statistiken enthalten |
| --- | --- | --- | --- | --- |
| ISCAS-Spiegelserver | ✓ | ✓ | ✓ | ✅ |
| GitHub Releases | ✓ | ✓ | ✓ | ✅ |
| PyPI | ✓ | ∅ | ∅ | ✅ |
| Paketquellen von Linux-Distributionen | ✓ (in Arbeit) | ∅ | ∅ | ❌ |
| Open VSX | ∅ | ✓ | ∅ | ❌ |
| Visual Studio Marketplace | ∅ | ✓ | ∅ | ❌ |
| Eclipse Marketplace | ∅ | ∅ | ✓ | ❌ |

> **Legende**
> - `✓`: dieses Produkt wird über diesen Kanal verteilt.
> - `∅`: dieser Kanal ist für das Produkt nicht relevant.
> - `✅`: Downloads aus diesem Kanal fließen in die entsprechende Kennzahl der offiziellen Statistikseite ein.
> - `❌`: Downloads aus diesem Kanal fließen nicht in die offizielle Statistikseite ein und sollten auf der jeweiligen Marktseite geprüft werden.
>
> Konkrete Daten aus Anwendungsmärkten finden Sie über die Links am Ende dieses Dokuments.

---

## Erläuterung der Kennzahlen auf der RuyiSDK-Statistikseite

Die folgenden Erläuterungen entsprechen den sechs Kernkennzahlen der offiziellen Statistikseite. Für jede Kennzahl werden Definition, Umfang und Hinweise aufgeführt.

### 1. Downloads von RuyiSDK-Komponentenpaketen

**Definition**: kumulierte Downloads aller binären Komponentenpakete im Verzeichnis `ruyisdk/dist` auf den ISCAS-Spiegelservern.

**Enthaltene Komponenten**: GNU/LLVM-Toolchains, QEMU-Emulator, Debugger, Profiling-Werkzeuge und weitere Komponenten.

**Zählmethode**: Auswertung der Zugriffs-Logs der ISCAS-Spiegelserver; gezählt werden Anfragen auf Paketdateien unter `ruyisdk/dist`.

> ⚠️ **Hinweis**: unterschiedliche Versionen und Architekturen derselben Komponente werden getrennt gezählt. Die Kennzahl entspricht nicht der Zahl eindeutiger Nutzer. **Gezählt wird nur der ISCAS-Spiegelkanal**; GitHub Releases und andere Quellen sind nicht enthalten.

### 2. Von RuyiSDK-Telemetrie gemeldete Geräte

**Definition**: deduplizierte Anzahl eindeutiger Gerätekennungen (UUIDs), die vom RuyiSDK-Paketmanager an das Backend gemeldet wurden.

**UUID-Erzeugung und Lebenszyklus**: Beim ersten Ausführen von `ruyi` in einer Betriebssysteminstanz (Benutzer-Home-Verzeichnis) wird eine zufällige UUID erzeugt und lokal gespeichert, sofern Telemetrie nicht deaktiviert wurde. Nach Neuinstallation des Betriebssystems, Löschen lokaler Caches oder Wechsel des Benutzerkontos kann die ursprüngliche UUID verloren gehen und eine neue erzeugt werden. Daher kann dasselbe physische Gerät als mehrere Geräte gezählt werden.

**Zeitpunkt der Meldung**:
- **Erstmeldung**: Beim ersten Lauf und nicht deaktivierter Telemetrie meldet `ruyi` vor dem Beenden automatisch grundlegende Umgebungsinformationen einschließlich UUID. Dies dient zur Zählung neu beobachteter Geräte.
- **Periodische Meldung**: Wenn der Nutzer periodische Uploads mit `ruyi telemetry consent` ausdrücklich aktiviert, werden spätere Nutzungsdaten in wöchentlichen Abständen gemeldet. Jede Meldung enthält dieselbe UUID.

**Datenschutz**: Meldungen enthalten keine personenbezogenen Daten, IP-Adressen oder Geostandorte. Sie enthalten nur anonyme Basisinformationen wie CPU-Architektur, Betriebssystemtyp und `ruyi`-Version, um Nutzerumgebungen besser zu verstehen.

**Nutzerkontrolle**: Nutzer können Telemetrie jederzeit mit `ruyi telemetry optout` vollständig deaktivieren. Dann wird keine UUID erzeugt und es werden keine Daten gemeldet. Mit `ruyi telemetry local` können Daten ausschließlich lokal aufgezeichnet werden. Beim ersten Lauf fragt `ruyi` ausdrücklich nach Zustimmung; das Standardverhalten wird dabei vom Nutzer gewählt.

**Einschränkungen**:
- Nutzer können Telemetrie freiwillig deaktivieren, sodass manche Geräte nicht gezählt werden.
- Dasselbe physische Gerät kann durch Neuinstallation oder Cache-Löschung mehrere UUIDs erzeugen, wodurch die Gerätezahl höher als die Zahl physischer Geräte ausfallen kann.

### 3. Downloads von RuyiSDK-Dokumentation

**Definition**: Downloads von Dokumentationsressourcen, die über ISCAS-Spiegelserver verteilt werden, etwa PDF-Dateien, HTML-Pakete und gepackte Markdown-Dateien.

**Dokumenttypen**: Präsentationen von Konferenzen, RVI-Spezifikationen, Benutzerhandbücher, technische Whitepaper, Best-Practice-Leitfäden und weitere Dokumente.

**Zählmethode**: Auswertung der Server-Logs der ISCAS-Spiegelserver; gezählt werden Datei-Download-Anfragen.

### 4. Downloads des RuyiSDK-Paketmanagers

**Definition**: kumulierte Downloads des Ruyi-Paketmanager-CLI-Werkzeugs `ruyi` über die folgenden drei Kanäle:
- ISCAS-Spiegelserver: Downloads verschiedener Architekturen und Versionen im Verzeichnis `ruyi/`.
- GitHub Releases: vorkompilierte Binärpakete.
- PyPI: `pip install ruyi`.

> 📌 Nicht enthalten sind Nutzer, die aus Paketquellen von Linux-Distributionen installieren. Derselbe Nutzer kann über mehrere Kanäle herunterladen und mehrfach gezählt werden. Downloads aus Paketquellen von Linux-Distributionen können derzeit nicht gezählt werden. Der aktuelle Schwerpunkt liegt darauf, `ruyi` in offizielle Paketquellen wichtiger Linux-Distributionen aufzunehmen.

### 5. Downloads der RuyiSDK-VS-Code-Erweiterung

**Definition**: kumulierte Downloads der RuyiSDK-VS-Code-Erweiterung. Die aktuellen Statistiken spiegeln nur die Verteilung über ISCAS-Spiegelserver und GitHub Releases wider.

**Enthaltene Kanäle**:
- ISCAS-Spiegelserver: Offline-VSIX-Dateien.
- GitHub Releases.

> 📌 **Open VSX und Visual Studio Marketplace sind nicht enthalten.** Um Daten dieser Marktplätze einzusehen, besuchen Sie bitte die jeweiligen Marktseiten.

### 6. Downloads von RuyiSDK-Eclipse-Komponenten

**Definition**: kumulierte Downloads der RuyiSDK-Eclipse-IDE-Pakete und Plugins. Die aktuellen Statistiken spiegeln nur die Verteilung über ISCAS-Spiegelserver und GitHub Releases wider.

**Enthaltene Inhalte**:
- Vorintegrierte Eclipse IDE for RuyiSDK einschließlich RISC-V-Entwicklungsplugins.
- Eigenständige Plugins, die in eine vorhandene Eclipse-Installation eingebunden werden können.

**Enthaltene Kanäle**:
- ISCAS-Spiegelserver: vollständige IDE-Pakete und Plugin-Pakete unter `ruyisdk/ide/`.
- GitHub Releases.

> 📌 **Eclipse Marketplace ist nicht enthalten.** Daten aus Eclipse Marketplace fließen nicht in diese Kennzahl ein. Bitte besuchen Sie bei Bedarf die offizielle Marktseite.

---

## RuyiSDK-Distributionskanäle und Links

- [ISCAS-Spiegelserver (offizielle RuyiSDK-Softwarequelle)](https://fast-mirror.isrc.ac.cn/ruyisdk/): der wichtigste von ISCAS betriebene Distributionspunkt.

### Distributionskanäle des RuyiSDK-Paketmanagers

- [PyPI](https://pypi.org/project/ruyi/): Installation mit `pip install ruyi`.
- [GitHub Releases](https://github.com/ruyisdk/ruyi/releases/): Binärpakete für mehrere Architekturen und Linux-Distributionen.
- [ISCAS-Spiegelserver (ruyi-Verzeichnis)](https://mirror.iscas.ac.cn/ruyisdk/ruyi/): Binärpakete für mehrere Architekturen und Linux-Distributionen.
- Paketquellen von Linux-Distributionen (in Arbeit): `ruyi` soll in offizielle Paketquellen wichtiger Linux-Distributionen aufgenommen werden, sodass eine Installation etwa mit `apt install ruyi` oder `dnf install ruyi` möglich wird.

### Distributionskanäle der RuyiSDK-VS-Code-Erweiterung

- [Open VSX](https://open-vsx.org/extension/RuyiSDK/ruyisdk-vscode-extension): für VSCodium.
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=RuyiSDK.ruyisdk-vscode-extension): für VS Code.
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-vscode-extension/releases/): manueller Download und Installation der VSIX-Datei.
- [ISCAS-Spiegelserver](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/vscode/): manueller Download und Installation der VSIX-Datei.

### Distributionskanäle der RuyiSDK-Eclipse-Plugins

- [Eclipse Marketplace](https://marketplace.eclipse.org/content/ruyisdk#metrics): Plugin-Index.
- [GitHub Releases](https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/): manueller Download und Installation von ZIP-Paketen.
- [ISCAS-Spiegelserver](https://mirror.iscas.ac.cn/ruyisdk/ide/plugins/eclipse/): manueller Download und Installation von ZIP-Paketen.

> **Hinweis zu Eclipse-Marketplace-Statistiken**
> - Eclipse Marketplace stellt nur einen Plugin-Index bereit und hostet keine Plugin-Dateien. Wenn Nutzer installierte Plugins innerhalb von Eclipse aktualisieren, umgehen sie den Marketplace. Daher ist keine genaue Download-Zählung möglich.
> - Die Webschnittstelle des Marketplace kann fehlerhaft sein. Genaue Installationszahlen müssen manuell auf der integrierten Marketplace-Seite in Eclipse geprüft werden. Installationen über Updates ändern den Wert `installed` möglicherweise nicht.

---

*Gepflegt vom RuyiSDK-Team. Dieses Dokument wird bei Änderungen der Statistikdefinitionen unregelmäßig aktualisiert. Letzte Aktualisierung: 9. Mai 2026.*
