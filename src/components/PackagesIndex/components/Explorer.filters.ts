export type Entity = {
  type: string;
  id: string;
  display_name: string;
  related?: string[];
};

export type PackageItem = {
  category: string;
  package: string;
  version: string;
  desc?: string;
};

export const sortByDisplayName = (items: Entity[]): Entity[] =>
  [...items].sort((left, right) =>
    left.display_name.localeCompare(right.display_name, undefined, {
      sensitivity: 'base',
    }),
  );

export function getDescendants(
  hierarchy: Record<string, string[]>,
  startNodes: string[],
): Set<string> {
  const visited = new Set<string>();
  const queue = [...startNodes];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node || visited.has(node)) continue;
    visited.add(node);
    for (const child of hierarchy[node] || []) {
      queue.push(child);
    }
  }

  return visited;
}

export function filterDevices(
  devices: Entity[],
  selectedArchs: Set<string>,
  selectedCpus: Set<string>,
  searchQuery: string,
  hierarchy: Record<string, string[]>,
): Entity[] {
  let validDeviceIds: Set<string> | null = null;

  if (selectedArchs.size > 0 || selectedCpus.size > 0) {
    const archDescendants =
      selectedArchs.size > 0
        ? getDescendants(
            hierarchy,
            Array.from(selectedArchs).map((arch) => `arch:${arch}`),
          )
        : null;
    const cpuDescendants =
      selectedCpus.size > 0
        ? getDescendants(
            hierarchy,
            Array.from(selectedCpus).map((cpu) => `cpu:${cpu}`),
          )
        : null;

    validDeviceIds = new Set(devices.map((device) => `device:${device.id}`));

    if (archDescendants) {
      validDeviceIds = new Set(
        [...validDeviceIds].filter((id) => archDescendants.has(id)),
      );
    }
    if (cpuDescendants) {
      validDeviceIds = new Set(
        [...validDeviceIds].filter((id) => cpuDescendants.has(id)),
      );
    }
  }

  return devices.filter((device) => {
    if (validDeviceIds && !validDeviceIds.has(`device:${device.id}`)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const haystack = [device.display_name, device.id, ...(device.related || [])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function filterPackages(
  packages: PackageItem[],
  selectedCategories: Set<string>,
  searchQuery: string,
): PackageItem[] {
  return packages.filter((pkg) => {
    if (selectedCategories.size > 0 && !selectedCategories.has(pkg.category))
      return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [pkg.package, pkg.category, pkg.version, pkg.desc || '']
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}
