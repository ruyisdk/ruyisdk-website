import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import flasherPlugin from "./plugins/usb-flasher.cjs";
import { combineProfiles } from "../src/components/Flasher/profiles.mjs";
import { createPlan } from "../src/components/Flasher/plan.mjs";
import {
  hasProfileConflict,
  matchProfiles,
  missingImages,
  resolveProfile,
} from "../src/components/Flasher/match.mjs";
import { FlashClient } from "../src/components/Flasher/client.mjs";

const catalog = await flasherPlugin({
  siteDir: fileURLToPath(new URL("../", import.meta.url)),
}).loadContent();
const sourceId = "board-image/revyos-sipeed-lpi4a/0.20260504.0";
const variants = catalog.filter((item) => item.sourceProfileId === sourceId);
const systemFiles = [
  { name: "boot-lpi4a-20260504_080619.ext4.zst" },
  { name: "root-lpi4a-20260504_080619.ext4.zst" },
];

test("real system images require an explicit board variant and matching U-Boot", () => {
  assert.equal(variants.length, 2);
  assert.equal(
    catalog.some((item) => item.id === sourceId),
    false,
  );
  const matches = matchProfiles(catalog, systemFiles);
  assert.deepEqual(matches, variants);
  assert.equal(resolveProfile(matches, "auto", sourceId), undefined);
  for (const variant of variants) {
    assert.equal(resolveProfile(matches, variant.id, sourceId), variant);
    assert.deepEqual(missingImages(variant, systemFiles), [
      variant.partition_map.uboot,
    ]);
    const files = [...systemFiles, { name: variant.partition_map.uboot }];
    assert.deepEqual(matchProfiles(catalog, files), [variant]);
    assert.equal(resolveProfile([variant], "auto", sourceId), undefined);
    assert.deepEqual(missingImages(variant, files), []);
    assert.equal(hasProfileConflict(catalog, files), false);
    assert.ok(variant.bootloaderFiles[0].checksums.sha256);
    assert.match(variant.bootloaderFiles[0].url, /\/20260504\//);
  }
});

test("both RAM variants produce bootstrap, reconnect, U-Boot, boot and root in order", () => {
  for (const variant of variants) {
    const entries = Object.values(variant.partition_map).map((name) => ({
      name,
      file: new Blob([name]),
      verified: true,
    }));
    const plan = createPlan(variant, entries);
    assert.deepEqual(
      plan.map((step) => step.partition || step.command),
      ["ram", "reboot", "uboot", "boot", "root"],
    );
    assert.equal(plan[0].file, plan[2].file);
    assert.equal(plan[1].action, "reconnect");
    assert.throws(
      () =>
        createPlan(
          variant,
          entries.filter((entry) => entry.name !== variant.partition_map.uboot),
        ),
      { code: "error.missingImage" },
    );
  }
});

test("mixed U-Boot variants and unrelated files cannot fall back to custom mode", () => {
  assert.equal(
    hasProfileConflict(catalog, [
      ...systemFiles,
      ...variants.map((item) => ({ name: item.partition_map.uboot })),
    ]),
    true,
  );
  assert.equal(
    hasProfileConflict(catalog, [...systemFiles, { name: "wrong-u-boot.bin" }]),
    true,
  );
  assert.equal(hasProfileConflict(catalog, [{ name: "custom.img" }]), false);
  assert.equal(hasProfileConflict(catalog, systemFiles), false);
});

test("bootloader-only selection retains the standalone update strategy", () => {
  const matches = matchProfiles(catalog, [
    { name: variants[0].partition_map.uboot },
  ]);
  assert.ok(matches.length);
  assert.ok(
    matches.every((item) => item.strategy === "fastboot-v1(lpi4a-uboot)"),
  );
});

test("every catalog LicheePi combination keeps checksums and requires all plan images", () => {
  for (const variant of catalog.filter((item) => item.sourceProfileId)) {
    assert.equal(variant.strategy, "fastboot-v1(lpi4a-system)");
    assert.ok(variant.bootloaderFiles.every((file) => file.checksums));
    assert.ok(missingImages(variant, []).includes(variant.partition_map.uboot));
  }
});

test("a missing same-version U-Boot fails catalog construction instead of guessing", () => {
  const profiles = [
    { id: "board-image/system/2", version: "2", strategy: "fastboot-v1" },
    {
      id: "board-image/uboot/1",
      version: "1",
      strategy: "fastboot-v1(lpi4a-uboot)",
    },
  ];
  const combos = [
    {
      data: {
        related: ["device-variant:sipeed-lpi4a@8g"],
        "image-combo": {
          package_atoms: ["board-image/system", "board-image/uboot"],
        },
      },
    },
  ];
  assert.throws(
    () => combineProfiles(profiles, combos),
    /Missing matching LicheePi U-Boot/,
  );
  assert.throws(
    () => combineProfiles([profiles[0]], combos),
    /Missing matching LicheePi U-Boot/,
  );
  const otherBoard = [
    {
      ...combos[0],
      data: { ...combos[0].data, related: ["device-variant:milkv-meles@8g"] },
    },
  ];
  assert.deepEqual(combineProfiles(profiles, otherBoard), profiles);
});

/** Creates a USB transport stub with queued fastboot responses and a transfer trace. */
function mockClient(responses) {
  const commands = [];
  const logs = [];
  const client = new FlashClient((message) => logs.push(message));
  client.device = {
    opened: true,
    async transferOut(endpoint, data) {
      commands.push(new TextDecoder().decode(data));
      return { status: "ok", bytesWritten: data.byteLength };
    },
    async transferIn() {
      assert.ok(responses.length, "Unexpected USB read");
      return {
        status: "ok",
        data: new DataView(new TextEncoder().encode(responses.shift()).buffer),
      };
    },
  };
  client.interfaceNumber = 0;
  return { client, commands, logs };
}

test("buffer overflow during getvar aborts before any image download", async () => {
  const { client, commands, logs } = mockClient(["FAILbuffer overflow"]);
  await assert.rejects(client.flashBlob("boot", new Blob(["image"])), {
    status: "FAIL",
    command: "getvar:max-download-size",
    message: "buffer overflow",
  });
  assert.deepEqual(commands, ["getvar:max-download-size"]);
  assert.deepEqual(logs, [
    "> getvar:max-download-size",
    "< FAIL buffer overflow",
  ]);
});

test("unsupported variable uses a fallback, then follows the download handshake", async () => {
  const { client, commands } = mockClient([
    "FAILVariable not implemented",
    "DATA00000005",
    "OKAY",
    "OKAY",
  ]);
  await client.flashBlob("ram", new Blob(["image"]));
  assert.deepEqual(commands, [
    "getvar:max-download-size",
    "download:00000005",
    "image",
    "flash:ram",
  ]);
});

test("download rejection retains the command and sends no payload", async () => {
  const { client, commands } = mockClient(["FAILbuffer overflow"]);
  await assert.rejects(client.upload(new Uint8Array(5).buffer), {
    status: "FAIL",
    command: "download:00000005",
  });
  assert.deepEqual(commands, ["download:00000005"]);
});

test("payload and flash failures retain their respective command context", async () => {
  const payload = mockClient(["DATA00000005", "FAILwrite failed"]);
  await assert.rejects(payload.client.upload(new Uint8Array(5).buffer), {
    command: "download (payload)",
  });
  const flash = mockClient(["FAILwrite failed"]);
  await assert.rejects(flash.client.runCommand("flash:boot"), {
    command: "flash:boot",
  });
});
