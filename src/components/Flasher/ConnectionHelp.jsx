import Translate from "@docusaurus/Translate";
import React, { useState } from "react";
import styles from "./styles.module.css";

/** Suggests a help topic from the host platform without restricting device access. */
function initialPlatform() {
  const agent = navigator.userAgent;
  if (/CrOS/.test(agent)) return "chromeos";
  if (/Windows/.test(agent)) return "windows";
  if (/Macintosh/.test(agent)) return "macos";
  if (/Linux/.test(agent) && !/Android/.test(agent)) return "linux";
  return "other";
}

/** Provides optional host setup instructions and troubleshooting after a connection failure. */
export default function ConnectionHelp({ open, onToggle }) {
  const [platform, setPlatform] = useState(initialPlatform);

  return (
    <details
      className={`${styles.help} ${styles.connectionHelp}`}
      open={open}
      onToggle={(event) => onToggle(event.currentTarget.open)}
    >
      <summary>
        <Translate id="flasher.connectionHelp">USB connection guide</Translate>
      </summary>
      <p>
        <Translate id="flasher.help.tryFirst">
          Try selecting your USB device first. Extra setup is only needed if
          your computer cannot access the board.
        </Translate>
      </p>
      <ol>
        <li>
          <Translate id="flasher.help.fastboot">
            Follow your board's instructions to enter fastboot mode and use its
            USB flashing port. A power-only or serial-console port will not
            work.
          </Translate>
        </li>
        <li>
          <Translate id="flasher.help.cable">
            Connect directly to your computer with a USB data cable. If the
            board does not appear, try another cable or port and disconnect USB
            hubs.
          </Translate>
        </li>
        <li>
          <Translate id="flasher.help.permission">
            Click Select USB device, choose your board, and allow the connection
            in the browser dialog. This permission does not install a driver or
            change your computer's USB permissions.
          </Translate>
        </li>
      </ol>
      <label className={styles.field}>
        <Translate id="flasher.help.platform">Your operating system</Translate>
        <select
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
        >
          <option value="windows">Windows</option>
          <option value="linux">Linux</option>
          <option value="macos">macOS</option>
          <option value="chromeos">ChromeOS</option>
          <option value="other">
            <Translate id="flasher.help.other">Other / not sure</Translate>
          </option>
        </select>
      </label>
      {platform === "windows" && (
        <>
          <p>
            <Translate id="flasher.help.windows">
              Open Device Manager while the board is in fastboot mode. If its
              USB device has a warning or cannot be opened, follow the board
              vendor's instructions to install a compatible WinUSB driver. Some
              boards configure this automatically.
            </Translate>
          </p>
          <p>
            <Translate id="flasher.help.windowsDevice">
              Check the board's USB device or fastboot interface, not its serial
              port. Google USB Driver is for supported Google devices; use the
              driver recommended for your board.
            </Translate>
          </p>
          <a
            href="https://developer.chrome.com/docs/capabilities/build-for-webusb#windows"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate id="flasher.help.windowsLink">
              WinUSB setup reference
            </Translate>
          </a>
        </>
      )}
      {platform === "linux" && (
        <>
          <p>
            <Translate id="flasher.help.linux">
              Your distribution may already grant access to fastboot devices. If
              access is denied, install your board vendor's udev rules, or add a
              rule for this board on systems using systemd-logind.
            </Translate>
          </p>
          <ol>
            <li>
              <Translate id="flasher.help.linuxIdentify">
                Run lsusb with the board connected in fastboot mode. Find its ID
                in the form vvvv:pppp (vendor ID:product ID). Compare the list
                before and after connecting if needed.
              </Translate>
              <pre>
                <code>lsusb</code>
              </pre>
            </li>
            <li>
              <Translate id="flasher.help.linuxEdit">
                Open the following rule file as administrator. Add the example
                rule, replacing vvvv and pppp with the board's actual four-digit
                hexadecimal IDs in lowercase, then save it.
              </Translate>
              <pre>
                <code>
                  sudoedit /etc/udev/rules.d/70-ruyisdk-fastboot.rules
                </code>
              </pre>
              <pre>
                <code>
                  {
                    'SUBSYSTEM=="usb", ATTR{idVendor}=="vvvv", ATTR{idProduct}=="pppp", TAG+="uaccess"'
                  }
                </code>
              </pre>
            </li>
            <li>
              <Translate id="flasher.help.linuxReload">
                Reload the rules, unplug and reconnect the board, then select it
                in the browser again. This grants access to the active local
                desktop user; the browser should run as your normal user.
              </Translate>
              <pre>
                <code>sudo udevadm control --reload-rules</code>
              </pre>
            </li>
          </ol>
          <p>
            <Translate id="flasher.help.linuxStages">
              A board may use a different USB ID after a boot-stage transition.
              If access fails after reconnecting, check lsusb again and add a
              separate rule for that ID.
            </Translate>
          </p>
          <a
            href="https://developer.chrome.com/docs/capabilities/build-for-webusb#linux"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate id="flasher.help.linuxLink">
              Linux USB permissions reference
            </Translate>
          </a>
        </>
      )}
      {(platform === "macos" || platform === "chromeos") && (
        <p>
          <Translate id="flasher.help.noDriver">
            Usually no additional USB driver or permission rule is needed. Use
            Chrome or another WebUSB-capable browser, select your board, and
            close any other application using its USB interface.
          </Translate>
        </p>
      )}
      {platform === "other" && (
        <p>
          <Translate id="flasher.help.otherPlatform">
            Use a desktop browser that supports WebUSB, such as Chrome or Edge,
            over HTTPS or localhost. Follow your operating system and board
            vendor's USB setup instructions if the device cannot be opened.
          </Translate>
        </p>
      )}
      <h3>
        <Translate id="flasher.help.stillFailing">
          Still unable to connect?
        </Translate>
      </h3>
      <ul>
        <li>
          <Translate id="flasher.help.busy">
            Close other flashing tools, browser tabs, and applications using the
            board, then reconnect. If an ADB server is running and holding the
            device, stop it with adb kill-server.
          </Translate>
        </li>
        <li>
          <Translate id="flasher.newDeviceHelp">
            You may need to select the device again during flashing. Follow the
            prompt when it appears.
          </Translate>
        </li>
        <li>
          <Translate id="flasher.help.reconnectIdentity">
            The device name can change between boot stages. Select the same
            physical board and check its identity before continuing.
          </Translate>
        </li>
      </ul>
    </details>
  );
}
