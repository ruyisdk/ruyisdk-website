import { FlasherError } from "./errors.mjs";

/** Supported package strategies and the combined LicheePi system workflow. */
export const STRATEGIES = [
  "fastboot-v1",
  "fastboot-v1(lpi4a-uboot)",
  "fastboot-v1(lpi4a-system)",
  "spacemit-k1-v1",
  "spacemit-k3-v1",
  "zhihe-a210-v1",
];

/** Normalizes a relative archive path and rejects ambiguous or unsafe names. */
export function normalizePath(path) {
  if (
    typeof path !== "string" ||
    /[\\:\x00-\x1f]/.test(path) ||
    path.startsWith("/")
  )
    throw new FlasherError("error.archivePath", "Invalid archive path", {});
  const parts = path.split("/").filter((part) => part && part !== ".");
  if (parts.includes("..") || !parts.length)
    throw new FlasherError("error.archivePath", "Invalid archive path", {});
  return parts.join("/");
}

/** Resolves an exact relative path, allowing enclosing release directories. */
export function findImage(entries, expected) {
  expected = normalizePath(expected);
  const matches = entries.filter(
    (entry) => entry.name === expected || entry.name.endsWith("/" + expected),
  );
  if (matches.length !== 1)
    throw matches.length
      ? new FlasherError("error.ambiguousImage", "Ambiguous image: {name}", {
          name: expected,
        })
      : new FlasherError("error.missingImage", "Missing image: {name}", {
          name: expected,
        });
  if (!matches[0].file.size)
    throw new FlasherError("error.emptyNamedImage", "Empty image: {name}", {
      name: expected,
    });
  return matches[0];
}

/** Lists ordered strategy steps with image names, without requiring local files. */
export function getSteps(profile) {
  const { strategy, partition_map: map } = profile;
  if (!STRATEGIES.includes(strategy))
    throw new FlasherError(
      "error.strategy",
      "Unsupported flashing strategy: {strategy}",
      { strategy: strategy },
    );
  const steps = [];
  const flash = (partition, key = partition) =>
    steps.push({ action: "flash", partition, name: normalizePath(map[key]) });
  const stage = (key) =>
    steps.push({ action: "stage", name: normalizePath(map[key]) });
  const reconnect = (command, delay = 1000) =>
    steps.push({ action: "reconnect", command, delay });
  if (strategy === "fastboot-v1") {
    for (const key of Object.keys(map)) flash(key);
  } else if (
    strategy === "fastboot-v1(lpi4a-uboot)" ||
    strategy === "fastboot-v1(lpi4a-system)"
  ) {
    flash("ram", "uboot");
    reconnect("reboot");
    flash("uboot");
    if (strategy === "fastboot-v1(lpi4a-system)") {
      for (const key of Object.keys(map)) if (key !== "uboot") flash(key);
    }
  } else if (strategy.startsWith("spacemit-")) {
    stage("fsbl");
    reconnect("continue");
    stage(map.uboot_stage ? "uboot_stage" : "uboot");
    reconnect("continue");
    if (strategy === "spacemit-k1-v1") {
      ["gpt", "bootinfo", "fsbl", "env", "opensbi", "uboot"].forEach((key) =>
        flash(key),
      );
      if (map.esp) {
        flash("ESP", "esp");
        flash("bootfs_linux");
        flash("rootfs_linux");
      }
    } else {
      if (map.mtd) {
        flash("mtd");
        flash("bootinfo", "bootinfo_mtd");
        ["fsbl", "env", "esos", "opensbi", "uboot"].forEach((key) =>
          flash(key),
        );
      }
      ["gpt", "env", "bootinfo", "fsbl", "esos", "opensbi", "uboot"].forEach(
        (key) => flash(key),
      );
      flash("ESP", "esp");
    }
    flash("bootfs");
    flash("rootfs");
  } else {
    if (map.bootzero) {
      flash("ram", "bootzero");
      reconnect("reboot", 5000);
    }
    flash("ram", "spl");
    reconnect("reboot", 5000);
    ["gpt", "mmc0boot0", "uboot_env", "boot", "system", "app", "data"].forEach(
      (key) => flash(key),
    );
  }
  if (!steps.length)
    throw new FlasherError("error.emptyPlan", "The flashing plan is empty", {});
  return steps;
}

/** Resolves and validates each image before returning an executable plan. */
export function createPlan(profile, entries) {
  return getSteps(profile).map((step) =>
    step.action === "reconnect"
      ? step
      : { ...step, ...findImage(entries, step.name) },
  );
}
