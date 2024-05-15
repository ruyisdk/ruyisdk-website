---
title: RISCV Board and OS Supported Matrix
---

{{% blocks/section color="white" type="row" %}}

## 메인스트림 운영 체제 for RISC-V 하드웨어 적합도(메인스트림 RISC-V 개발 보드)

| CPU      | 제품 모델 번호                  | Arch Linux | Debian/RevyOS | Fedora | FreeBSD | Gentoo | openAnolis | OpenBSD | openCloudOS | openEuler | openKylin | openSUSE | Ubuntu | Tina-Linux | Android 13 | Armbian | BuildRoot | OpenHarmony | FreeRTOS | RT-Thread | Zephyr | OpenWRT | ThreadX | NuttX | Melis |
| --------- | -------------------------------- | ---------- | ------------- | ------ | ------- | ------ | ---------- | ------- | ----------- | --------- | --------- | -------- | ------ | ---------- | ---------- | ------- | --------- | ----------- | -------- | --------- | ------ | ------- | ------- | ----- | ----- |
| SG2042    | [Pioneer Box][Pioneer]           | N/A        | Good          | Good   | N/A     | N/A    | N/A        | N/A     | WIP         | Good      | Good      | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | WIP         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| CV1800B   | [Milk-V Duo (64M)][Duo]          | Basic      | Basic         | CFH    | N/A     | N/A    | N/A        | N/A     | N/A         | Basic     | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | Basic    | Basic     | N/A    | WIP     | Basic   | N/A   | N/A   |
| TH1520    | [LicheePi 4A][LPi4A]             | Good       | Good          | Good   | N/A     | N/A    | N/A        | N/A     | N/A         | Good      | Good      | N/A      | WIP    | N/A        | N/A        | Good    | N/A       | WIP         | N/A      | N/A       | N/A    | Basic   | N/A     | N/A   | N/A   |
| JH7100    | [VisionFive][VF1]                | N/A        | N/A           | Good   | N/A     | N/A    | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | N/A        | Basic   | Basic     | N/A         | N/A      | N/A       | N/A    | Basic   | N/A     | N/A   | N/A   |
| JH7110    | [VisionFive 2][VF2]              | Basic      | Good          | N/A    | WIP     | Basic  | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | WIP        | Good    | Basic     | WIP         | N/A      | Basic     | CFH    | Basic   | N/A     | Basic | N/A   |
| K230      | [CanMV K230][K230]               | N/A        | Basic         | Basic  | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | Basic  | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | Basic     | N/A    | N/A     | N/A     | Basic | N/A   |
| K510      | [Canaan K510-CRB-V1.2 KIT][K510] | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| C906      | [LicheeRV/AWOL Nezha][C906]      | N/A        | Good          | Good   | WIP     | N/A    | N/A        | N/A     | N/A         | Good      | N/A       | Basic    | Basic  | Basic      | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | Basic   | N/A     | N/A   | N/A   |
| U740      | [HiFive Unmatched][Unmatched]    | N/A        | Basic         | Good   | Basic   | N/A    | N/A        | Basic   | N/A         | Good      | Good      | Basic    | Basic  | N/A        | N/A        | CFH     | N/A       | WIP         | N/A      | N/A       | Basic  | Basic   | N/A     | N/A   | N/A   |
| SG2000    | [Milk-V Duo S][DuoS]             | N/A        | Basic         | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | Basic | N/A   |
| JH7110    | [Milk-V Mars][Mars]              | N/A        | CFT           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | CFT       | N/A         | CFT      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| FSL1030M  | [Milk-V Vega][Vega]              | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | CFH       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| TH1520    | [Milk-V Meles][Meles]            | N/A        | CFT           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| K210      | [Sipeed Maix-Bit][MaixBit]       | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | Basic | N/A   |
| TH1520    | [Lichee Cluster 4A][Cluster4A]   | N/A        | Good          | Good   | N/A     | N/A    | N/A        | N/A     | N/A         | Good      | Good      | N/A      | N/A    | N/A        | N/A        | Good    | N/A       | N/A         | N/A      | N/A       | N/A    | Basic   | N/A     | N/A   | N/A   |
| TH1520    | [Lichee Console 4A][Console4A]   | N/A        | Good          | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| SG2002    | [LicheeRV Nano][LicheeRVNano]    | N/A        | Basic         | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| AE350     | [Tang Mega 138K][TangMega138K]   | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | CFH    | N/A     | N/A     | N/A   | N/A   |
| BL808     | [Sipeed M1s Dock][SipeedM1s]     | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | Basic     | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| BL702     | [Sipeed M0 sense][M0sense]       | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| BL618     | [Sipeed M0P Dock][M0P]           | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| BL616     | [Sipeed M0s Dock][M0s]           | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | N/A       | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V103  | [CH32V103-EVT][CH32V103]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V203  | [CH32V203-EVT][CH32V203]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V208  | [CH32V208-EVT][CH32V208]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V303  | [CH32V303-EVT][CH32V303]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V305  | [CH32V305-EVT][CH32V305]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH32V307  | [CH32V307-EVT][CH32V307]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH582F    | [CH582F-EVT][CH582F]             | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| CH592X    | [CH592X-EVT][CH592X]             | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | Basic    | Basic     | N/A    | N/A     | N/A     | N/A   | N/A   |
| GD32VF103 | [Longan Nano][Longan_Nano]       | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | CFT      | CFT       | Basic  | N/A     | N/A     | N/A   | N/A   |
| GD32VF103 | [RV-STAR][RV_STAR]               | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | CFT      | CFT       | N/A    | N/A     | N/A     | N/A   | N/A   |
| GD32VF103 | [Nuclei DDR200T][DDR200T]        | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | CFT      | CFT       | N/A    | N/A     | N/A     | N/A   | N/A   |
| V853      | [全志 V853 开发板][V853]           | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | CFT   |
| V853      | [100ASK-V853-PRO][V853]          | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | CFT   |
| V851s     | [柚木 PI-蜥蜴][YouMuPI]           | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | CFT   |
| V851se    | [TinyVision][TinyVision]         | N/A        | N/A           | N/A    | N/A     | N/A    | N/A        | N/A     | N/A         | N/A       | N/A       | N/A      | N/A    | N/A        | N/A        | N/A     | N/A       | N/A         | N/A      | N/A       | N/A    | N/A     | N/A     | N/A   | CFT   |
#### 설명

* Good: 그래픽 인터페이스 지원
* Basic:작동가능
* CFH (Call for help) : 공식/포럼 자료 지원, 불통
* CFT (Call for testing) : 미러링크는 있으나 하드웨어 기기 검증이 부족함
* CFI (Call for more information) : 공식자료는 있으나 미러링 파일 등 실제 사용 가능한 자료는 찾을 수 없음
* WIP: 공식 OS가 곧/개발보드를 지원하고 있지만, 아직 미러링을 받을 수 없습니다.
* N/A: 공식 또는 기타 경로에서 아직 개발 보드 지원 정보를 얻지 못했습니다.

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
[MaixBit]: https://github.com/ruyisdk/support-matrix/blob/main/Maix-I_K210/README.md
[Cluster4A]: https://github.com/ruyisdk/support-matrix/blob/main/LicheeCluster4A/README.md
[Console4A]: https://github.com/ruyisdk/support-matrix/blob/main/LicheeConsole4A/README.md
[LicheeRVNano]: https://github.com/ruyisdk/support-matrix/blob/main/LicheeRV_Nano/README.md
[TangMega138K]: https://github.com/ruyisdk/support-matrix/blob/main/Tang_Mega_138K/README.md
[K510]: https://github.com/ruyisdk/support-matrix/blob/main/K510/README.md
[SipeedM1s]: https://github.com/ruyisdk/support-matrix/blob/main/M1s/README.md
[M0sense]: https://github.com/ruyisdk/support-matrix/blob/main/M0sense/README.md
[M0P]: https://github.com/ruyisdk/support-matrix/blob/main/M0P_Dock/README.md
[M0s]: https://github.com/ruyisdk/support-matrix/blob/main/M0s/README.md
[CH32V103]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V103/README.md
[CH32V203]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V203/README.md
[CH32V208]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V208/README.md
[CH32V303]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V303/README.md
[CH32V305]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V305/README.md
[CH32V307]: https://github.com/ruyisdk/support-matrix/blob/main/CH32V307/README.md
[CH582F]: https://github.com/ruyisdk/support-matrix/blob/main/CH582F/README.md
[CH592X]: https://github.com/ruyisdk/support-matrix/blob/main/CH592X/README.md
[Longan_Nano]: https://github.com/ruyisdk/support-matrix/blob/main/Longan_Nano/README.md
[RV_STAR]: https://github.com/ruyisdk/support-matrix/blob/main/RV_STAR/README.md
[DDR200T]: https://github.com/ruyisdk/support-matrix/blob/main/DDR200T/README.md
[V853]: https://github.com/ruyisdk/support-matrix/blob/main/V853/README.md
[100ASK]: https://github.com/ruyisdk/support-matrix/blob/main/100ASK/README.md
[YouMuPI]: https://github.com/ruyisdk/support-matrix/blob/main/YouMuPI/README.md
[TinyVision]: https://github.com/ruyisdk/support-matrix/blob/main/TinyVision/README.md


{{% /blocks/section %}}
