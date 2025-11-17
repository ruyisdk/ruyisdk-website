---
sidebar_position: 1
---

# Feature Overview

The ruyi package manager primarily provides the following functionalities.

## Command Reference

| Command                                                                                           | Description                          | Notes                                |
| -------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------- |
| `ruyi update`                                                                                | Update package cache using default mirror.             | Package cache will be stored in user directory, typically `~/.cache/ruyi`. |
| `ruyi news list -h`                                                                          | Display help information for news command.                |                                     |
| `ruyi news list`                                                                             | List all news items.                     |                                     |
| `ruyi news list --new`                                                                       | List only unread news items.                    |                                     |
| `ruyi news read -h`                                                                          | Display help information for news reading command.              |                                     |
| `ruyi news read 1`                                                                           | Read specific news item by index.                  | 1 represents the index or ID of the news entry.                 |
| `ruyi news read`                                                                             | Read next news item.                    |                                     |
| `ruyi news read --quiet`                                                                     | Mark news as read without output.            | No output, only marks as read.                     |
| `ruyi list --name-contains`                                                         | List all available packages.                  |                                     |
| `ruyi list --verbose --name-contains`                                            | List detailed information of all packages.               |                                     |
| `ruyi list profiles`                                                                         | View predefined virtual environment configurations.                |                     |
| `ruyi install gnu-upstream`                                                                  | Install latest GNU upstream toolchain.            | Installs latest version of gnu-upstream by default.             |
| `ruyi install 'gnu-upstream(0.20231118.0)'`                                                  | Install specified version of GNU upstream toolchain.          | Install historical versions by specifying version number.                      |
| `ruyi install 'gnu-upstream(==0.20231118.0)'`                                                | Install specific version of GNU upstream toolchain.          | Version matching format should be `<op><ver>`.               |
| `ruyi install --reinstall gnu-upstream`                                                      | Reinstall GNU upstream toolchain.             |                                     |
| `ruyi uninstall gnu-upstream` | Uninstall an installed package. | You can also use `ruyi remove` or `ruyi rm`. |
| `ruyi extract ruyisdk-demo`                                                                  | Download and unpack ruyisdk-demo source package.      | By default, unpacks into a directory named after the package and version. |
| `ruyi venv --toolchain gnu-upstream --emulator qemu-user-riscv-upstream generic ./ruyi_venv` | Create virtual environment with toolchain and emulator in specified directory.      | Uses predefined generic configuration.                   |
| `ruyi version`                                                                               | Display version of ruyi package manager.              |                                     |
| `ruyi self uninstall`                                                                        | Uninstall ruyi package manager.               | Command will prompt for confirmation.                          |
| `ruyi self uninstall -y`                                                                     | Uninstall ruyi package manager without confirmation.         | Executes directly without confirmation.                           |
| `ruyi self uninstall --purge`                                                                | Completely uninstall ruyi package manager, including cache and installed packages. | Includes cache and installed packages.                       |
| `ruyi self uninstall --purge -y`                                                             | Completely uninstall ruyi package manager without confirmation.         | Executes directly without confirmation.                           |
| `ruyi self clean`                                                                            | Clean data directories.                           | Can specify which directories to clean via parameters               |
| `ruyi device provision`                                                                      | Download required system image and provision device.          | Follows guided system installation process.                         |

## Data Directories

+ ruyi executable ``/usr/local/bin/ruyi`` or other directories in ``PATH``
+ User configuration file ``~/.config/ruyi/config.toml``
+ User cache ``~/.cache/ruyi``
+ User base data, including downloaded and unpacked ruyi packages ``~/.local/share/ruyi``
+ User state data ``~/.local/state/ruyi``

Ruyi supports configuring these directories using XDG environment variables.

## More Information

Refer to ruyi package manager [repository documentation](https://github.com/ruyisdk/ruyi) (currently English only).