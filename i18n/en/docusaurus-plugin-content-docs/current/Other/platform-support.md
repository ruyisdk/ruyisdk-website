# Platform Support Status of RuyiSDK

Due to practical factors such as project management, including the requirements of RuyiSDK project stakeholders and considerations of team support costs, the RuyiSDK team has adopted a tiered platform support strategy for processor architectures, operating systems, and their distributions in the market.

For convenience, we use the term **"best-effort"** (formatted in bold, as in: **best-effort**) to indicate that if the RuyiSDK team or third parties notice any issues that do not meet expectations, such issues will be addressed.

This document was last updated in November 2024. The stakeholders of the RuyiSDK project and the RuyiSDK team currently reserve the right to interpret and revise the content of this document.

## Processor Architectures

RuyiSDK's support for processor architectures is divided into three tiers.

* **Tier 1**: Architectures with guaranteed support.
    * A single-executable RuyiSDK package manager will be provided for architectures at this tier to allow users to try it out.
    * The RuyiSDK official software repository will comprehensively provide binary packages for architectures at this tier within a reasonable scope.
    * RuyiSDK's CI will provide comprehensive automated quality assurance for architectures at this tier.
    * The RuyiSDK mainline will accept code and other contributions for architectures at this tier.
* **Tier 2**: Architectures with best-effort support.
    * The RuyiSDK team will **best-effort** provide a single-executable RuyiSDK package manager for architectures at this tier.
    * The RuyiSDK official software repository will **best-effort** provide binary packages for architectures at this tier within a reasonable scope.
    * RuyiSDK CI will **best-effort** provide automated quality assurance for architectures at this tier.
    * The RuyiSDK mainline will **best-effort** accept code and other contributions for architectures at this tier.
* **Tier 3**: Unofficially supported architectures.
    * The RuyiSDK team does not actively produce binary packages for architectures at this tier.
    * RuyiSDK CI does not actively provide automated quality assurance for architectures at this tier.
    * The RuyiSDK mainline may accept code and other contributions for architectures at this tier in principle, but based on a case-by-case evaluation, contributions may also be rejected due to maintenance costs and other considerations.
    * The RuyiSDK team welcomes community efforts to maintain "parallel universe" RuyiSDK infrastructure for architectures in need.

Tier 1 and Tier 2 supported architectures can be collectively referred to as "officially supported architectures," while Tier 3 supported architectures are referred to as "unofficially supported architectures."

The current processor architecture support status is as follows. Architectures within each tier are listed in alphabetical order.

**Tier 1:**
* RISC-V 64
* x86_64

**Tier 2:**
* AArch64

**Tier 3:**
All architectures not mentioned above fall into this tier.

For Tier 3 architectures, the RuyiSDK team may not be able to provide a RuyiSDK package manager or binary packages in the RuyiSDK official software repository. Users with specific needs are encouraged to organize themselves to provide "parallel universe" RuyiSDK software repositories, package manager ports, and other infrastructure for their architectures. A "parallel universe" refers to an independent fork that is not affiliated with the RuyiSDK team but still attempts to maintain some level of consistency with the official RuyiSDK behavior.

When packaging, the RuyiSDK team encourages these projects to maintain consistency or compatibility with the official software repository in terms of package names, versions, and build parameters. However, as equal entities, the team acknowledges that this cannot be enforced.

## Operating Systems and Distributions

RuyiSDK's operating system support is also divided into three tiers.

* **Tier 1**: Operating systems with guaranteed support.
    * The RuyiSDK package manager is guaranteed to work on systems at this tier.
    * Software packages in the RuyiSDK official software repository are guaranteed to work on systems at this tier.
* **Tier 2**: Operating systems with best-effort support.
    * The RuyiSDK team will **best-effort** ensure that the RuyiSDK package manager works on systems at this tier.
    * The RuyiSDK team will **best-effort** ensure that software packages in the RuyiSDK official software repository work on systems at this tier.
* **Tier 3**: Unofficially supported operating systems.
    * The RuyiSDK team does not actively ensure that the RuyiSDK package manager works on systems at this tier.
    * The RuyiSDK team does not actively ensure that software packages in the RuyiSDK official software repository work on systems at this tier.
    * The above two points hold true even if the system's processor architecture is at Tier 1 or Tier 2.
    * The RuyiSDK mainline may accept code and other contributions for systems at this tier in principle, but based on a case-by-case evaluation, contributions may also be rejected due to maintenance costs and other considerations.
    * The RuyiSDK team welcomes community efforts to maintain "parallel universe" RuyiSDK infrastructure for systems in need.

Tier 1 and Tier 2 supported systems (distributions) can be collectively referred to as "officially supported systems (distributions)," while Tier 3 supported systems (distributions) are referred to as "unofficially supported systems (distributions)."

The current operating system and distribution support status is as follows. Distributions within each tier are listed in alphabetical order.

**Tier 1:**
* Debian: The most recent 1 version.
    * Debian 12
* openEuler: The most recent 1 long-term support (LTS) version.
    * openEuler 24.03 LTS
* RevyOS: Aligned with RevyOS support for LicheePi 4A and Pioneer Box.
* RedleafOS: The most recent 1 version.
* Ubuntu: The most recent 2 long-term support (LTS) versions.
    * Ubuntu 22.04
    * Ubuntu 24.04

**Tier 2:**
* Arch Linux: Follows rolling releases.
* deepin: The most recent 1 version.
    * deepin 23
* Fedora: Versions released within the past year.
    * Fedora 40
    * Fedora 41

Linux distributions that fall into Tier 1 or Tier 2 in terms of type but whose versions are not within the mentioned scope also belong to this tier.

**Tier 3:**
Linux distributions not mentioned in Tier 1 or Tier 2, as well as non-Linux kernel operating systems, all belong to this tier.

For Tier 3 Linux distributions on officially supported architectures, the RuyiSDK package manager and software packages provided by the RuyiSDK official software repository may still function properly, but we do not provide automated guarantees for this.

For other operating systems on officially supported architectures, such as macOS or Windows, users will need to configure a Linux environment themselves to use the official products of the RuyiSDK team. Users with specific needs are encouraged to organize themselves to add and maintain support for these operating systems in forks of RuyiSDK components.