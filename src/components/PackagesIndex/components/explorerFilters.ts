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

export type VendorMap = Record<string, string>;

export const getVendorId = (deviceId: string) => deviceId.split('-', 1)[0];

export const getVendorName = (vendorId: string, vendors: VendorMap) =>
  vendors[vendorId] || `${vendorId.charAt(0).toUpperCase()}${vendorId.slice(1)}`;

export const sortByDisplayName = (items: Entity[]) =>
  [...items].sort((left, right) =>
    left.display_name.localeCompare(right.display_name, undefined, {
      sensitivity: 'base',
    }),
  );

const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

const compareNumericIdentifiers = (left: string, right: string) => {
  if (left.length !== right.length) return left.length - right.length;
  if (left === right) return 0;
  return left < right ? -1 : 1;
};

const comparePrerelease = (left: string | undefined, right: string | undefined) => {
  if (left === right) return 0;
  if (!left) return 1;
  if (!right) return -1;

  const leftParts = left.split('.');
  const rightParts = right.split('.');
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const leftPart = leftParts[index];
    const rightPart = rightParts[index];
    if (leftPart === rightPart) continue;
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    const leftNumber = /^\d+$/.test(leftPart);
    const rightNumber = /^\d+$/.test(rightPart);
    if (leftNumber && rightNumber) return compareNumericIdentifiers(leftPart, rightPart);
    if (leftNumber) return -1;
    if (rightNumber) return 1;
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
};

const compareSemverDescending = (left: string, right: string) => {
  const leftMatch = left.match(semverPattern);
  const rightMatch = right.match(semverPattern);
  if (!leftMatch || !rightMatch) {
    return right.localeCompare(left, undefined, { sensitivity: 'base' });
  }

  for (let index = 1; index <= 3; index += 1) {
    const difference = compareNumericIdentifiers(rightMatch[index], leftMatch[index]);
    if (difference !== 0) return difference;
  }
  return -comparePrerelease(leftMatch[4], rightMatch[4]);
};

const sortPackagesByIdAndVersion = (items: PackageItem[]) =>
  [...items].sort((left, right) => {
    const idComparison = `${left.category}/${left.package}`.localeCompare(
      `${right.category}/${right.package}`,
      undefined,
      { sensitivity: 'base' },
    );
    if (idComparison !== 0) return idComparison;
    const versionComparison = compareSemverDescending(left.version, right.version);
    if (versionComparison !== 0) return versionComparison;
    return 0;
  });

function getDescendants(hierarchy: Record<string, string[]>, startNodes: string[]) {
  const visited = new Set<string>();
  const queue = [...startNodes];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const child of hierarchy[node] || []) {
      queue.push(child);
    }
  }

  return visited;
}

export function filterDevices(
  devices: Entity[], selectedVendors: Set<string>, selectedCpus: Set<string>, searchQuery: string,
  hierarchy: Record<string, string[]>, vendors: VendorMap,
) {
  const validDeviceIds = selectedCpus.size
    ? getDescendants(hierarchy, Array.from(selectedCpus, (cpu) => `cpu:${cpu}`))
    : null;

  return devices.filter((device) => {
    if (validDeviceIds && !validDeviceIds.has(`device:${device.id}`)) return false;
    const vendorId = getVendorId(device.id);
    if (selectedVendors.size > 0 && !selectedVendors.has(vendorId)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const haystack = [device.display_name, device.id, vendorId, vendors[vendorId] || '', ...(device.related || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function filterPackages(packages: PackageItem[], selectedCategories: Set<string>, searchQuery: string) {
  return sortPackagesByIdAndVersion(packages.filter((pkg) => {
    if (selectedCategories.size > 0 && !selectedCategories.has(pkg.category)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [pkg.package, pkg.category, pkg.version, pkg.desc || ''].join(' ').toLowerCase().includes(q);
  }));
}
