---
title: RISCV Board and OS Supported Matrix
---

{{% blocks/section color="white" type="row" %}}

## Mainstream operating systems for RISC-V hardware adaptation (mainstream RISC-V development boards)

| CPU      | Product number                      | Arch Linux | Debian/RevyOS | Fedora | FreeBSD | Gentoo | openAnolis | OpenBSD | openCloudOS | openEuler | openKylin | openSUSE | Ubuntu | Tina-Linux | Android 13 | Armbian | BuildRoot | OpenHarmony | FreeRTOS | RT-Thread | Zephyr | OpenWRT | ThreadX |
|----------|-------------------------------|------------|---------------|--------|---------|--------|------------|---------|-------------|-----------|-----------|----------|--------|------------|------------|---------|-----------|-------------|----------|-----------|--------|---------|---------|
| SG2042   | [Pioneer Box][Pioneer]        | N/A        | Good          | Good   | N/A     | N/A    | N/A        | N/A     | WIP         | Good      | Good      | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | WIP         | N/A      | N/A       | N/A    | N/A     | N/A     |
| CV1800B  | [Milk-V Duo (64M)][Duo]       | Basic      | Basic         | CFH    | N/A     | N/A    | N/A        | N/A     | N/A         | Basic     | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | Basic    | Basic     | N/A    | WIP     | N/A     |
| TH1520   | [LicheePi 4A][LPi4A]          | Good       | Good          | Good   | N/A     | N/A    | N/A        | N/A     | N/A         | Good      | Good      | N/A      | WIP    | N/A        | N/A        | Good    | N/A       | WIP         | N/A      | N/A       | N/A    | Basic   | N/A     |
| JH7100   | [VisionFive][VF1]             | N/A        | N/A           | Good   | N/A     | N/A    | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | N/A        | Basic   | CFT       | N/A         | CFT      | N/A       | N/A    | Basic   | N/A     |
| JH7110   | [VisionFive 2][VF2]           | Basic      | Good          | N/A    | WIP     | Basic  | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | WIP        | Good    | Basic     | WIP         | N/A      | CFT       | CFT    | CFT     | N/A     |
| K230     | [CanMV K230][K230]            | N/A        | Basic         | Basic  | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | Basic  | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | CFT       | N/A    | N/A     | N/A     |
| C906     | [LicheeRV/AWOL Nezha][C906]   | N/A        | Good          | Good   | WIP     | N/A    | N/A        | N/A     | N/A         | Good      | N/A       | Basic    | Basic  | Basic      | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | Basic   | N/A     |
| U740     | [HiFive Unmatched][Unmatched] | N/A        | Basic         | CFT    | Basic   | N/A    | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | N/A        | CFH     | N/A       | WIP         | N/A      | N/A       | Basic  | Basic   | N/A     |
| SG2000   | [Milk-V Duo S][DuoS]          | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | CFT      | N/A       | N/A    | N/A     | N/A     |
| JH7110   | [Milk-V Mars][Mars]           | N/A        | CFT           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | CFT       | N/A         | CFT      | N/A       | N/A    | N/A     | N/A     |
| FSL1030M | [Milk-V Vega][Vega]           | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | CFH       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     |
| TH1520   | [Milk-V Meles][Meles]         | N/A        | CFT           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     |

#### Notes

* Good：Support graphical interface
* Basic：Can start running
* CFH (Call for help)：Official/forum information indicates support, but it has not been run through.
* CFT (Call for testing)：There is a mirror link, but there is a lack of hardware device verification.
* CFI (Call for more information)：Official information claims that there is, but no actual usable information such as image files can be found.
* WIP：The official announcement is that the operating system will soon/is supporting development boards, but no available images have been obtained yet.
* N/A：No support information for the development board has been obtained from official or other channels.

[Pioneer]: https://github.com/ruyisdk/support-matrix/blob/main/Pioneer/README.md
[Duo]: https://github.com/ruyisdk/support-matrix/blob/main/Duo/README.md
[LPi4A]: https://github.com/ruyisdk/support-matrix/blob/main/LicheePi4A/README.md
[VF1]: https://github.com/ruyisdk/support-matrix/blob/main/VisionFive/README.md
[VF2]: https://github.com/ruyisdk/support-matrix/blob/main/VisionFive2/README.md
[K230]: https://github.com/ruyisdk/support-matrix/blob/main/K230/README.md
[C906]: https://github.com/ruyisdk/support-matrix/blob/main/D1_LicheeRV/README.md
[Unmatched]: https://github.com/ruyisdk/support-matrix/blob/main/Unmatched/README.md
[DuoS]: https://github.com/ruyisdk/support-matrix/blob/main/Duo_S/README.md
[Mars]: https://github.com/ruyisdk/support-matrix/blob/main/Mars/README.md
[Vega]: https://github.com/ruyisdk/support-matrix/blob/main/Vega/README.md
[Meles]: https://github.com/ruyisdk/support-matrix/blob/main/Meles/README.md

{{% /blocks/section %}}
