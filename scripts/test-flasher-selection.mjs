import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  matchProfiles,
  mergeFiles,
  missingImages,
  resolveProfile,
} from "../src/components/Flasher/match.mjs";
import { createPlan, getSteps } from "../src/components/Flasher/plan.mjs";

const detail = JSON.parse(
  await readFile(
    new URL(
      "../static/data/api/api_packages_index/packages/board-image/revyos-sipeed-lpi4a/0.20260504.0.json",
      import.meta.url,
    ),
  ),
);
const profile = {
  id: "lpi4a",
  ...detail.data.provisionable,
  distfiles: detail.data.distfiles,
};
const [boot, root] = profile.distfiles.map(({ name }) => ({ name }));

test("incremental selection retains files and replaces the same filename", () => {
  const replacement = { ...boot, size: 4096 };
  const original = [boot];
  assert.deepEqual(mergeFiles(original, [root]), [boot, root]);
  assert.deepEqual(mergeFiles([boot, root], [replacement]), [
    replacement,
    root,
  ]);
  assert.deepEqual(original, [boot]);
});

test("LicheePi 4A waits for both images regardless of selection order", () => {
  assert.deepEqual(missingImages(profile, [boot]), [root.name]);
  assert.deepEqual(missingImages(profile, [root]), [boot.name]);
  assert.deepEqual(missingImages(profile, mergeFiles([boot], [root])), []);
  assert.deepEqual(missingImages(profile, mergeFiles([root], [boot])), []);
});

test("raw and compressed partition images satisfy the same requirement", () => {
  assert.deepEqual(
    missingImages(profile, [{ name: profile.partition_map.boot }, root]),
    [],
  );
  assert.deepEqual(
    missingImages(profile, [
      { name: profile.partition_map.boot + ".gz" },
      { name: profile.partition_map.root },
    ]),
    [],
  );
});

test("removing an image restores the missing-file requirement", () => {
  assert.deepEqual(
    missingImages(
      profile,
      [boot, root].filter((file) => file !== boot),
    ),
    [boot.name],
  );
});

test("only the selected strategy's writes determine required images", () => {
  const bootloader = {
    strategy: "fastboot-v1(lpi4a-uboot)",
    partition_map: { uboot: "u-boot.bin", unused: "unused.img" },
    distfiles: [{ name: "u-boot.bin" }],
  };
  assert.deepEqual(missingImages(bootloader, []), ["u-boot.bin"]);
  assert.deepEqual(missingImages(bootloader, [{ name: "u-boot.bin" }]), []);
});

test("known archives defer their content check to preparation", () => {
  for (const name of [
    "release.zip",
    "release.tar",
    "release.tar.gz",
    "release.tgz",
  ]) {
    const archive = { ...profile, distfiles: [{ name }] };
    assert.deepEqual(missingImages(archive, [{ name }]), []);
    assert.deepEqual(missingImages(archive, [boot]), [
      profile.partition_map.root,
    ]);
  }
});

test("custom files have no catalog requirements", () => {
  assert.deepEqual(missingImages(null, [{ name: "custom.img" }]), []);
});

test("partial matches narrow as additional images are selected", () => {
  const other = {
    ...profile,
    id: "other",
    distfiles: [boot, { name: "other-root.img" }],
    partition_map: { boot: profile.partition_map.boot, root: "other-root.img" },
  };
  assert.deepEqual(
    matchProfiles([profile, other], [boot]).map((item) => item.id),
    ["lpi4a", "other"],
  );
  assert.deepEqual(
    matchProfiles([profile, other], [boot, root]).map((item) => item.id),
    ["lpi4a"],
  );
});

test("release selection prefers the explicit choice over the source-page hint", () => {
  const other = { ...profile, id: "other" };
  assert.equal(resolveProfile([profile, other], "lpi4a", "other"), profile);
  assert.equal(resolveProfile([profile, other], "auto", "other"), other);
  assert.equal(resolveProfile([profile, other], "auto", null), undefined);
});

test("release selection ignores choices and hints that no longer match", () => {
  const other = { ...profile, id: "other" };
  assert.equal(resolveProfile([profile], "other", "other"), profile);
  assert.equal(
    resolveProfile([profile, other], "removed", "removed"),
    undefined,
  );
  assert.equal(resolveProfile([], "lpi4a", "lpi4a"), undefined);
});

test("bootloader steps retain their order and bind the same image to both writes", () => {
  const bootloader = {
    strategy: "fastboot-v1(lpi4a-uboot)",
    partition_map: { uboot: "u-boot.bin" },
  };
  assert.deepEqual(getSteps(bootloader), [
    { action: "flash", partition: "ram", name: "u-boot.bin" },
    { action: "reconnect", command: "reboot", delay: 1000 },
    { action: "flash", partition: "uboot", name: "u-boot.bin" },
  ]);
  const entry = {
    name: "release/u-boot.bin",
    file: new Blob(["bootloader"]),
    verified: true,
  };
  const plan = createPlan(bootloader, [entry]);
  assert.equal(plan[0].file, entry.file);
  assert.equal(plan[2].file, entry.file);
  assert.equal(plan[0].name, entry.name);
  assert.equal(plan[0].verified, true);
});

test("plan binding rejects missing, empty and ambiguous images", () => {
  const bootloader = {
    strategy: "fastboot-v1",
    partition_map: { boot: "boot.img" },
  };
  assert.throws(() => createPlan(bootloader, []), {
    code: "error.missingImage",
  });
  assert.throws(
    () => createPlan(bootloader, [{ name: "boot.img", file: new Blob() }]),
    { code: "error.emptyNamedImage" },
  );
  const file = new Blob(["boot"]);
  assert.throws(
    () =>
      createPlan(bootloader, [
        { name: "a/boot.img", file },
        { name: "b/boot.img", file },
      ]),
    { code: "error.ambiguousImage" },
  );
});
