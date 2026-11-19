import Translate, { translate } from "@docusaurus/Translate";
import { FlashClient, USB_FILTER } from "./client.mjs";
import ConnectionHelp from "./ConnectionHelp";
import { FlasherError } from "./errors.mjs";
import { formatError, formatProgress } from "./i18n";
import {
  hasProfileConflict,
  matchProfiles,
  mergeFiles,
  missingImages,
  resolveProfile,
} from "./match.mjs";
import { createPlan } from "./plan.mjs";
import styles from "./styles.module.css";
import { useLocation } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import { Usb, FileArchive, CheckCircle2, AlertCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

/** Formats a byte count for the image review table. */
function bytes(value, locale) {
  const units = ["B", "KiB", "MiB", "GiB"];
  let index = 0;
  while (value >= 1024 && index < 3) {
    value /= 1024;
    index++;
  }
  return (
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: index ? 1 : 0,
      maximumFractionDigits: index ? 1 : 0,
    }).format(value) +
    " " +
    units[index]
  );
}

/** Removes only this preparation session's temporary browser files. */
async function removeSession(session) {
  if (!session) return;
  const root = await navigator.storage.getDirectory();
  await root.removeEntry(session, { recursive: true }).catch((error) => {
    if (error.name !== "NotFoundError") throw error;
  });
}

/** Provides a local-file fastboot workflow with an explicit review before device writes. */
export default function Flasher() {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const catalog = usePluginData("usb-flasher");
  const { search } = useLocation();
  const suggestedProfileId = new URLSearchParams(search).get("profile");
  const packagesUrl = useBaseUrl("/packages");
  const [profileId, setProfileId] = useState("auto");
  const [files, setFiles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [imageName, setImageName] = useState("");
  const [partition, setPartition] = useState("");
  const [device, setDevice] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionHelpOpen, setConnectionHelpOpen] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const client = useRef(null);
  const worker = useRef(null);
  const fileInput = useRef(null);
  const session = useRef(null);
  const busy = useRef(false);
  const connectBusy = useRef(false);
  const stopping = useRef(false);
  const reconnect = useRef(null);
  const cancelPreparation = useRef(null);
  const mounted = useRef(true);
  const candidates = matchProfiles(catalog, files);
  const profile = resolveProfile(candidates, profileId, suggestedProfileId);
  const needsProfile = candidates.length > 0 && !profile;
  const profileConflict = hasProfileConflict(catalog, files);
  const lpi4a =
    candidates.some((item) => item.sourceProfileId) || profileConflict;
  const missing = missingImages(profile, files);
  const supported =
    typeof navigator !== "undefined" &&
    Boolean(navigator.usb) &&
    window.isSecureContext;
  const locked = ["preparing", "flashing", "reconnect"].includes(phase);
  const log = (text) => setLogs((previous) => [...previous.slice(-299), text]);

  /** Localizes operation guidance while preserving protocol commands. */
  function describeStep(step) {
    if (step.action === "reconnect")
      return translate(
        { id: "flasher.reconnectStep", message: "{command} → reconnect" },
        { command: "fastboot " + step.command },
      );
    return (
      "fastboot " +
      step.action +
      " " +
      (step.partition ? step.partition + " " : "") +
      step.name
    );
  }

  let plan = [];
  let planError = "";
  if (entries.length) {
    try {
      if (profile) plan = createPlan(profile, entries);
      else if (imageName && /^[a-zA-Z0-9_-]{1,40}$/.test(partition)) {
        const image = entries.find((entry) => entry.name === imageName);
        if (image?.file.size) plan = [{ action: "flash", partition, ...image }];
      }
    } catch (failure) {
      planError = formatError(failure);
    }
  }

  useEffect(() => {
    mounted.current = true;
    const disconnected = (event) => {
      if (client.current?.device === event.device) {
        setDevice(null);
        setConfirmed(false);
        void client.current.close();
      }
    };
    navigator.usb?.addEventListener("disconnect", disconnected);
    return () => {
      mounted.current = false;
      worker.current?.terminate();
      cancelPreparation.current?.(
        new FlasherError("error.pageClosed", "Page closed", {}),
      );
      reconnect.current?.reject(
        new FlasherError("error.pageClosed", "Page closed", {}),
      );
      void client.current?.close();
      void removeSession(session.current).catch(() => {});
      navigator.usb?.removeEventListener("disconnect", disconnected);
    };
  }, []);

  useEffect(() => {
    if (!locked) return undefined;
    const guard = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [locked]);

  /** Invalidates previous review data before any input change. */
  function reset() {
    setEntries([]);
    setImageName("");
    setConfirmed(false);
    setPhase("idle");
    setProgress(0);
    setCurrentStep(-1);
    setError("");
    setLogs([]);
    const old = session.current;
    session.current = null;
    void removeSession(old).catch((failure) =>
      setError(
        translate(
          {
            id: "flasher.cleanupFailed",
            message: "Could not clear temporary files: {detail}",
          },
          { detail: formatError(failure) },
        ),
      ),
    );
  }

  /** Verifies downloads and extracts selected image payloads in a dedicated worker. */
  async function prepare(selectedFiles, selectedProfile) {
    busy.current = true;
    setPhase("preparing");
    setMessage(
      translate({ id: "flasher.preparing", message: "Loading images…" }),
    );
    try {
      if (!navigator.storage?.getDirectory)
        throw new FlasherError(
          "error.storageUnsupported",
          "This browser does not support temporary file storage. Use a current desktop Chrome or Edge.",
          {},
        );
      const id = "ruyisdk-flash-" + crypto.randomUUID();
      session.current = id;
      const result = await new Promise((resolve, reject) => {
        cancelPreparation.current = reject;
        const instance = new Worker(
          new URL("./archive.worker.js", import.meta.url),
        );
        worker.current = instance;
        instance.onmessage = ({ data }) => {
          if (data.type === "progress") {
            setMessage(formatProgress(data));
            setProgress(data.progress);
          } else if (data.type === "done") resolve(data.entries);
          else reject(FlasherError.from(data));
        };
        instance.onerror = (event) =>
          reject(
            event.message
              ? new Error(event.message)
              : new FlasherError(
                  "error.preparation",
                  "Image preparation failed",
                ),
          );
        instance.postMessage({
          files: selectedFiles,
          session: id,
          profile: selectedProfile,
        });
      });
      if (!mounted.current) return;
      if (selectedProfile) createPlan(selectedProfile, result);
      setEntries(result);
      setImageName(result[0]?.name || "");
      setPhase("ready");
      setProgress(0);
      setMessage(
        translate({
          id: "flasher.ready",
          message: "Images loaded. Check the target partitions.",
        }),
      );
      log(
        translate(
          { id: "flasher.prepared", message: "Loaded {count} image file(s)." },
          { count: result.length },
        ),
      );
    } catch (failure) {
      if (mounted.current) {
        setError(formatError(failure));
      }
      worker.current?.terminate();
      await removeSession(session.current).catch(() => {});
      session.current = null;
      if (mounted.current) setPhase("error");
    } finally {
      worker.current?.terminate();
      worker.current = null;
      cancelPreparation.current = null;
      busy.current = false;
    }
  }

  /** Retains selected files and starts preparation once the release and required images are known. */
  function selectImages(selectedFiles, selectedProfileId = profileId) {
    if (busy.current || connectBusy.current || !supported) return;
    reset();
    setFiles(selectedFiles);
    setPartition("");
    const matches = matchProfiles(catalog, selectedFiles);
    const selectedProfile = resolveProfile(
      matches,
      selectedProfileId,
      suggestedProfileId,
    );
    setProfileId(
      selectedProfile?.id === selectedProfileId ? selectedProfileId : "auto",
    );
    if (
      !selectedFiles.length ||
      (matches.length > 0 && !selectedProfile) ||
      hasProfileConflict(catalog, selectedFiles)
    )
      return;
    if (missingImages(selectedProfile, selectedFiles).length) return;
    void prepare(selectedFiles, selectedProfile || null);
  }

  /** Opens a user-selected device; reconnecting never chooses an arbitrary paired device. */
  async function connect() {
    if (connectBusy.current || (busy.current && phase !== "reconnect")) return;
    connectBusy.current = true;
    setConnecting(true);
    setError("");
    setConfirmed(false);
    try {
      const selected = await navigator.usb.requestDevice({
        filters: [USB_FILTER],
      });
      client.current ||= new FlashClient(log);
      await client.current.open(selected);
      setDevice({
        name:
          selected.productName ||
          translate({
            id: "flasher.fastbootDevice",
            message: "Fastboot device",
          }),
        serial:
          selected.serialNumber ||
          translate({ id: "flasher.notReported", message: "Not reported" }),
        id:
          selected.vendorId.toString(16).padStart(4, "0") +
          ":" +
          selected.productId.toString(16).padStart(4, "0"),
      });
      log(
        translate(
          { id: "flasher.connected", message: "Connected: {name} ({serial})" },
          {
            name:
              selected.productName ||
              translate({
                id: "flasher.fastbootDevice",
                message: "Fastboot device",
              }),
            serial:
              selected.serialNumber ||
              translate({
                id: "flasher.noSerial",
                message: "no serial number",
              }),
          },
        ),
      );
    } catch (failure) {
      setDevice(null);
      if (failure.name !== "NotFoundError") {
        setError(formatError(failure));
        setConnectionHelpOpen(true);
      }
    } finally {
      setConnecting(false);
      connectBusy.current = false;
    }
  }

  /** Executes the reviewed plan sequentially, stopping after the first failure. */
  async function flash() {
    if (
      busy.current ||
      !confirmed ||
      !client.current?.isConnected ||
      !plan.length
    )
      return;
    busy.current = true;
    stopping.current = false;
    setStopRequested(false);
    setError("");
    setPhase("flashing");
    const reviewed = plan.slice();
    try {
      for (let index = 0; index < reviewed.length; index++) {
        if (!mounted.current)
          throw new FlasherError("error.pageClosed", "Page closed", {});
        if (stopping.current)
          throw new FlasherError(
            "error.stopped",
            "Stopped before the next step. Completed writes have been retained.",
            {},
          );
        const step = reviewed[index];
        setCurrentStep(index);
        setProgress(0);
        setMessage(describeStep(step));
        log(describeStep(step));
        if (step.action === "reconnect") {
          await client.current.runCommand(step.command);
          await client.current.close();
          setDevice(null);
          setConfirmed(false);
          await new Promise((resolve) => setTimeout(resolve, step.delay));
          if (!mounted.current)
            throw new FlasherError("error.pageClosed", "Page closed", {});
          if (stopping.current)
            throw new FlasherError(
              "error.stoppedBeforeReconnect",
              "Stopped before reconnection. Completed writes have been retained.",
              {},
            );
          await new Promise((resolve, reject) => {
            reconnect.current = { resolve, reject };
            setPhase("reconnect");
          });
          reconnect.current = null;
          setPhase("flashing");
        } else if (step.action === "stage") {
          await client.current.stage(step.file, setProgress);
        } else {
          await client.current.flashBlob(
            step.partition,
            step.file,
            setProgress,
          );
        }
        log(
          translate(
            {
              id: "flasher.stepCompleted",
              message: "Completed step {current} of {total}",
            },
            { current: index + 1, total: reviewed.length },
          ),
        );
      }
      setPhase("done");
      setProgress(1);
      setMessage(
        translate({ id: "flasher.done", message: "Flashing complete." }),
      );
      log(translate({ id: "flasher.done", message: "Flashing complete." }));
    } catch (failure) {
      if (mounted.current) {
        setError(
          translate(
            {
              id: "flasher.flashFailed",
              message: "{detail} Flashing stopped. Completed writes are kept.",
            },
            { detail: formatError(failure) },
          ),
        );
        setPhase("error");
      }
      await client.current?.close();
      setDevice(null);
    } finally {
      busy.current = false;
      reconnect.current = null;
      setConfirmed(false);
    }
  }

  /** Requests a stop at a command boundary; in-flight flash writes are allowed to finish. */
  function stop() {
    if (phase === "preparing") {
      worker.current?.terminate();
      cancelPreparation.current?.(
        new FlasherError("error.cancelled", "Image preparation cancelled", {}),
      );
      return;
    }
    stopping.current = true;
    setStopRequested(true);
    reconnect.current?.reject(
      new FlasherError(
        "error.stoppedWhileReconnecting",
        "Stopped while waiting for reconnection",
        {},
      ),
    );
  }

  /** Reboots only after the user explicitly requests it. */
  async function reboot() {
    if (busy.current || !client.current?.isConnected) return;
    busy.current = true;
    setConnecting(true);
    try {
      await client.current.runCommand("reboot");
      log(
        translate({
          id: "flasher.rebootRequested",
          message: "Reboot requested.",
        }),
      );
    } catch (failure) {
      setError(formatError(failure));
    } finally {
      await client.current.close();
      setDevice(null);
      setConnecting(false);
      busy.current = false;
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <h1>
          <Translate id="flasher.title">Online image flasher</Translate>
        </h1>
        <p>
          <Translate id="flasher.intro">
            Flash images to your board using Fastboot.
          </Translate>
        </p>
      </header>

      {!supported && (
        <div className={styles.warning} role="alert">
          <AlertCircle size={20} />
          <Translate id="flasher.browserHelp">
            Open this page over HTTPS in desktop Chrome or Edge to use WebUSB.
          </Translate>
        </div>
      )}
      {error && (
        <div className={styles.error} role="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className={`${styles.grid} ${styles.steps}`}>
        <section className={styles.card}>
          <h2>
            <span className={styles.number}>1</span>
            <Translate id="flasher.prepare">Choose images</Translate>
          </h2>
          <p className={styles.muted}>
            <Translate id="flasher.fileHelp">
              Add your downloaded images or archives together or one at a time.
            </Translate>
          </p>
          <label className={styles.upload}>
            <FileArchive size={28} />
            <strong>
              {files.length
                ? translate({ id: "flasher.addFiles", message: "Add files" })
                : translate({
                    id: "flasher.selectFiles",
                    message: "Choose files",
                  })}
            </strong>
            <input
              ref={fileInput}
              type="file"
              multiple
              disabled={!supported || locked || connecting}
              accept=".img,.ext4,.bin,.itb,.vfat,.zst,.gz,.tgz,.tar,.zip,.json"
              onChange={(event) => {
                const selectedFiles = Array.from(event.target.files || []);
                event.target.value = "";
                if (selectedFiles.length)
                  selectImages(mergeFiles(files, selectedFiles));
              }}
            />
          </label>
          <a className={styles.browse} href={packagesUrl}>
            <Translate id="flasher.browse">
              Browse boards and images →
            </Translate>
          </a>
          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((file) => (
                <li key={file.name}>
                  <span>
                    {file.name} <small>{bytes(file.size, currentLocale)}</small>
                  </span>
                  <button
                    type="button"
                    className={styles.removeFile}
                    disabled={locked || connecting}
                    aria-label={translate(
                      { id: "flasher.removeFile", message: "Remove {name}" },
                      { name: file.name },
                    )}
                    onClick={() =>
                      selectImages(files.filter((item) => item !== file))
                    }
                  >
                    <Translate id="flasher.remove">Remove</Translate>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {files.length > 0 && (
            <div>
              <p className={styles.muted} role="status">
                {profileConflict
                  ? translate({
                      id: "flasher.profileConflict",
                      message:
                        "These files do not belong to one compatible release. Remove unrelated files or a mismatched U-Boot image before continuing.",
                    })
                  : needsProfile
                    ? translate({
                        id: "flasher.ambiguous",
                        message:
                          "These filenames match several releases. Choose the release you want to flash.",
                      })
                    : profile
                      ? profileId === "auto"
                        ? translate(
                            {
                              id: "flasher.detected",
                              message: "Detected: {name} · {version}",
                            },
                            {
                              name: profile.name,
                              version: profile.version,
                            },
                          )
                        : translate(
                            {
                              id: "flasher.selected",
                              message: "Selected: {name} · {version}",
                            },
                            {
                              name: profile.name,
                              version: profile.version,
                            },
                          )
                      : translate({
                          id: "flasher.customHelp",
                          message:
                            "Enter the target partition for this custom image.",
                        })}
              </p>
              {(needsProfile || (lpi4a && profile)) && (
                <label className={styles.field}>
                  {lpi4a ? (
                    <Translate id="flasher.chooseBoardVariant">
                      Choose the release matching your board's RAM capacity
                    </Translate>
                  ) : (
                    <Translate id="flasher.chooseMatching">
                      Choose an image release
                    </Translate>
                  )}
                  <select
                    value={profile?.id || "auto"}
                    disabled={locked || connecting}
                    onChange={(event) =>
                      selectImages(files, event.target.value)
                    }
                  >
                    <option value="auto" disabled>
                      <Translate id="flasher.chooseRelease">
                        Choose a release…
                      </Translate>
                    </option>
                    {candidates.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {item.version}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}
          {lpi4a && (
            <div className={styles.hint}>
              <p>
                <Translate id="flasher.lpi4aBootstrap">
                  LicheePi 4A needs a matching U-Boot image before boot/root can
                  be written from BOOT mode. Add the U-Boot file for your
                  board's RAM capacity and this release. The plan loads it into
                  RAM, reboots, then writes U-Boot and the system images.
                </Translate>
              </p>
              <p>
                <Translate id="flasher.lpi4aConnect">
                  Start with the board powered off. Hold BOOT while connecting
                  USB, then release BOOT. After the temporary U-Boot starts,
                  select the same board again without holding BOOT or
                  disconnecting power.
                </Translate>
              </p>
              {profile?.bootloaderFiles?.map(
                (file) =>
                  file.url && (
                    <p key={file.name}>
                      <a href={file.url} target="_blank" rel="noreferrer">
                        {file.name}
                      </a>
                    </p>
                  ),
              )}
            </div>
          )}
          {missing.length > 0 && (
            <div className={styles.hint} role="status">
              <p>
                <Translate id="flasher.missingFiles">
                  Add the following files to continue:
                </Translate>
              </p>
              <ul>
                {missing.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
          {files.length > 0 && (
            <button
              className={styles.secondary}
              disabled={locked || connecting}
              onClick={() => {
                selectImages([], "auto");
                fileInput.current?.focus();
              }}
            >
              <Translate id="flasher.clear">Clear images</Translate>
            </button>
          )}
          {phase === "preparing" && (
            <div className={styles.progress} aria-live="polite">
              <p>{message}</p>
              <progress
                max="1"
                value={progress}
                aria-label={translate({
                  id: "flasher.preparationProgress",
                  message: "Image loading progress",
                })}
              />
              <button className={styles.secondary} onClick={stop}>
                <Translate id="flasher.cancel">Cancel loading</Translate>
              </button>
            </div>
          )}
          {phase === "error" &&
            !entries.length &&
            files.length > 0 &&
            !needsProfile && (
              <button
                className={styles.secondary}
                disabled={!supported || connecting}
                onClick={() => selectImages(files)}
              >
                <Translate id="flasher.retry">Try again</Translate>
              </button>
            )}
        </section>

        <section className={styles.card}>
          <h2>
            <span className={styles.number}>2</span>
            <Translate id="flasher.connect">Connect your board</Translate>
          </h2>
          <p>
            <Translate id="flasher.connectHelp">
              Follow your board’s instructions to enter fastboot mode, then
              connect it with a USB data cable.
            </Translate>
          </p>
          <div className={styles.device}>
            <Usb size={32} />
            <div>
              <strong>
                {device?.name ||
                  translate({
                    id: "flasher.noDevice",
                    message: "No device connected",
                  })}
              </strong>
              {device && (
                <small>
                  {translate(
                    {
                      id: "flasher.deviceIdentity",
                      message: "USB {id} · Serial: {serial}",
                    },
                    {
                      id: device.id,
                      serial: device.serial,
                    },
                  )}
                </small>
              )}
            </div>
          </div>

          <div className={styles.cardActions}>
            <button
              className={styles.secondary}
              disabled={
                !supported || connecting || (locked && phase !== "reconnect")
              }
              onClick={connect}
            >
              {connecting
                ? translate({
                    id: "flasher.connecting",
                    message: "Connecting…",
                  })
                : phase === "reconnect"
                  ? translate({
                      id: "flasher.reconnect",
                      message: "Reconnect board",
                    })
                  : translate({
                      id: "flasher.selectDevice",
                      message: "Select USB device",
                    })}
            </button>
          </div>
          <ConnectionHelp
            open={connectionHelpOpen}
            onToggle={setConnectionHelpOpen}
          />
        </section>
      </div>

      {entries.length > 0 && (
        <section className={styles.card}>
          <h2>
            <span className={styles.number}>3</span>
            <Translate id="flasher.review">Review and flash</Translate>
          </h2>
          {!profile && entries.length > 0 && (
            <div className={styles.grid}>
              <label className={styles.field}>
                <Translate id="flasher.image">Image to write</Translate>
                <select
                  value={imageName}
                  disabled={locked}
                  onChange={(event) => {
                    setImageName(event.target.value);
                    setConfirmed(false);
                    setPhase("ready");
                  }}
                >
                  {entries.map((entry) => (
                    <option key={entry.name}>{entry.name}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <Translate id="flasher.partition">Target partition</Translate>
                <input
                  value={partition}
                  disabled={locked}
                  placeholder={translate({
                    id: "flasher.partitionExample",
                    message: "e.g. boot",
                  })}
                  pattern="[a-zA-Z0-9_-]{1,40}"
                  onChange={(event) => {
                    setPartition(event.target.value);
                    setConfirmed(false);
                    setPhase("ready");
                  }}
                />
                <small>
                  <Translate id="flasher.partitionHelp">
                    Use the partition name from your board’s flashing
                    instructions.
                  </Translate>
                </small>
              </label>
            </div>
          )}
          {planError && (
            <p className={styles.error} role="alert">
              {planError}
            </p>
          )}
          {plan.length > 0 && (
            <>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <Translate id="flasher.step">Step</Translate>
                      </th>
                      <th>
                        <Translate id="flasher.operation">Operation</Translate>
                      </th>
                      <th>
                        <Translate id="flasher.size">Image size</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.map((step, index) => (
                      <tr
                        key={index}
                        className={
                          index === currentStep ? styles.activeRow : ""
                        }
                      >
                        <td>{index + 1}</td>
                        <td>
                          <code>{describeStep(step)}</code>
                        </td>
                        <td>
                          {step.file
                            ? bytes(step.file.size, currentLocale)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.hint}>
                {entries.every((entry) => entry.verified)
                  ? translate({
                      id: "flasher.verified",
                      message: "Original files passed checksum verification.",
                    })
                  : translate({
                      id: "flasher.unverified",
                      message:
                        "Some files have no checksum to verify against. Make sure you trust their source.",
                    })}
              </p>
              <label className={styles.confirm}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  disabled={connecting || phase === "flashing"}
                  onChange={(event) => setConfirmed(event.target.checked)}
                />
                <span>
                  <Translate id="flasher.confirmation">
                    I have checked the board model, image release and target
                    partitions, and agree to overwrite data on the selected
                    device.
                  </Translate>
                </span>
              </label>
              {phase === "reconnect" ? (
                <div className={styles.warning}>
                  <span>
                    {lpi4a ? (
                      <Translate id="flasher.lpi4aReconnect">
                        Temporary U-Boot has started. Keep power connected and
                        leave BOOT released. Select the same board again, check
                        the device, then continue flashing.
                      </Translate>
                    ) : (
                      <Translate id="flasher.reconnectHelp">
                        Select the same board again, check the device, then
                        continue flashing.
                      </Translate>
                    )}
                  </span>
                  <button
                    className={styles.primary}
                    disabled={!device || !confirmed || connecting}
                    onClick={() => reconnect.current?.resolve()}
                  >
                    <Translate id="flasher.continue">
                      Continue flashing
                    </Translate>
                  </button>
                </div>
              ) : (
                <button
                  className={styles.primary}
                  disabled={
                    !supported ||
                    !device ||
                    !confirmed ||
                    locked ||
                    connecting ||
                    phase === "done"
                  }
                  onClick={flash}
                >
                  <Translate id="flasher.flash">Start flashing</Translate>
                </button>
              )}
            </>
          )}
          {locked && (
            <button
              className={styles.secondary}
              disabled={stopRequested}
              onClick={stop}
            >
              {phase === "preparing"
                ? translate({ id: "flasher.cancel", message: "Cancel loading" })
                : stopRequested
                  ? translate({
                      id: "flasher.stopping",
                      message: "Stopping after the current step…",
                    })
                  : translate({
                      id: "flasher.stop",
                      message: "Stop after this step",
                    })}
            </button>
          )}
          {(locked || phase === "done") && (
            <div className={styles.progress} aria-live="polite">
              <p>
                {phase === "done" && <CheckCircle2 size={18} />} {message}
              </p>
              <progress
                max="1"
                value={progress}
                aria-label={
                  phase === "preparing"
                    ? translate({
                        id: "flasher.preparationProgress",
                        message: "Image loading progress",
                      })
                    : translate({
                        id: "flasher.transferProgress",
                        message: "Current step transfer progress",
                      })
                }
              />
              {phase === "flashing" && (
                <small>
                  {translate(
                    {
                      id: "flasher.transferStatus",
                      message:
                        "Transferred {percent}%. Wait for the device to finish writing.",
                    },
                    {
                      percent: new Intl.NumberFormat(currentLocale).format(
                        Math.round(progress * 100),
                      ),
                    },
                  )}
                </small>
              )}
            </div>
          )}
          {phase === "done" && (
            <button
              className={styles.secondary}
              disabled={!device || connecting}
              onClick={reboot}
            >
              <Translate id="flasher.reboot">Reboot device</Translate>
            </button>
          )}
        </section>
      )}
      {logs.length > 0 && (
        <details className={styles.help}>
          <summary>
            <Translate id="flasher.sessionLog">Flashing log</Translate>
          </summary>
          <pre
            className={styles.log}
            aria-label={translate({
              id: "flasher.sessionLogLabel",
              message: "Flashing log",
            })}
          >
            {logs.join("\n")}
          </pre>
        </details>
      )}
    </main>
  );
}
