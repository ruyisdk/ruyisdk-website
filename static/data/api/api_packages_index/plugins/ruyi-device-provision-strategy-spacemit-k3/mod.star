RUYI = ruyi_plugin_rev(1)

load(
    "ruyi-plugin://internal-device-provisioner-common",
    _do_fastboot="do_fastboot",
    _do_fastboot_flash="do_fastboot_flash",
    _need_host_blkdevs_none="need_host_blkdevs_none",
)

load(
    "ruyi-plugin://internal-i18n-compat",
    _msg="msg",
)


def _m(msgid):
    ret = _msg("plugins/ruyi-device-provision-strategy-spacemit-k1/" + msgid)
    if not ret:
        ret = _msg("plugins/ruyi-device-provision-strategy-spacemit-k3/" + msgid)

    return ret


#def _pretend_spacemit_k3(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> list[str]:
def _pretend_spacemit_k3(img_paths, blkdev_paths):
    fsbl_path = img_paths["fsbl"]
    uboot_path = img_paths["uboot"]
    gpt_path = img_paths["gpt"]
    bootinfo_path = img_paths["bootinfo"]
    env_path = img_paths["env"]
    esos_path = img_paths["esos"]
    esp_path = img_paths["esp"]
    opensbi_path = img_paths["opensbi"]
    bootfs_path = img_paths["bootfs"]
    rootfs_path = img_paths["rootfs"]

    uboot_stage_path = uboot_path
    if "uboot_stage" in img_paths:
        uboot_stage_path = img_paths["uboot_stage"]

    msg_load = _m("pretend-load-to-device")
    msg_flash = _m("pretend-flash-to-partition")
    ret = [
        msg_load.format(what="FSBL", img_path=fsbl_path),
        msg_load.format(what="U-Boot", img_path=uboot_stage_path),
    ]

    if "mtd" in img_paths:
        ret.extend([
            msg_flash.format(img_path=img_paths["mtd"], part="mtd"),
            msg_flash.format(img_path=img_paths["bootinfo_mtd"], part="bootinfo"),

            msg_flash.format(img_path=fsbl_path, part="fsbl"),
            msg_flash.format(img_path=env_path, part="env"),
            msg_flash.format(img_path=esos_path, part="esos"),
            msg_flash.format(img_path=opensbi_path, part="opensbi"),
            msg_flash.format(img_path=uboot_path, part="uboot"),
        ])

    ret.extend([
        msg_flash.format(img_path=gpt_path, part="gpt"),
        msg_flash.format(img_path=env_path, part="env"),
        msg_flash.format(img_path=bootinfo_path, part="bootinfo"),
        msg_flash.format(img_path=fsbl_path, part="fsbl"),
        msg_flash.format(img_path=img_paths["esos"], part="esos"),
        msg_flash.format(img_path=opensbi_path, part="opensbi"),
        msg_flash.format(img_path=uboot_path, part="uboot"),
        msg_flash.format(img_path=esp_path, part="ESP"),
        msg_flash.format(img_path=bootfs_path, part="bootfs"),
        msg_flash.format(img_path=rootfs_path, part="rootfs"),
    ])

    return ret


#def _flash_spacemit_k3(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> int:
def _flash_spacemit_k3(img_paths, blkdev_paths):
    # Perform the equivalent of the following commands:
    #
    # sudo fastboot stage factory/FSBL.bin
    # sudo fastboot continue
    # # Wait for 1 sec
    # fastboot oem speed:super-speed
    # sudo fastboot stage u-boot.itb
    # sudo fastboot continue
    # # Wait for 1 sec
    #
    # # UEFI also
    # sudo fastboot flash mtd partition_4M.json
    # sudo fastboot flash bootinfo factory/bootinfo_spinor.bin
    # sudo fastboot flash fsbl factory/FSBL.bin
    # sudo fastboot flash env env.bin
    # sudo fastboot flash esos esos.itb
    # sudo fastboot flash opensbi fw_dynamic.itb
    # sudo fastboot flash uboot u-boot.itb/edk2.itb
    #
    # sudo fastboot flash gpt partition_universal.json
    # sudo fastboot flash env env.bin
    # sudo fastboot flash bootinfo factory/bootinfo_block.bin
    # sudo fastboot flash fsbl factory/FSBL.bin
    # sudo fastboot flash esos esos.itb
    # sudo fastboot flash opensbi fw_dynamic.itb
    # sudo fastboot flash uboot u-boot.itb/edk2.itb
    # sudo fastboot flash ESP esp.vfat
    # sudo fastboot flash bootfs bootfs.ext4
    # sudo fastboot flash rootfs rootfs.ext4
    #
    # See https://github.com/ruyisdk/packages-index/issues/200

    wait_secs = 1.0
    fsbl_img_path = img_paths["fsbl"]
    uboot_img_path = img_paths["uboot"]
    if "uboot_stage" in img_paths:
        uboot_img_path = img_paths["uboot_stage"]

    # Stage FSBL and continue
    RUYI.log.I(_m("staging-fsbl"))
    ret = _do_fastboot("stage", fsbl_img_path)
    if ret != 0:
        RUYI.log.F(_m("staging-fsbl-failed"))
        return ret

    RUYI.log.I(_m("continuing-to-fsbl"))
    ret = _do_fastboot("continue")
    if ret != 0:
        RUYI.log.F(_m("continuing-to-fsbl-failed"))
        return ret

    # Wait for 1 second
    RUYI.log.I(_m("wait-fsbl").format(wait_secs=wait_secs))
    RUYI.sleep(wait_secs)

    # # Do fastboot oem speed:super-speed
    # RUYI.log.I(_m("oem-super-speed"))
    # ret = _do_fastboot("oem", "speed:super-speed")
    # if ret != 0:
    #     RUYI.log.F(_m("oem-speed-failed"))

    # Stage u-boot and continue
    RUYI.log.I(_m("staging-uboot"))
    ret = _do_fastboot("stage", uboot_img_path)
    if ret != 0:
        RUYI.log.F(_m("staging-uboot-failed"))
        return ret

    RUYI.log.I(_m("continuing-to-uboot"))
    ret = _do_fastboot("continue")
    if ret != 0:
        RUYI.log.F(_m("continuing-to-uboot-failed"))
        return ret
        
    # Wait for 1 second
    RUYI.log.I(_m("wait-uboot").format(wait_secs=wait_secs))
    RUYI.sleep(wait_secs)

    # Flash all partitions
    partitions = []

    if "mtd" in img_paths:
        partitions.extend([
            ("mtd", img_paths["mtd"]),
            ("bootinfo", img_paths["bootinfo_mtd"]),

            ("fsbl", img_paths["fsbl"]),
            ("env", img_paths["env"]),
            ("esos", img_paths["esos"]),
            ("opensbi", img_paths["opensbi"]),
            ("uboot", img_paths["uboot"]),
        ])

    partitions.extend([
        ("gpt", img_paths["gpt"]),
        ("env", img_paths["env"]),
        ("bootinfo", img_paths["bootinfo"]),
        ("fsbl", img_paths["fsbl"]),
        ("esos", img_paths["esos"]),
        ("opensbi", img_paths["opensbi"]),
        ("uboot", img_paths["uboot"]),
        ("ESP", img_paths["esp"]),
        ("bootfs", img_paths["bootfs"]),
        ("rootfs", img_paths["rootfs"]),
    ])

    for partition, img_path in partitions:
        RUYI.log.I(_m("flashing-partition").format(part=partition))
        ret = _do_fastboot_flash(partition, img_path)
        if ret != 0:
            RUYI.log.F(_m("flashing-partition-failed").format(part=partition))
            return ret

    return 0


#
# Device Provisioning Strategy Plugin Interface
#

_spacemit_k3_v1 = {
    "priority": 10,
    "need_host_blkdevs_fn": _need_host_blkdevs_none,
    "need_cmd": ["sudo", "fastboot"],
    "pretend_fn": _pretend_spacemit_k3,
    "flash_fn": _flash_spacemit_k3,
}

PROVIDED_DEVICE_PROVISION_STRATEGIES_V1 = {
    "spacemit-k3-v1": _spacemit_k3_v1,
}
