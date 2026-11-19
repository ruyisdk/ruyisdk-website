# Online image flasher

The browser-only page is available at /flash. Package detail pages link to the
corresponding release profile. No server-side image processing is required.

## Inputs and profiles

Select local files first. Known download and partition-image names suggest a
release; this does not establish file authenticity. Ambiguous names require an
explicit release choice, unless the matching release was selected through a
package detail link. The release selector appears only while this choice is
unresolved and lists only matching releases, except that a LicheePi board variant
can also be changed after selection. Unrecognized files use custom
partition mode. Files can be added in several selections; adding the same filename
replaces the previous selection. Files can also be removed before flashing. For
individual partition images, preparation waits until every image required by the
strategy is selected and lists missing filenames. Archive contents are checked
during preparation. Original downloads are verified before any USB writes.

For LicheePi 4A system images, image-combo metadata links each system release to
its U-Boot package. The catalog combines packages with the same version, retains
both sets of checksums, and requires an explicit RAM variant choice. Add the
listed U-Boot download along with boot/root. The plan runs `flash ram`, `reboot`,
an explicit reconnect, `flash uboot`, then the system partition writes. Start
from BOOT mode, release BOOT after connecting, and keep power connected during
the transition to temporary U-Boot. Known system images mixed with incompatible
files are blocked instead of falling back to custom partition mode. Standalone
U-Boot profiles retain their existing three-step sequence.

This sequence follows the [RevyOS LicheePi 4A installation guide](https://docs.revyos.dev/docs/Installation/licheepi4a/).

- Raw partition images (.img, .ext4, .bin, .itb and .vfat).
- Zstandard (.zst), gzip (.gz), ZIP (including ZIP64), and TAR/TAR.GZ/TGZ.
- Catalog profiles include the existing fastboot-v1, LicheePi U-Boot,
  SpacemiT K1/K3, and Zhihe A210 provisioning strategies.
- Custom mode requires an explicit image and partition. It does not infer a
  partition from a filename or execute scripts from an archive.
- TAR supports regular files, POSIX extended headers and GNU long names.
  GNU sparse TAR members must be extracted externally first. Android sparse
  partition images are supported separately by the fastboot payload layer.

The usb-flasher Docusaurus plugin reads the package index and package details
in loadContent and publishes the profiles with setGlobalData in contentLoaded.
The page reads them through usePluginData, following the news plugin's data
flow. The plugin watches the source package data for changes during development.
It also watches image-combo metadata. Missing same-version U-Boot packages in a
recognized LicheePi combination fail catalog construction rather than selecting
an arbitrary bootloader release.
The strategy ordering in plan.mjs follows the plugins in news/ruyinews; changes
to those plugins require corresponding review and tests here.

## Data handling

Original downloads are checked against their catalog size and SHA-256 or SHA-512
before extraction. Extracted or custom files without catalog checksums are
identified as unverified in the review screen. ZIP CRC, gzip trailers, Zstandard
frame boundaries and sparse-image structure are checked before flashing.

A worker writes decompressed payloads to a session-specific Origin Private File
System directory, retaining bounded memory use. Clearing the prepared images or
leaving the page removes that session's files where possible. If the browser or
tab crashes, residual files can be removed through the browser's site storage
settings. Temporary storage capacity depends on the browser and available disk.

Large raw images are converted into bounded Android sparse downloads. Sparse
RAW chunks are split at block boundaries, while FILL and DONT_CARE semantics
retain their partition offsets. The bootloader must support Android sparse
writes to use this path. Download payloads are capped at 64 MiB; devices without
a reported limit use 16 MiB. The page never selects an Android slot, resizes a
logical partition, unlocks a bootloader, or automatically retries a failed write.

Each boot-stage transition pauses for explicit selection and confirmation of
the same physical board. A requested stop waits for the active step to finish.
Completed writes are not rolled back. Reboot after completion is a separate
user action. A transfer progress of 100% is not a flash completion response.
The session log records commands and protocol responses. Only recognized
unsupported-variable replies allow the download-limit fallback; other device
failures, including `buffer overflow`, stop the operation. Device failures
include the command or payload phase that received the rejection.

## Development and validation

Run pnpm build to validate the production build.
Run `node --test scripts/test-flasher-selection.mjs scripts/test-flasher-bootstrap.mjs`
to check catalog combinations, file selection, plan ordering and USB failure handling.

Use a current desktop Chromium browser on HTTPS or localhost. Windows requires
a compatible WinUSB interface driver, and Linux may require USB permissions.
Real board validation remains necessary for each bootloader, storage variant,
USB driver and host platform.

The expandable USB connection guide suggests a host platform and lets users
switch topics manually. It opens after a device connection error and includes
WinUSB guidance, per-device Linux udev setup, and boot-stage reconnection help.
Users should try connecting before changing their system configuration.

## Localization

UI messages use Docusaurus `Translate` and `translate` with stable `flasher.*`
IDs and English fallbacks. `i18n.js` maps dynamic error and progress messages
from the worker. Translations live in `i18n/zh-Hans/code.json` and
`i18n/en/code.json`. Docusaurus `write-translations` can extract the literal
message definitions. Preserve named placeholders when editing translations.

`FlasherError` carries a message ID, interpolation values and an English
diagnostic. Workers serialize this metadata; the page translates it when
displaying an error. Add a matching `i18n.js` definition and catalog entries when
introducing an error ID. Browser, library and device diagnostics remain verbatim
inside localized context. Filenames, partition names and fastboot commands are
not translated. Catalog package descriptions retain their source language.
