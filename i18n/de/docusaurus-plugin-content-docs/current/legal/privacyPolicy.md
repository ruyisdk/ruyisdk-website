# Datenschutzrichtlinie

RuyiSDK ist ein von der Softwareforschungsinstitut der Chinesischen Akademie der Wissenschaften (im Folgenden „ISCAS“ genannt) entwickeltes und gewartetes Entwicklungstoolset für RISC-V-Entwickler. ISCAS legt großen Wert auf Ihre Privatsphäre und verpflichtet sich, Ihre persönlichen Informationen zu schützen. Im Folgenden finden Sie die Datenschutzerklärung von ISCAS RuyiSDK (im Folgenden „wir“ genannt) zur Erhebung und Nutzung persönlicher Informationen (im Folgenden „diese Erklärung“). Bitte lesen Sie diese Erklärung sorgfältig durch, bevor Sie uns persönliche Informationen zur Verfügung stellen. Bei Fragen können Sie sich jederzeit gerne an uns wenden.

## 1. Wie wir Ihre persönlichen Informationen erheben und verarbeiten

RuyiSDK konzentriert sich auf die Optimierung der Produktnutzung und Benutzererfahrung und verfolgt das Prinzip der Minimierung der Informationssammlung, um die Erhebung persönlicher Identifikationsinformationen zu vermeiden. Wir bevorzugen die anonymisierte Erhebung von Informationen zur Verbesserung des Betriebs und der Dienstleistungen des Produkts. Folgendes sind unsere Erhebungs- und Verarbeitungsmethoden:

- Website-Besuch: Beim bloßen Besuch dieser Website sind keine persönlichen Informationen erforderlich.
- E-Mail-Abonnement: Wenn Sie unseren E-Mail-Abonnementdienst nutzen, erheben wir Ihre E-Mail-Adresse, um die entsprechenden Dienste bereitzustellen.
- Teilnahme und Beitrag: Die RuyiSDK-Community ist eine Open-Source-Community, deren Code auf der GitHub-Plattform gehostet wird. Sie können über die GitHub-Repository-Issues und -Diskussionen an der Kommunikation und dem Feedback teilnehmen oder direkt an der Entwicklung mitwirken. Bei der Teilnahme an Community-Aktivitäten über die GitHub-Plattform müssen Sie die Datenschutzrichtlinie von GitHub [*GitHub General Privacy Statement*](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) einhalten.
- Installation und Nutzung von Tools: Bei der Verwendung des RuyiSDK-Paketmanagers können wir anonymisierte Nutzungsdaten erheben; Einzelheiten finden Sie im Abschnitt 2.

## 2. Unsere Datenbeschaffungsmethoden

Um RuyiSDK zu verbessern, können wir ab Version 0.23 (einschließlich) Ihre Nutzungsdaten erheben. Folgendes sind die relevanten Details:

### 2.1 Datenbeschaffungsmodi

* **local (lokaler Modus)**: Daten werden nur lokal erfasst und nicht übermittelt.
* **on (Aktivierungsmodus)**: Daten werden lokal erfasst und regelmäßig übermittelt. Dies ist der Standardmodus.
* **off (Deaktivierungsmodus)**: Die Datenerfassung wird vollständig gestoppt.

Wir hoffen, dass Sie der Datenerhebung zustimmen, um uns zu helfen, die Nutzung des RuyiSDK-Tools zu verstehen und das RuyiSDK-Produkt zu verbessern. Wenn Sie nicht möchten, dass wir Ihre Nutzungsdaten erhalten, lesen Sie bitte Abschnitt 2.3.

### 2.2 Erhobene Daten

* **Erstlaufdaten**: Bei der ersten Ausführung des RuyiSDK-Paketmanagers werden einmalig folgende Geräteinformationen erfasst. Die erste Nutzung nach dem Zurücksetzen der Telemetriedaten wird ebenfalls als Erstnutzung betrachtet.
  * Eine eindeutige Installations-ID, die vom System zufällig generiert wird und nicht mit einer Systemkonfiguration oder lokalen Daten verbunden ist;
  * Ob die aktuelle Laufumgebung eine der bekannten CI-Dienste ist, einschließlich, aber nicht beschränkt auf GitHub Actions, GitLab CI, Travis CI usw.;
  * Art des Betriebssystemkerns und Prozessorarchitektur;
  * Art und Version der C-Laufzeitbibliothek (z. B. glibc 2.40);
  * Codename und Version der Linux-Distribution;
  * Wenn die Prozessorarchitektur RISC-V ist, werden auch systemmodell, CPU-Kerne, Mikroarchitektur, ISA-Strings und andere RISC-V-spezifische Informationen erfasst.
* **Nutzungsdaten**: Bei jedem Aufruf des RuyiSDK-Paketmanagers wird die Art des aufgerufenen Befehls ohne Parameter protokolliert.
* **Toolchain-Proxy-Daten**: Bei jedem Aufruf eines Toolchain-Proxy-Befehls in der Ruyi-virtuellen Umgebung wird der Name des aufgerufenen Befehls protokolliert.

### 2.3 Kontrolle des Telemetrieverhaltens

Sie können wählen, ob Sie an der Telemetrie teilnehmen möchten. Wenn Sie nicht teilnehmen möchten, führen Sie bitte eine der folgenden Aktionen aus, bevor Sie den RuyiSDK-Paketmanager mit Telemetrie-Funktion ausführen:

* Stellen Sie sicher, dass die Umgebungsvariable `RUYI_TELEMETRY_OPTOUT=1` vorhanden ist;
* Fügen Sie in der Konfigurationsdatei `~/.config/ruyi/config.toml` den folgenden Inhalt hinzu:

```toml
[telemetry]
mode = "off"
```

### 2.4 Löschen von Telemetriedaten

Sie können jederzeit den Befehl `ruyi self clean --telemetry` verwenden, um alle Telemetrieinformationen, einschließlich Geräteinformationen, zu löschen.

## 3. Wie wir Ihre persönlichen Informationen teilen

Wir geben keine Informationen, die Sie direkt oder indirekt identifizieren können, an Dritte weiter, es sei denn, es liegt einer der folgenden Fälle vor:

1. **Anonymisierte Datenweitergabe**: Wir können anonymisierte Daten mit Partnern teilen, um Marktanalysen, Produktverbesserungen usw. durchzuführen. Diese Daten enthalten keine Informationen, die Sie persönlich identifizieren können.
2. **Rechtliche Anforderungen**: Wenn gesetzliche Anforderungen bestehen oder um die nationale Sicherheit, öffentliche Sicherheit sowie Ihre und anderer Personen wesentliche gesetzliche Rechte zu schützen, können wir Informationen gemäß den gesetzlichen Anforderungen weitergeben.

## 4. Wie lange wir Ihre persönlichen Informationen aufbewahren

Wir bewahren Ihre persönlichen Informationen gemäß den folgenden Grundsätzen auf:

1. **Für den erforderlichen Zeitraum zur Erreichung des Zwecks**: Wir bewahren Ihre persönlichen Informationen für den Zeitraum auf, der zur Erreichung der in dieser Erklärung genannten Zwecke erforderlich ist.
2. **Rechtliche Anforderungen**: Wenn wir gesetzlich verpflichtet sind, die Aufbewahrungsfrist zu verlängern, werden wir die entsprechenden Gesetze einhalten.
3. **Anonymisierte Verarbeitung**: Nach Ablauf der Aufbewahrungsfrist werden wir persönliche Informationen anonymisieren oder gemäß den gesetzlichen Anforderungen löschen.

## 5. Wie wir Ihre persönlichen Informationen schützen

Wir ergreifen folgende Maßnahmen zum Schutz Ihrer persönlichen Informationen:

1. **Technische Maßnahmen**: Wir verwenden Technologien wie Verschlüsselung und Anonymisierung, um Ihre persönlichen Informationen zu schützen.
2. **Physische und verwaltungstechnische Maßnahmen**: Wir setzen angemessene Verwaltungsmaßnahmen um, um sicherzustellen, dass nur autorisierte Personen auf persönliche Informationen zugreifen können.

## 6. Wie Sie auf Ihre persönlichen Informationen zugreifen oder diese kontrollieren können

Gemäß den geltenden Gesetzen und Vorschriften haben Sie möglicherweise folgende Rechte in Bezug auf Ihre persönlichen Informationen:

1. Das Recht, auf Ihre persönlichen Informationen zuzugreifen und eine Kopie davon zu erhalten;
2. Das Recht, uns zu bitten, Ihre persönlichen Informationen zu aktualisieren oder zu korrigieren;
3. Das Recht, uns zu bitten, Ihre persönlichen Informationen zu löschen;
4. Das Recht, gegen die Verarbeitung Ihrer persönlichen Informationen durch uns Einspruch zu erheben;
5. Das Recht, die Verarbeitung Ihrer persönlichen Informationen durch uns einzuschränken;
6. Das Recht, Beschwerden oder Meldungen bei den zuständigen Datenschutzbehörden einzureichen.

Bitte beachten Sie, dass die Informationen, die wir derzeit erheben, anonymisiert sind und nicht direkt mit Ihrer persönlichen Identität verknüpft sind. Daher werden die oben genannten Rechte 1 und 2 in gewissem Maße eingeschränkt, z. B. können einige Datenzugriffs- und Aktualisierungsoperationen nicht basierend auf Ihren Identitätsinformationen durchgeführt werden. Sie können Ihre persönlichen Informationen aktiv kontrollieren, indem Sie Folgendes tun:
1. **Löschen**: Sie können den Befehl `ruyi self clean --telemetry` verwenden, um alle gesammelten Telemetriedaten zu löschen.
2. **Widerruf der Zustimmung**: Sie können Ihre Zustimmung zur Datenerhebung widerrufen, indem Sie den Telemetriemodus auf „off“ setzen. Bitte beachten Sie jedoch, dass Sie den Umfang, in dem Sie uns die Fortsetzung der Erhebung persönlicher Informationen gestatten, ändern oder Ihre Zustimmung zurückziehen können. Ihre Entscheidung, die Zustimmung oder Genehmigung zurückzuziehen, hat jedoch keinen Einfluss auf die zuvor auf Grundlage Ihrer Genehmigung durchgeführten Verarbeitungsaktivitäten Ihrer persönlichen Informationen.

Darüber hinaus beachten Sie bitte, dass die oben genannten Rechte nicht absolut sind und möglicherweise gemäß den geltenden Gesetzen eingeschränkt sind. Wenn Sie unsere Unterstützung bei der Ausübung der oben genannten Anfragen oder Rechte benötigen oder weitere Anforderungen oder Fragen, Anregungen oder Vorschläge zu Ihren Rechten als betroffene Person haben, können Sie uns über die im Abschnitt „Wie Sie uns kontaktieren können“ dieser Erklärung beschriebenen Methoden kontaktieren.

## 7. Speicherort der persönlichen Informationen

Da die von uns gesammelten Daten keine Informationen enthalten, die Sie persönlich identifizieren können, werden Ihre persönlichen Informationen nicht gespeichert. Anonymisierte Daten werden auf Servern innerhalb der Volksrepublik China gespeichert, die den gesetzlichen Anforderungen entsprechen.

## 8. Wie wir diese Erklärung aktualisieren

Wir können diese Erklärung aktualisieren oder ändern, um Änderungen an den Dienstleistungen oder der Datenverarbeitung zu berücksichtigen. Die neueste Version der Datenschutzerklärung wird auf dieser Website veröffentlicht und tritt sofort nach der Veröffentlichung in Kraft. Wir empfehlen Ihnen, diese Erklärung regelmäßig zu überprüfen, um über Änderungen informiert zu bleiben.

## 9. Schutz der persönlichen Informationen von Kindern

Unsere Dienste richten sich hauptsächlich an Erwachsene. Kinder (Personen unter 14 Jahren) sollten vor der Nutzung unserer Dienste die Zustimmung ihrer Eltern oder Erziehungsberechtigten einholen.

## 10. Wie Sie uns kontaktieren können

Wenn Sie uns kontaktieren oder Ihre entsprechenden Rechte ausüben möchten, können Sie uns wie folgt erreichen:

Kontakt-E-Mail: contact@ruyisdk.cn

Letzte Aktualisierung: 3. Dezember 2024

Version der Datenschutzrichtlinie: v20241203