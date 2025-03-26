# Plattformunterstützung von RuyiSDK

Aus praktischen Gründen wie den Anforderungen der RuyiSDK-Projektauftraggeber und der Berücksichtigung der Teamunterstützungskosten verfolgt das RuyiSDK-Team eine gestufte (tiered) Plattformunterstützungsstrategie für Prozessorarchitekturen, Betriebssysteme und deren Distributionen.

Zur Vereinfachung der Darstellung vereinbaren wir, dass der Begriff **"best-effort"** (in Fettschrift dargestellt) bedeutet: Wenn das RuyiSDK-Team oder Dritte auf unerwartete Probleme stoßen, werden diese behoben.

Dieses Dokument wurde zuletzt im November 2024 aktualisiert. Die RuyiSDK-Projektauftraggeber und das RuyiSDK-Team behalten sich das Recht vor, den Inhalt und die Überarbeitungen dieses Dokuments zu interpretieren.

## Prozessorarchitekturen

Die Unterstützung von Prozessorarchitekturen durch RuyiSDK ist in drei Stufen unterteilt.

* **Stufe 1 (Tier 1):** Garantierte Unterstützung (guaranteed to work).
    * Für diese Architekturen wird ein RuyiSDK-Paketmanager in Form einer einzelnen ausführbaren Datei bereitgestellt, um Benutzern einen ersten Eindruck zu ermöglichen.
    * Die offiziellen RuyiSDK-Softwarequellen werden für diese Architekturen umfassend Binärpakete in einem angemessenen Umfang bereitstellen.
    * Die RuyiSDK-CI wird für diese Architekturen eine umfassende automatisierte Qualitätssicherung bieten.
    * Der RuyiSDK-Hauptzweig akzeptiert Code- und andere Beiträge für diese Architekturen.
* **Stufe 2 (Tier 2):** Bestmögliche Unterstützung (best-effort).
    * Es wird **best-effort** versucht, einen RuyiSDK-Paketmanager in Form einer einzelnen ausführbaren Datei für diese Architekturen bereitzustellen.
    * Die offiziellen RuyiSDK-Softwarequellen werden **best-effort** versuchen, Binärpakete in einem angemessenen Umfang für diese Architekturen bereitzustellen.
    * Die RuyiSDK-CI wird **best-effort** versuchen, eine automatisierte Qualitätssicherung für diese Architekturen bereitzustellen.
    * Der RuyiSDK-Hauptzweig wird **best-effort** versuchen, Code- und andere Beiträge für diese Architekturen zu akzeptieren.
* **Stufe 3 (Tier 3):** Inoffizielle Unterstützung.
    * Das RuyiSDK-Team stellt für diese Architekturen keine Binärpakete bereit.
    * Die RuyiSDK-CI bietet keine automatisierte Qualitätssicherung für diese Architekturen.
    * Der RuyiSDK-Hauptzweig akzeptiert grundsätzlich Code- und andere Beiträge für diese Architekturen, behält sich jedoch vor, diese aufgrund von Wartungskosten oder anderen Überlegungen abzulehnen.
    * Das RuyiSDK-Team begrüßt die Bemühungen der Community, unabhängige "Paralleluniversen" der RuyiSDK-Infrastruktur für benötigte Architekturen zu pflegen.

Architekturen der Stufen 1 und 2 werden als "offiziell unterstützte Architekturen" bezeichnet, während Architekturen der Stufe 3 als "inoffiziell unterstützte Architekturen" bezeichnet werden.

Die aktuelle Unterstützung von Prozessorarchitekturen ist wie folgt. Die Architekturen innerhalb jeder Stufe sind alphabetisch sortiert.

**Stufe 1 (Tier 1):**

* RISC-V 64
* x86\_64

**Stufe 2 (Tier 2):**

* AArch64

**Stufe 3 (Tier 3):**

Alle nicht genannten Architekturen gehören zu dieser Stufe.

Für Architekturen der Stufe 3 kann das RuyiSDK-Team möglicherweise keinen RuyiSDK-Paketmanager oder Binärpakete in den offiziellen RuyiSDK-Softwarequellen bereitstellen. Benutzer, die dies benötigen, können sich selbst organisieren, um unabhängige "Paralleluniversen" der RuyiSDK-Softwarequellen und Paketmanager-Portierungen bereitzustellen. Ein "Paralleluniversum" bezieht sich auf einen unabhängigen Fork, der nicht mit dem RuyiSDK-Team verbunden ist, aber versucht, in gewissem Maße mit den offiziellen RuyiSDK-Standards übereinzustimmen.

Das RuyiSDK-Team ermutigt diese Projekte, bei Paketnamen, Versionen und Build-Parametern mit den offiziellen Softwarequellen kompatibel zu bleiben; als gleichberechtigte Entitäten wird jedoch anerkannt, dass dies nicht erzwungen werden kann.

## Betriebssysteme und Distributionen

Die Unterstützung von Betriebssystemen durch RuyiSDK ist ebenfalls in drei Stufen unterteilt.

* **Stufe 1 (Tier 1):** Garantierte Unterstützung (guaranteed to work).
    * Der RuyiSDK-Paketmanager wird auf diesen Systemen garantiert funktionieren.
    * Die Pakete in den offiziellen RuyiSDK-Softwarequellen werden auf diesen Systemen garantiert funktionieren.
* **Stufe 2 (Tier 2):** Bestmögliche Unterstützung (best-effort).
    * Es wird **best-effort** versucht, den RuyiSDK-Paketmanager auf diesen Systemen funktionsfähig zu halten.
    * Es wird **best-effort** versucht, die Pakete in den offiziellen RuyiSDK-Softwarequellen auf diesen Systemen funktionsfähig zu halten.
* **Stufe 3 (Tier 3):** Inoffizielle Unterstützung.
    * Es wird nicht aktiv sichergestellt, dass der RuyiSDK-Paketmanager auf diesen Systemen funktioniert.
    * Es wird nicht aktiv sichergestellt, dass die Pakete in den offiziellen RuyiSDK-Softwarequellen auf diesen Systemen funktionieren.
    * Dies gilt auch, wenn die Prozessorarchitektur des Systems in Stufe 1 oder 2 unterstützt wird.
    * Der RuyiSDK-Hauptzweig akzeptiert grundsätzlich Code- und andere Beiträge für diese Systeme, behält sich jedoch vor, diese aufgrund von Wartungskosten oder anderen Überlegungen abzulehnen.
    * Das RuyiSDK-Team begrüßt die Bemühungen der Community, unabhängige "Paralleluniversen" der RuyiSDK-Infrastruktur für benötigte Systeme zu pflegen.

Systeme (Distributionen) der Stufen 1 und 2 werden als "offiziell unterstützte Systeme (Distributionen)" bezeichnet, während Systeme (Distributionen) der Stufe 3 als "inoffiziell unterstützte Systeme (Distributionen)" bezeichnet werden.

Die aktuelle Unterstützung von Betriebssystemen und Distributionen ist wie folgt. Die Distributionen innerhalb jeder Stufe sind alphabetisch sortiert.

**Stufe 1 (Tier 1):**

* Debian: Die neueste Version.
    * Debian 12
* openEuler: Die neueste Long-Term-Support (LTS)-Version.
    * openEuler 24.03 LTS
* RevyOS: Ausrichtung an der RevyOS-Unterstützung für LicheePi 4A und Pioneer Box.
* RuyiOS: Die neueste Version.
* Ubuntu: Die neuesten 2 Long-Term-Support (LTS)-Versionen.
    * Ubuntu 22.04
    * Ubuntu 24.04

**Stufe 2 (Tier 2):**

* Arch Linux: Rolling Release.
* deepin: Die neueste Version.
    * deepin 23
* Fedora: Versionen, die innerhalb des letzten Jahres veröffentlicht wurden.
    * Fedora 40
    * Fedora 41

Linux-Distributionen, die in Stufe 1 oder 2 fallen, deren Versionen jedoch nicht im genannten Bereich liegen, gehören ebenfalls zu dieser Stufe.

**Stufe 3 (Tier 3):**

Alle nicht in Stufe 1 oder 2 genannten Linux-Distributionen sowie Nicht-Linux-Betriebssysteme gehören zu dieser Stufe.

Für Linux-Distributionen der Stufe 3 auf offiziell unterstützten Architekturen kann der RuyiSDK-Paketmanager und die Pakete in den offiziellen RuyiSDK-Softwarequellen möglicherweise weiterhin funktionieren, aber dies wird nicht automatisch garantiert.

Für andere Betriebssysteme auf offiziell unterstützten Architekturen, wie macOS oder Windows, müssen Benutzer eine Linux-Umgebung selbst konfigurieren, um die offiziellen Produkte des RuyiSDK-Teams zu verwenden. Benutzer, die dies benötigen, können sich selbst organisieren, um Unterstützung für diese Betriebssysteme in Forks der RuyiSDK-Komponenten hinzuzufügen und zu pflegen.