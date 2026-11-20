RUYI = ruyi_plugin_rev(1)

load(
    "ruyi-plugin://internal-i18n-compat",
    _msg="msg",
)

#
# Helpers
#

def _m(msgid):
    return _msg("plugins/internal-device-provisioner-common/" + msgid)


#def call_subprocess_with_ondemand_elevation(argv: list[str]) -> int:
def call_subprocess_with_ondemand_elevation(argv):
    """Executes subprocess.call, asking for sudo if the subprocess fails for
    whatever reason.
    """

    RUYI.log.D("about to spawn subprocess: argv=" + repr(argv))
    ret = RUYI.call_subprocess_argv(argv)
    if ret == 0:
        return ret

    RUYI.log.W(_m("cmd-failed").format(ret=ret))
    if not RUYI.cli_ask_for_yesno_confirmation(_m("prompt-retry-sudo")):
        return ret

    RUYI.log.D("about to spawn subprocess with sudo: argv=['sudo'] + " + repr(argv))
    return RUYI.call_subprocess_argv(["sudo"] + argv)


def need_host_blkdevs_all(x):
    return x


def need_host_blkdevs_none(x):
    return []

#
# Implementation
#

def pretend_dd(
    img_paths,  # PartitionMapDecl
    blkdev_paths,  # PartitionMapDecl
):  # list[str]
    result = []
    msg_dd = _m("pretend-dd-to-blkdev")
    for part, img_path in img_paths.items():
        blkdev_path = blkdev_paths[part]
        result.append(
            msg_dd.format(img_path=img_path, blkdev_path=blkdev_path)
        )
    return result


#def do_dd(infile: str, outfile: str, blocksize: int = 4096) -> int:
def do_dd(infile, outfile, blocksize=4096):
    argv = [
        "dd",
        "if=" + infile,
        "of=" + outfile,
        "bs=" + str(blocksize),
    ]

    RUYI.log.I(_m("dd-to-blkdev").format(infile=infile, outfile=outfile, blocksize=blocksize))
    retcode = call_subprocess_with_ondemand_elevation(argv)
    if retcode == 0:
        RUYI.log.I(_m("file-flashed").format(outfile=outfile))
    else:
        RUYI.log.F(_m("flash-to-partition-failed").format(outfile=outfile))
        RUYI.log.W(_m("device-inconsistent"))

    return retcode


#def pretend_fastboot(img_paths: PartitionMapDecl, _: PartitionMapDecl) -> list[str]:
def pretend_fastboot(img_paths, blkdev_paths):
    msg_flash = _m("pretend-flash-to-partition")
    return [
        msg_flash.format(img_path=f, part=p) for p, f in img_paths.items()
    ]


#def do_fastboot(*args: str) -> int:
def do_fastboot(*args):
    argv = ["fastboot"]
    argv.extend(args)
    return call_subprocess_with_ondemand_elevation(argv)


#def do_fastboot_flash(part: str, img_path: str) -> int:
def do_fastboot_flash(part, img_path):
    RUYI.log.I(_m("flash-to-partition").format(img_path=img_path, part=part))
    ret = do_fastboot("flash", part, img_path)
    if ret != 0:
        RUYI.log.F(_m("part-flash-failed").format(part=part))
        RUYI.log.W(_m("device-inconsistent"))
    else:
        RUYI.log.I(_m("part-flashed").format(part=part))

    return ret
