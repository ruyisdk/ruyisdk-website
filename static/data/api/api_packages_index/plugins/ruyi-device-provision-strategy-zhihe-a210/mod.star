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
    ret = _msg("plugins/ruyi-device-provision-strategy-std/" + msgid)
    if not ret:
        ret = _msg("plugins/ruyi-device-provision-strategy-spacemit-k1/" + msgid)
    if not ret:
        ret = _msg("plugins/ruyi-device-provision-strategy-zhihe-a210/" + msgid)

    return ret


#def _pretend_zhihe_a210(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> list[str]:
def _pretend_zhihe_a210(img_paths, blkdev_paths):
    spl_path = img_paths["spl"]
    gpt_path = img_paths["gpt"]
    mmc0boot0_path = img_paths["mmc0boot0"]
    uboot_env_path = img_paths["uboot_env"]
    boot_path = img_paths["boot"]
    system_path = img_paths["system"]
    app_path = img_paths["app"]
    data_path = img_paths["data"]

    ret = []
    if "bootzero" in img_paths:
        bootzero_path = img_paths["bootzero"]
        ret.extend([
            _m("pretend-flash-to-ram").format(img_path=bootzero_path),
            _m("pretend-reboot"),
        ])

    ret.extend([
        _m("pretend-flash-to-ram").format(img_path=spl_path),
        _m("pretend-reboot"),
    ])

    msg_flash = _m("pretend-flash-to-partition")
    ret.extend([
        msg_flash.format(img_path=gpt_path, part="gpt"),
        msg_flash.format(img_path=mmc0boot0_path, part="mmc0boot0"),
        msg_flash.format(img_path=uboot_env_path, part="uboot_env"),
        msg_flash.format(img_path=boot_path, part="boot"),
        msg_flash.format(img_path=system_path, part="system"),
        msg_flash.format(img_path=app_path, part="app"),
        msg_flash.format(img_path=data_path, part="data"),
    ])

    return ret


#def _flash_zhihe_a210(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> int:
def _flash_zhihe_a210(img_paths, blkdev_paths):
    # Perform the equivalent of the following commands:
    #
    # # If bootzero-rvbl.bin exists
    # fastboot flash ram bootzero-rvbl.bin
    # fastboot reboot
    #
    # fastboot flash ram spl-with-fit-rvbl.bin
    # fastboot reboot
    # # Wait for 5 sec
    #
    # fastboot flash gpt emmc-gpt_primary.img
    # fastboot flash mmc0boot0 emmc_boot-loader.img
    # fastboot flash uboot_env emmc-uboot_env.img
    # fastboot flash boot emmc-boot_a.img
    # fastboot flash system emmc-system_a.img
    # fastboot flash app emmc-app_a.img
    # fastboot flash data emmc-data.img
    #
    # See `fastboot_images.bat` in image tarball

    wait_secs = 5.0
    spl_img_path = img_paths["spl"]

    # Flash bootzero and reboot
    if "bootzero" in img_paths:
        bootzero_img_path = img_paths["bootzero"]
        RUYI.log.I(_m("flashing-bootzero-ram"))
        ret = _do_fastboot("flash", "ram", bootzero_img_path)
        if ret != 0:
            RUYI.log.F(_m("flashing-bootzero-ram-failed"))
            RUYI.log.W(_m("recheck"))
            return ret

        RUYI.log.I(_m("rebooting-to-bootzero"))
        ret = _do_fastboot("reboot")
        if ret != 0:
            RUYI.log.F(_m("reboot-failed"))
            RUYI.log.W(_m("recheck"))
            return ret

    # Flash SPL and reboot
    RUYI.log.I(_m("flashing-spl-ram"))
    ret = _do_fastboot("flash", "ram", spl_img_path)
    if ret != 0:
        RUYI.log.F(_m("flashing-spl-ram-failed"))
        RUYI.log.W(_m("recheck"))
        return ret

    RUYI.log.I(_m("rebooting-to-spl"))
    ret = _do_fastboot("reboot")
    if ret != 0:
        RUYI.log.F(_m("reboot-failed"))
        RUYI.log.W(_m("recheck"))
        return ret

    # Wait for 5 second
    RUYI.log.I(_m("wait-spl").format(wait_secs=wait_secs))
    RUYI.sleep(wait_secs)

    # Flash all partitions
    partitions = [
        ("gpt", img_paths["gpt"]),
        ("mmc0boot0", img_paths["mmc0boot0"]),
        ("uboot_env", img_paths["uboot_env"]),
        ("boot", img_paths["boot"]),
        ("system", img_paths["system"]),
        ("app", img_paths["app"]),
        ("data", img_paths["data"]),
    ]

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

_zhihe_a210_v1 = {
    "priority": 10,
    "need_host_blkdevs_fn": _need_host_blkdevs_none,
    "need_cmd": ["sudo", "fastboot"],
    "pretend_fn": _pretend_zhihe_a210,
    "flash_fn": _flash_zhihe_a210,
}

PROVIDED_DEVICE_PROVISION_STRATEGIES_V1 = {
    "zhihe-a210-v1": _zhihe_a210_v1,
}
