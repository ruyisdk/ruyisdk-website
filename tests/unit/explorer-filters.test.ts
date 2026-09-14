import { describe, it, expect } from 'vitest';
import {
  sortByDisplayName,
  getDescendants,
  filterDevices,
  filterPackages,
  Entity,
  PackageItem,
} from '../../src/components/PackagesIndex/components/Explorer.filters';

describe('explorer-filters', () => {
  it('sortByDisplayName sorts entities alphabetically by display_name', () => {
    const items: Entity[] = [
      { type: 'arch', id: 'riscv64', display_name: 'RISC-V 64' },
      { type: 'arch', id: 'aarch64', display_name: 'ARM 64' },
      { type: 'arch', id: 'x86_64', display_name: 'x86-64' },
    ];
    const sorted = sortByDisplayName(items);
    expect(sorted.map((i) => i.display_name)).toEqual(['ARM 64', 'RISC-V 64', 'x86-64']);
  });

  it('getDescendants traverses hierarchy tree recursively', () => {
    const hierarchy: Record<string, string[]> = {
      'arch:riscv64': ['cpu:c908', 'cpu:c910'],
      'cpu:c908': ['device:k230'],
      'cpu:c910': ['device:th1520'],
    };

    const descendants = getDescendants(hierarchy, ['arch:riscv64']);
    expect(descendants.has('cpu:c908')).toBe(true);
    expect(descendants.has('cpu:c910')).toBe(true);
    expect(descendants.has('device:k230')).toBe(true);
    expect(descendants.has('device:th1520')).toBe(true);
  });

  it('filterDevices filters devices by arch, cpu and query', () => {
    const devices: Entity[] = [
      { type: 'device', id: 'k230', display_name: 'Kendryte K230', related: ['vendor:canaan'] },
      { type: 'device', id: 'th1520', display_name: 'LicheePi 4A', related: ['vendor:sipeed'] },
    ];
    const hierarchy: Record<string, string[]> = {
      'arch:riscv64': ['device:k230', 'device:th1520'],
      'cpu:c908': ['device:k230'],
    };

    const filteredByCpu = filterDevices(devices, new Set(), new Set(['c908']), '', hierarchy);
    expect(filteredByCpu.length).toBe(1);
    expect(filteredByCpu[0].id).toBe('k230');

    const filteredByQuery = filterDevices(devices, new Set(), new Set(), 'sipeed', hierarchy);
    expect(filteredByQuery.length).toBe(1);
    expect(filteredByQuery[0].id).toBe('th1520');
  });

  it('filterPackages filters packages by category and search query', () => {
    const packages: PackageItem[] = [
      { category: 'toolchain', package: 'gnu-plct-rv64ilp32', version: '2024.08.01', desc: 'GNU Toolchain' },
      { category: 'emulator', package: 'qemu', version: '8.2.0', desc: 'QEMU emulator' },
    ];

    const filteredByCategory = filterPackages(packages, new Set(['toolchain']), '');
    expect(filteredByCategory.length).toBe(1);
    expect(filteredByCategory[0].package).toBe('gnu-plct-rv64ilp32');

    const filteredByQuery = filterPackages(packages, new Set(), 'emulator');
    expect(filteredByQuery.length).toBe(1);
    expect(filteredByQuery[0].package).toBe('qemu');
  });
});
