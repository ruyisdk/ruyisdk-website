import { getSteps } from "./plan.mjs";

/** Adds files in selection order, replacing an earlier file with the same name. */
export function mergeFiles(files, added) {
  const merged = new Map(files.map((file) => [file.name, file]));
  for (const file of added) merged.set(file.name, file);
  return [...merged.values()];
}

/** Lists missing partition images, preferring their catalog download names.
 * Archive contents are checked during preparation because filenames cannot identify their members.
 */
export function missingImages(profile, files) {
  if (!profile) return [];
  const downloads = profile.distfiles || [];
  if (
    files.some(
      (file) =>
        /\.(zip|tar|tar\.gz|tgz)$/i.test(file.name) &&
        downloads.some((download) => download.name === file.name),
    )
  )
    return [];
  const names = new Set(
    files.map((file) => file.name.replace(/\.(gz|zst)$/i, "")),
  );
  const required = new Set(
    getSteps(profile)
      .filter((step) => step.action !== "reconnect")
      .map((step) => step.name),
  );
  return [...required]
    .filter((name) => !names.has(name))
    .map(
      (name) =>
        downloads.find((file) => file.name.replace(/\.(gz|zst)$/i, "") === name)
          ?.name || name,
    );
}

/** Returns profiles whose known download or image names cover every selected file.
 * Filename matching is a suggestion; preparation still verifies original downloads.
 */
export function matchProfiles(catalog, files) {
  if (!files.length) return [];
  return catalog.filter((profile) => {
    if (profile.systemFiles && !hasSystemImage(profile, files)) return false;
    const downloads = new Set(profile.distfiles.map((file) => file.name));
    const images = new Set(Object.values(profile.partition_map));
    return files.every((file) => {
      if (downloads.has(file.name)) return true;
      const name = file.name.replace(/\.(gz|zst)$/i, "");
      return images.has(name);
    });
  });
}

/** Checks for a known LicheePi system image, including its compressed download name. */
function hasSystemImage(profile, files) {
  return files.some((file) =>
    profile.systemFiles?.some(
      (name) =>
        name.replace(/\.(gz|zst)$/i, "") ===
        file.name.replace(/\.(gz|zst)$/i, ""),
    ),
  );
}

/** Prevents incompatible file selections from bypassing the required LicheePi bootstrap. */
export function hasProfileConflict(catalog, files) {
  return (
    catalog.some((profile) => hasSystemImage(profile, files)) &&
    !matchProfiles(catalog, files).length
  );
}

/** Requires an explicit LicheePi variant choice; otherwise prefers a choice, unique match or hint. */
export function resolveProfile(candidates, selectedId, suggestedId) {
  return (
    candidates.find((item) => item.id === selectedId) ||
    (candidates.some((item) => item.sourceProfileId)
      ? undefined
      : candidates.length === 1
        ? candidates[0]
        : candidates.find((item) => item.id === suggestedId))
  );
}
