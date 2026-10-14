const fs = require("node:fs");
const path = require("node:path");

/** Provides fastboot profiles and configures the browser Zstandard binding. */
module.exports = function flasherPlugin(context) {
  const base = path.join(context.siteDir, "static/data/api/api_packages_index");
  return {
    name: "usb-flasher",
    async loadContent() {
      const { STRATEGIES } =
        await import("../../src/components/Flasher/plan.mjs");
      const { combineProfiles } =
        await import("../../src/components/Flasher/profiles.mjs");
      const packages = JSON.parse(
        fs.readFileSync(path.join(base, "packages.json"), "utf8"),
      );
      const profiles = [];
      for (const pkg of packages) {
        const detail = JSON.parse(
          fs.readFileSync(
            path.join(
              base,
              "packages",
              pkg.category,
              pkg.package,
              pkg.version + ".json",
            ),
            "utf8",
          ),
        );
        const provisionable = detail.data?.provisionable;
        if (!STRATEGIES.includes(provisionable?.strategy)) continue;
        profiles.push({
          id: pkg.category + "/" + pkg.package + "/" + pkg.version,
          name: pkg.package,
          version: pkg.version,
          ...provisionable,
          distfiles: detail.data.distfiles.map((file) => ({
            name: file.name,
            size: file.size,
            checksums: file.checksums,
            url: file.resolved_urls?.find((url) => url.startsWith("https://")),
          })),
        });
      }
      const comboDir = path.join(base, "entities/image-combo");
      const combos = fs
        .readdirSync(comboDir)
        .filter((name) => name.endsWith(".json"))
        .map((name) =>
          JSON.parse(fs.readFileSync(path.join(comboDir, name), "utf8")),
        );
      return combineProfiles(profiles, combos);
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
    getPathsToWatch() {
      return [
        path.join(base, "packages.json"),
        path.join(base, "packages/**/*.json"),
        path.join(base, "entities/image-combo/*.json"),
      ];
    },
    configureWebpack() {
      return {
        resolve: { fallback: { fs: false, path: false, crypto: false } },
      };
    },
  };
};
