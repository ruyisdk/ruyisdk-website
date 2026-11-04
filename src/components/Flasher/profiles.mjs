/** Combines LicheePi system releases with matching U-Boot packages from image-combo metadata. */
export function combineProfiles(profiles, combos) {
  return profiles.flatMap((profile) => {
    if (profile.strategy !== "fastboot-v1") return [profile];
    const atom = profile.id.slice(0, profile.id.lastIndexOf("/"));
    const variants = combos.flatMap((combo) => {
      if (
        !combo.data.related?.some((item) =>
          item.startsWith("device-variant:sipeed-lpi4a@"),
        )
      )
        return [];
      const atoms = combo.data["image-combo"].package_atoms || [];
      if (!atoms.includes(atom)) return [];
      const bootloaders = profiles.filter(
        (item) =>
          item.strategy === "fastboot-v1(lpi4a-uboot)" &&
          atoms.includes(item.id.slice(0, item.id.lastIndexOf("/"))),
      );
      const bootloader = bootloaders.find(
        (item) => item.version === profile.version,
      );
      if (!bootloader)
        throw new Error(
          "Missing matching LicheePi U-Boot release for " + profile.id,
        );
      return [
        {
          ...profile,
          id: profile.id + "@" + combo.id,
          name: combo.data["image-combo"].display_name,
          sourceProfileId: profile.id,
          systemFiles: [
            ...profile.distfiles.map((file) => file.name),
            ...Object.values(profile.partition_map),
          ],
          strategy: "fastboot-v1(lpi4a-system)",
          partition_map: {
            ...profile.partition_map,
            uboot: bootloader.partition_map.uboot,
          },
          distfiles: [...profile.distfiles, ...bootloader.distfiles],
          bootloaderFiles: bootloader.distfiles,
        },
      ];
    });
    return variants.length ? variants : [profile];
  });
}
