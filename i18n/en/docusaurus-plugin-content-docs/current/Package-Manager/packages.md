---
sidebar_position: 3
---

# Managing Ruyi Packages

## Refreshing Local Package Cache

Fetch the contents of remote package repositories and refresh the local package cache. By default, the mirror hosted on GitHub is used:

```bash
$ ruyi update
```

The package cache will be stored in the user's home directory, typically at ``~/.cache/ruyi/packages-index/``. If the ``XDG_CACHE_HOME`` environment variable is set, the directory will be ``$XDG_CACHE_HOME/ruyi/packages-index/``.

### ``ruyi update`` Pull Failure

Since the package index information is currently hosted on a GitHub repository, if there are issues with repository access instability, you can configure the use of an [alternative repository](https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git) in the configuration file.

The Ruyi package manager's configuration file is by default located at ``~/.config/ruyi/config.toml``, or at ``$XDG_CONFIG_HOME/ruyi/config.toml`` if ``XDG_CONFIG_HOME`` is configured. If the file does not exist, you can create it manually.

```
[repo]
local = ""
remote = "https://mirror.iscas.ac.cn/git/ruyisdk/packages-index.git"
branch = "main"
```

Here, ``local`` refers to the local cache directory, ``remote`` is the URL of the remote mirror repository, and ``branch`` is the git branch of the mirror.

After saving the configuration, try refreshing the local cache again:

```bash
$ ruyi update
```

## Reading News

When you ran ``ruyi update`` in the previous section to refresh the local package repository, you likely noticed that the Ruyi package manager listed unread news items. This is where you can stay informed about updates to Ruyi packages or other important notifications.

Running ``ruyi news list`` will also bring up this page, but it will display all news items, with unread ones highlighted in green on supported terminals.

You can use the following commands to browse, read news, and mark them as read:

```bash
$ ruyi news list -h
$ ruyi news list
$ ruyi news list --new        # List only unread news

$ ruyi news read -h
$ ruyi news read 1            # Read news with ID 1
$ ruyi news read              # Read all unread news
$ ruyi news read --quiet      # Output nothing, only mark unread news as read
```

Ruyi marks news as read by storing the news titles in ``~/.local/state/ruyi/news.read.txt``, or at ``$XDG_STATE_HOME/ruyi/news.read.txt`` if ``XDG_STATE_HOME`` is configured.

## Listing Packages

Ruyi packages are broadly categorized into several sections:

- toolchain: Toolchains
- source: Source packages
- emulator: Emulators
- board-image: System images
- analyzer: Analysis tools
- extra: Miscellaneous

Package version numbers strictly follow the Semver specification, which may result in some differences from upstream versions.

Packages are divided into officially released packages and prerelease packages. Prerelease packages are released earlier than their upstream counterparts but include bug fixes for the latest released version.

Some older Ruyi packages also use slugs to mark versions, a deprecated feature that will be removed in the future.

Use the ``ruyi list`` command to list all available packages. Note that even if a package/version is not supported on the current system architecture, it will still be listed.

Here is an example on an ``x86_64`` machine; the actual list will be longer:

```bash
$ ruyi list --name-contains ''
List of available packages:

* source/milkv-duo-examples
  - 0.20240719.0+git.52ae647a (latest)
* source/ruyisdk-demo
  - 0.20231114.0 (latest)
* source/coremark
  - 1.0.2-pre.20230125 (prerelease, latest-prerelease)
  - 1.0.1 (latest)
* toolchain/llvm-plct
  - 17.0.6-ruyi.20240511 (latest)
* toolchain/llvm-upstream
  - 17.0.5-ruyi.20231121 (latest) slug: llvm-upstream-20231121
* toolchain/gnu-milkv-milkv-duo-elf-bin
  - 0.20240731.0+git.67688c7335e7 (latest)
* analyzer/dynamorio-riscv
  - 10.93.19979-ruyi.20240914 (latest, no binary for current host)
  - 10.0.19748-ruyi.20240128 (no binary for current host)
* board-image/uboot-revyos-sipeed-lc4a-8g
  - 0.20240127.0 (latest)
* board-image/uboot-oerv-sipeed-lpi4a-8g
  - 0.2309.1 (latest)
* board-image/canmv-linux-sdk-demo-canaan-k230d-rv64ilp32
  - 0.20240731.0 (latest)
  - 0.20240717.0 ()
* emulator/qemu-user-riscv-xthead
  - 6.1.0-ruyi.20231207+g03813c9fe8 (latest)
* emulator/box64-upstream
  - 0.3.1-pre.ruyi.20240901+git.9178effd (prerelease, latest-prerelease, no binary for current host)
  - 0.3.0-ruyi.20240718 (latest, no binary for current host)
  - 0.2.9-pre.ruyi.20240702+git.4b0b3fc9 (prerelease, no binary for current host)
  - 0.2.8-ruyi.20240702 (no binary for current host)
* emulator/qemu-user-riscv-upstream
  - 8.2.0-ruyi.20240128 (latest)
  - 8.1.2-ruyi.20231121 ()
* extra/wps-office
  - 12.1.0-r.17900 (latest)
  - 12.1.0-r.17885 ()
```

The ``list`` command also provides the ``--verbose`` or ``-v`` option to output more detailed information, which will print almost all information from the package repository. Since the full output will be very long, it is recommended to pass a non-empty search field to ``--name-contains``, add other limiting parameters, or redirect the full output to a file or a tool such as ``less``.

Lines like ``toolchain/llvm-plct`` represent a package name, which is required when using the ``install`` command to install the package. In most cases, specifying only the name after the ``/`` is sufficient, such as ``llvm-plct`` in this example.

Following the package name is a list of version numbers. Version numbers can be used to specify a particular version of a package or versions that match a given expression. The content in parentheses after the version number marks some information about that version.

### ``latest``

Marks the latest version of a package, which is the version that the ``install`` command will install by default.

### ``prerelease``

A prerelease version. This means the package was released earlier than its upstream counterpart, often including bug fixes for the latest released version, especially when a prerelease version is deemed necessary.

By default, the Ruyi package manager ignores prerelease versions. You can configure the Ruyi package manager to install prerelease versions, but you assume the associated risks.

### ``latest-prerelease``

The latest prerelease version. When prerelease versions are allowed and this version is newer than the ``latest`` version, it will be the version installed by default by the ``install`` command.

If you need to install a prerelease version, you can add the following configuration to the configuration file:

```
[packages]
prereleases = true
```

### ``no binary for current host``

Indicates that the package version does not provide a binary package for the current host architecture.

In some scenarios, it is appropriate to install packages for non-native architectures, such as using box64 to run WPS Office on a riscv64 machine.

In such cases, you can specify the installation of a binary package for a particular architecture:

```bash
$ ruyi install --host x86_64 wps-office
```

## Installing Binary Packages

Typically, the following sections contain binary packages:

- toolchain: Toolchains
- emulator: Emulators
- board-image: System images
- analyzer: Analysis tools
- extra: Miscellaneous

These packages can be installed using the ``install`` command, such as installing the GNU upstream GCC toolchain:

```bash
$ ruyi install gnu-upstream
$ ruyi install toolchain/gnu-upstream
```

The above method of specifying the package name will by default install the version marked as ``latest``. If you want to install a specific historical version of gnu-upstream, you can specify the version:

```bash
$ ruyi install 'gnu-upstream(0.20231118.0)'
$ ruyi install 'gnu-upstream(>=0.20231118.0)'
```

The expression supports ``<``, ``>``, ``==``, ``<=``, ``>=``, and ``!=`` operators.

If you want to install multiple packages:

```bash
$ ruyi install gnu-plct gnu-upsteam llvm-plct llvm-upstream
```

In some special cases, such as accidentally deleting files of an installed package, you can reinstall the package to restore it:

```bash
$ ruyi install --reinstall gnu-upstream
```

Packages downloaded by the package manager are stored in ``~/.cache/ruyi/distfiles/``, or at ``$XDG_CACHE_HOME/ruyi/distfiles/`` if ``XDG_CACHE_HOME`` is specified. These packages are typically stored in a compressed format and require system tools to unpack. If the corresponding tools are missing on the system, a warning will be printed.

By default, the ``install`` command will only install binary packages for the current system architecture. Unpacked binary packages are stored in ``~/.local/share/ruyi/binaries/$(uname -m)/``, or at ``$XDG_DATA_HOME/ruyi/binaries/$(uname -m)/`` if ``XDG_DATA_HOME`` is specified.

Since system images are also binary files, they can be downloaded and unpacked using the ``install`` command. However, these packages are typically used in conjunction with Ruyi's image flashing functionality. Unpacked image files are stored in ``~/.local/share/ruyi/blobs/``, or at ``$XDG_DATA_HOME/ruyi/blobs/`` if ``XDG_DATA_HOME`` is specified.

## Installing Source Packages

The following section clearly contains source packages:

- source: Source packages

Source packages can be downloaded and unpacked into the current directory using the ``extract`` command:

```bash
$ ruyi extract ruyisdk-demo
$ ls
README.md  rvv-autovec
```

The ``extract`` command supports the same version expression syntax as ``install``.

## Uninstalling Packages

The Ruyi package manager does not implement the functionality to uninstall specific Ruyi packages. However, you can use the following command to delete all downloaded and installed packages:

```bash
$ ruyi self clean --distfiles --installed-pkgs
```

If you insist on deleting a specific package, although it is not recommended, you can manually delete them. If you accidentally delete some files but Ruyi still considers the package installed, you can try using ``install --reinstall`` to restore it.

Note that if a toolchain package is deleted, any virtual environments that depend on it will become invalid, and there will be no warning when activating such a compilation environment.