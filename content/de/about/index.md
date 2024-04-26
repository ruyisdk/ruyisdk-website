---
title: About
linkTitle: About
menu: {main: {weight: 10}}
---

{{% blocks/cover title="What is RuyiSDK?" image_anchor="bottom" height="auto" %}}

RUYISDK is a product plan designed to provide an all-in-one integrated development environment. Preparations will begin in 2023, and it is planned to provide RISC-V developers with a complete, full-featured development environment in three years.
{.mt-5}

{{% /blocks/cover %}}

{{% blocks/section %}}

## Goals of RUYISDK

1. Developers who purchase (almost) any RISC-V development board or module can obtain hardware documentation, firmware/software updates, debugging support, etc. through the RUYISDK system.
2. Developers can specify any commonly used RISC-V extended instruction set architecture combination, and can use the RUYISDK system to generate the operating system, tool chain, language execution environment (runtime or virtual machine), computing library, and application framework required by the customer wait. In particular, it is emphasized that RUYISDK will fully support draft standards (or manufacturer-customized extensions) such as Vector 0.7.1 and RVP 0.5.2 that have been siliconized on a large scale.
3. Cultivate and operate an active and comprehensive developer communication community.

{{% /blocks/section %}}
{{% blocks/section color="white" %}}

## RUYISDK architecture diagram

<img src=./1703147196780.png width=100% >
{{% /blocks/section %}}

{{% blocks/section color="primary" %}}

## Components of RuyiSDK

RuyiSDK mainly includes a component manager (also called Ruyi package manager), an integrated development environment (Ruyi IDE), and a developer communication community;

- Ruyi Component Manager includes an online software source (Ruyi repo) and a package management tool (ruyi). The online software source, Ruyi Repo, centrally stores the compilation tool chain, debugging tools, simulators, running environments, documents, codes, tools, target system images, etc. required for the RISC-V integrated development environment; the package manager tool is used As a tool for interacting with online software sources, it provides a set of command line interface (ruyi) or graphical user interface (GUI may be provided in the future) to enable developers to search, install, update and manage software packages. The package management tool is responsible for obtaining software package information from online software sources, parsing the dependencies of the software packages, and automatically processing the download and installation of dependencies.
- Ruyi Integrated Development Environment (Ruyi IDE) is a toolbox specifically used to develop software and applications that can run on RISC-V architecture devices. Can help developers write and test their own programs.

   Imagine that you want to make an application that can run on a RISC-V device, such as developing an image recognition program in C or C++ language. Ruyi IDE is like a studio for you, with various Tools can help you accomplish this task. First create the project, download and install the required compilation tool chain, debugging tools, simulator and other tools from the RuyiSDK package manager, then complete the editing of the code in the text editor, and then compile and build the project to obtain RISC-V The executable program of the architecture is finally run and tested on the simulator or RISC-V development board. If the code needs to be debugged, you can also use debugging tools to debug the code. This process is consistent with the development, compilation, construction, debugging, and running processes under x86, except that the RISC-V compilation tool chain, simulator and other software and tools suitable for the current development language and target running device can be downloaded from Ruyi Obtained from the package manager, it has been integrated into the Ruyi integrated development environment during installation and IDE initial setup, so users do not need to spend energy on setting up the environment.
- The Ruyi Developer Exchange Community provides documents and tutorials, forums and technical discussion areas, blogs and documents, etc. The purpose is to provide an open communication platform for RISC-V developers, provide mutual technical support and resource sharing, and gather RISC-V developers and driving the development of the RISC-V ecosystem.
<!-- {.text-center} -->

{{% /blocks/section %}}


