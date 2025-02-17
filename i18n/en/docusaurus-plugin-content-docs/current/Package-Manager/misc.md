---
sidebar_position: 6
---

# More Information

## Updating the Ruyi Package Manager

If you installed the Ruyi Package Manager using the precompiled single binary, simply download the new version of the binary and re-execute the installation process to overwrite the old version of the Ruyi Package Manager binary.

If you installed the Ruyi Package Manager using the system package manager, you can directly upgrade it using the system package manager:

```bash
$ sudo pacman -Syuu
```

This command will perform a comprehensive upgrade on Arch Linux. Note that Arch Linux does not support partial upgrades.

## Uninstalling the Ruyi Package Manager

If you installed the Ruyi Package Manager using the system package manager, please use the system package manager to uninstall it.

If you installed the Ruyi Package Manager using the precompiled single binary, you can use the following command to uninstall the Ruyi Package Manager:

```bash
$ ruyi self uninstall
```

This command will prompt for a secondary confirmation of the operation. If you wish for the Ruyi Package Manager to execute without asking:

```bash
$ ruyi self uninstall -y
```

The above command only removes the Ruyi Package Manager itself. If you wish to delete all caches and installed packages for a clean uninstallation:

```bash
$ ruyi self uninstall --purge
```

Similarly, this command will prompt for a secondary confirmation of the operation. If you wish for the Ruyi Package Manager to execute without asking:

```bash
$ ruyi self uninstall --purge -y
```

The Ruyi Package Manager is designed to avoid operations that require superuser privileges. If the Ruyi Package Manager is installed in directories such as ``/usr/local/bin/`` that require superuser privileges to modify, the ``ruyi self uninstall`` command will fail.

In this case, you can manually delete all caches and installed packages (they are installed in the home directory and thus do not require superuser privileges to delete):

```bash
$ ruyi self clean --all
```

Then manually delete the Ruyi Package Manager itself.

## Reporting Issues

Submit an issue in the Ruyi Package Manager repository [here](https://github.com/ruyisdk/ruyi/issues/new).

## Telemetry Data Collection

The Ruyi Package Manager collects some operational data from users through telemetry data collection to better understand user usage and improve the Ruyi Package Manager accordingly.
You can choose whether to enable telemetry data collection by setting the `RUYI_TELEMETRY_OPTOUT` environment variable. `1`, `true`, or `yes` represents disabling telemetry, which is the same as `off` mentioned below; by default, telemetry data collection is enabled.

There are three levels of telemetry data collection:

- `local`: Only saves telemetry data locally and will not send it to a remote server without explicit user consent.
- `on`: Sends telemetry data to a remote server.
- `off`: Disables telemetry data collection.

By default, the telemetry data collection level is `on`, meaning that each `ruyi` call records some non-sensitive operational data and some status information of `ruyi`, and sends it weekly to a remote server managed by `RuyiSDK` in mainland China. The upload occurs on a random day determined by an anonymous installation ID.

You can edit the `ruyi` configuration file or simply set the telemetry data collection level through environment variables.

We collect the following data:

* Basic information of the machine running:
    * Architecture and OS
    * If the architecture is RISC-V:
        * ISA capabilities
        * Development board model
        * Number of logical CPUs
    * OS release ID (approximately equivalent to the distribution type)
    * Type and version of libc
    * Type of shell (bash, fish, zsh, etc.)
* Version of `ruyi` at the time of data upload
* Different invocation patterns of `ruyi` subcommands:
    * No parameters are exposed
    * Granularity of invocation time is 1 minute

You can view our privacy policy on the RuyiSDK official website.