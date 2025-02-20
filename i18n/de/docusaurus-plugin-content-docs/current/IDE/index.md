---
sidebar_position: 1
---

# Übersicht

## Einführung

RuyiSDK IDE ist eine grafische integrierte Entwicklungsumgebung, die auf der Open-Source-Software Eclipse basiert und sich hauptsächlich an RISC-V-Entwickler richtet. Dieses Tool plant, auf der Unterstützung von Eclipse für die Embedded-Entwicklung aufzubauen und schrittweise mehrere gängige SDKs für RISC-V-Entwicklungsboards zu integrieren, um die RISC-V-Entwicklung zu erleichtern.

## Installation und Start

### Download IDE

RuyiSDK IDE Download-Adresse: https://mirror.iscas.ac.cn/ruyisdk/ide

Laden Sie die neueste Version der IDE von der oben genannten Adresse herunter. Achten Sie darauf, das Installationspaket auszuwählen, das mit Ihrer Architektur übereinstimmt. Wenn Sie in einer x86_64-Umgebung entwickeln möchten, müssen Sie das neueste Paket `linux.gtk.x86_64.tar.gz` herunterladen; wenn Sie auf ARM-Geräten entwickeln möchten, benötigen Sie das Paket `linux.gtk.aarch64.tar.gz`; wenn Sie auf RISC-V-Geräten arbeiten möchten, laden Sie das Paket `linux.gtk.riscv64.tar.gz` herunter.

### Starten der IDE

Nach dem Entpacken führen Sie im Terminal `./ruyisdk` aus, um RuyiSDK IDE zu starten.

1. Entpacken Sie das heruntergeladene IDE-Paket an einen beliebigen Ort, wechseln Sie in das ruyisdk-Verzeichnis und führen Sie im Terminal `./ruyisdk` aus, um die IDE zu starten.
2. Anschließend wird die IDE Sie auffordern, einen Arbeitsbereich (WorkSpace) auszuwählen. Sie können ein neues Verzeichnis als Arbeitsbereich erstellen oder einen vorhandenen Arbeitsbereich angeben.
3. Klicken Sie dann auf die Schaltfläche `Launch`, um die IDE zu starten.
4. Nach einem erfolgreichen Start gelangen Sie in die IDE, und Sie können mit der Nutzung beginnen.

> Hinweis: RuyiSDK IDE hat openJDK (openJDK 21) integriert, um den Betrieb der Anwendung selbst zu ermöglichen, sodass keine zusätzliche JDK-Installation erforderlich ist. Dieses openJDK 21 wird hauptsächlich für den Betrieb von RuyiSDK IDE verwendet; für die von Ihnen erstellten Java-Projekte können Sie die erforderliche Java-Umgebung festlegen.

## Aktualisierung

Um RuyiSDK IDE zu verwenden, müssen Sie die neueste Version herunterladen, um die alte Version zu ersetzen. Beim Start der neuen IDE-Version können Sie den zuvor erstellten Arbeitsbereich auswählen, um frühere Arbeitsergebnisse zu importieren und die Entwicklung fortzusetzen.

## Dokumentationshinweise

1. Die Dokumentation von RuyiSDK IDE und die Screenshots in der Dokumentation basieren auf Ubuntu 22.04 LTS x86_64. Wenn Sie eine andere Umgebung verwenden, kann es zu Abweichungen kommen, die Sie selbst anpassen müssen.
2. RuyiSDK IDE wird derzeit im Entwicklungszweig gepflegt und erhält kontinuierliche Updates. Die Dokumentation wird mit der neuesten Version aktualisiert. Es wird empfohlen, immer die neueste Version herunterzuladen.