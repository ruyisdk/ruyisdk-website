---
title: About
linkTitle: About
menu: {main: {weight: 10}}
---

{{% blocks/cover title="Was ist RuyiSDK?" image_anchor="bottom" height="auto" %}}

RUYISDK ist ein Produktplan, der eine umfassende integrierte Entwicklungsumgebung bereitstellen soll. Die Vorbereitungen begannen im Jahr 2023 und es ist geplant, RISC-V-Entwicklern in drei Jahren eine vollständige Entwicklungsumgebung mit vollem Funktionsumfang zur Verfügung zu stellen.
{.mt-5}

{{% /blocks/cover %}}

{{% blocks/section %}}

## Ziele von RUYISDK

1. Entwickler, die (fast) jedes RISC-V-Entwicklungsboard oder -Modul kaufen, können über das RUYISDK-System Hardwaredokumentation, Firmware-/Software-Updates, Debugging-Unterstützung usw. erhalten.
2. Entwickler können jede häufig verwendete RISC-V-Architekturkombination mit erweitertem Befehlssatz angeben und das RUYISDK-System verwenden, um das vom Kunden benötigte Betriebssystem, die Toolkette, die Sprachausführungsumgebung (Laufzeit oder virtuelle Maschine), die Computerbibliothek und das Anwendungsframework zu generieren Warten. Insbesondere wird betont, dass RUYISDK Entwurfsstandards (oder herstellerspezifische Erweiterungen) wie Vector 0.7.1 und RVP 0.5.2, die in großem Umfang silikonisiert wurden, vollständig unterstützen wird.
3. Pflegen und betreiben Sie eine aktive und umfassende Entwicklerkommunikations-Community.

{{% /blocks/section %}}
{{% blocks/section color="white" %}}

## RUYISDK-Architekturdiagramm

<img src=./1703147196780.png width=100% >
{{% /blocks/section %}}

{{% blocks/section color="primary" %}}

## Komponenten von RuyiSDK

RuyiSDK umfasst hauptsächlich einen Komponentenmanager (auch Ruyi-Paketmanager genannt), eine integrierte Entwicklungsumgebung (Ruyi IDE) und eine Entwicklerkommunikations-Community;

- Ruyi Component Manager umfasst eine Online-Softwarequelle (Ruyi Repo) und ein Paketverwaltungstool (Ruyi). Die Online-Softwarequelle Ruyi Repo speichert zentral die Kompilierungs-Toolkette, Debugging-Tools, Simulatoren, Laufumgebungen, Dokumente, Codes, Tools, Zielsystem-Images usw., die für die integrierte Entwicklungsumgebung RISC-V erforderlich sind; Das Paketmanager-Tool wird als Tool für die Interaktion mit Online-Softwarequellen verwendet und bietet eine Reihe von Befehlszeilenschnittstellen (Ruyi) oder grafischen Benutzeroberflächen (GUI wird möglicherweise in Zukunft bereitgestellt), um Entwicklern das Suchen, Installieren, Aktualisieren und zu ermöglichen Softwarepakete verwalten. Das Paketverwaltungstool ist dafür verantwortlich, Softwarepaketinformationen aus Online-Softwarequellen abzurufen, die Abhängigkeiten der Softwarepakete zu analysieren und den Download und die Installation von Abhängigkeiten automatisch zu verarbeiten.
- Ruyi Integrated Development Environment (Ruyi IDE) ist eine Toolbox, die speziell zum Entwickeln von Software und Anwendungen verwendet wird, die auf Geräten mit RISC-V-Architektur ausgeführt werden können. Kann Entwicklern helfen, ihre eigenen Programme zu schreiben und zu testen.

   Stellen Sie sich vor, Sie möchten eine Anwendung erstellen, die auf einem RISC-V-Gerät ausgeführt werden kann, beispielsweise die Entwicklung eines Bilderkennungsprogramms in der Sprache C oder C++. Ruyi IDE ist für Sie wie ein Studio, mit verschiedenen Tools, die Ihnen bei der Bewältigung dieser Aufgabe helfen können. Erstellen Sie zuerst das Projekt, laden Sie die erforderliche Kompilierungs-Toolkette, Debugging-Tools, den Simulator und andere Tools vom RuyiSDK-Paketmanager herunter und installieren Sie sie. Schließen Sie dann die Bearbeitung des Codes im Texteditor ab und kompilieren und erstellen Sie dann das Projekt, um RISC zu erhalten. V Das ausführbare Programm der Architektur wird schließlich auf dem Simulator oder dem RISC-V-Entwicklungsboard ausgeführt und getestet. Wenn der Code debuggt werden muss, können Sie zum Debuggen des Codes auch Debugging-Tools verwenden. Dieser Prozess stimmt mit den Entwicklungs-, Kompilierungs-, Konstruktions-, Debugging- und Ausführungsprozessen unter x86 überein, mit der Ausnahme, dass die RISC-V-Kompilierungstoolkette, der Simulator und andere Software und Tools, die für die aktuelle Entwicklungssprache und das Ziellaufgerät geeignet sind, heruntergeladen werden können Ruyi wird vom Paketmanager bezogen und während der Installation und der Ersteinrichtung der IDE in die integrierte Entwicklungsumgebung von Ruyi integriert, sodass Benutzer keine Energie für die Einrichtung der Umgebung aufwenden müssen.
- Die Ruyi Developer Exchange Community bietet Dokumente und Tutorials, Foren und technische Diskussionsbereiche, Blogs und Dokumente usw. Der Zweck besteht darin, eine offene Kommunikationsplattform für RISC-V-Entwickler bereitzustellen, gegenseitigen technischen Support und Ressourcenaustausch bereitzustellen und RISC-V zu sammeln Entwickler und treiben die Entwicklung des RISC-V-Ökosystems voran.
<!-- {.text-center} -->

{{% /blocks/section %}}


