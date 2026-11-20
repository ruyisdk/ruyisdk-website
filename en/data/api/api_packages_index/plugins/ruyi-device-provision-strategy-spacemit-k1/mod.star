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
    return _msg("plugins/ruyi-device-provision-strategy-spacemit-k1/" + msgid)


#def _pretend_spacemit_k1(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> list[str]:
def _pretend_spacemit_k1(img_paths, blkdev_paths):
    fsbl_path = img_paths["fsbl"]
    uboot_path = img_paths["uboot"]
    gpt_path = img_paths["gpt"]
    bootinfo_path = img_paths["bootinfo"]
    env_path = img_paths["env"]
    opensbi_path = img_paths["opensbi"]
    bootfs_path = img_paths["bootfs"]
    rootfs_path = img_paths["rootfs"]

    msg_load = _m("pretend-load-to-device")
    msg_flash = _m("pretend-flash-to-partition")
    ret = [
        msg_load.format(what="FSBL", img_path=fsbl_path),
        msg_load.format(what="U-Boot", img_path=uboot_path),
        msg_flash.format(img_path=gpt_path, part="gpt"),
        msg_flash.format(img_path=bootinfo_path, part="bootinfo"),
        msg_flash.format(img_path=fsbl_path, part="fsbl"),
        msg_flash.format(img_path=env_path, part="env"),
        msg_flash.format(img_path=opensbi_path, part="opensbi"),
        msg_flash.format(img_path=uboot_path, part="uboot"),
    ]

    if "esp" in img_paths:
        ret.extend([
            msg_flash.format(img_path=img_paths["esp"], part="ESP"),
            msg_flash.format(img_path=img_paths["bootfs_linux"], part="bootfs_linux"),
            msg_flash.format(img_path=img_paths["rootfs_linux"], part="rootfs_linux"),
        ])

    ret.extend([
        msg_flash.format(img_path=bootfs_path, part="bootfs"),
        msg_flash.format(img_path=rootfs_path, part="rootfs"),
    ])

    return ret


#def _flash_spacemit_k1(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> int:
def _flash_spacemit_k1(img_paths, blkdev_paths):
    # Perform the equivalent of the following commands:
    #
    # sudo fastboot stage factory/FSBL.bin
    # sudo fastboot continue
    # # Wait for 1 sec
    # sudo fastboot stage u-boot.itb
    # sudo fastboot continue
    # # Wait for 1 sec
    #
    # sudo fastboot flash gpt partition_universal.json
    # sudo fastboot flash bootinfo factory/bootinfo_sd.bin
    # sudo fastboot flash fsbl factory/FSBL.bin
    # sudo fastboot flash env env.bin
    # sudo fastboot flash opensbi fw_dynamic.itb
    # sudo fastboot flash uboot u-boot.itb
    #
    # # For UEFI image, also
    # # See https://github.com/ruyisdk/packages-index/issues/197
    # sudo fastboot flash ESP efi.img
    # sudo fastboot flash bootfs_linux bootfs_linux.img
    # sudo fastboot flash rootfs_linux rootfs_linux.ext4
    #
    # sudo fastboot flash bootfs bootfs.ext4
    # sudo fastboot flash rootfs rootfs.ext4
    #
    # See https://github.com/ruyisdk/ruyi/issues/289

    wait_secs = 1.0
    fsbl_img_path = img_paths["fsbl"]
    uboot_img_path = img_paths["uboot"]

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
    partitions = {
        "gpt": img_paths["gpt"],
        "bootinfo": img_paths["bootinfo"],
        "fsbl": img_paths["fsbl"],
        "env": img_paths["env"],
        "opensbi": img_paths["opensbi"],
        "uboot": img_paths["uboot"],
    }

    if "esp" in img_paths:
        partitions.update({
            "ESP": img_paths["esp"],
            "bootfs_linux": img_paths["bootfs_linux"],
            "rootfs_linux": img_paths["rootfs_linux"],
        })

    partitions.update({
        "bootfs": img_paths["bootfs"],
        "rootfs": img_paths["rootfs"],
    })

    for partition, img_path in partitions.items():
        RUYI.log.I(_m("flashing-partition").format(part=partition))
        ret = _do_fastboot_flash(partition, img_path)
        if ret != 0:
            RUYI.log.F(_m("flashing-partition-failed").format(part=partition))
            return ret

    return 0


#
# Device Provisioning Strategy Plugin Interface
#

_spacemit_k1_v1 = {
    "priority": 10,
    "need_host_blkdevs_fn": _need_host_blkdevs_none,
    "need_cmd": ["sudo", "fastboot"],
    "pretend_fn": _pretend_spacemit_k1,
    "flash_fn": _flash_spacemit_k1,
}

PROVIDED_DEVICE_PROVISION_STRATEGIES_V1 = {
    "spacemit-k1-v1": _spacemit_k1_v1,
}
