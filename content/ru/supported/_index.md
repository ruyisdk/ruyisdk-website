---
title: RISCV Board and OS Supported Matrix
---

{{% blocks/section color="white" type="row" %}}

## Основные операционные системы для адаптации оборудования RISC-V (основные платы разработки RISC-V)

| CPU      | Номер продукта                      | Arch Linux | Debian/RevyOS | Fedora | FreeBSD | Gentoo | openAnolis | OpenBSD | openCloudOS | openEuler | openKylin | openSUSE | Ubuntu | Tina-Linux | Android 13 | Armbian | BuildRoot | OpenHarmony | FreeRTOS | RT-Thread | Zephyr | OpenWRT | ThreadX |
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

#### Примечания

* Good：Поддержка графического интерфейса
* Basic：Можно начать бегать
* CFH (Call for help)：Официальная информация/информация на форуме указывает на поддержку, но она не была реализована.
* CFT (Call for testing)：Зеркальная ссылка есть, но отсутствует проверка аппаратного устройства.
* CFI (Call for more information)：Официальная информация утверждает, что существует, но никакой реальной полезной информации, такой как файлы изображений, найти не удалось.
* WIP：Официальное объявление заключается в том, что операционная система скоро будет поддерживать платы для разработки, но доступных образов пока получено не было.
* N/A：Никакой информации о поддержке платы разработки не было получено ни по официальным, ни по другим каналам.

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
