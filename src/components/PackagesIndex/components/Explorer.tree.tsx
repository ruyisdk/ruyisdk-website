import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Server, Cpu, Layers, Tag } from 'lucide-react';
import { Entity, PackageItem } from './Explorer.filters';

interface FilterSectionsProps {
  activeTab: 'devices' | 'packages';
  archs: Entity[];
  cpus: Entity[];
  categories: string[];
  selectedArchs: Set<string>;
  selectedCpus: Set<string>;
  selectedCategories: Set<string>;
  toggleFilter: (
    set: Set<string>,
    value: string,
    setter: (next: Set<string>) => void,
  ) => void;
  setSelectedArchs: (next: Set<string>) => void;
  setSelectedCpus: (next: Set<string>) => void;
  setSelectedCategories: (next: Set<string>) => void;
  t: (key: string) => string;
}

export function FilterSections({
  activeTab,
  archs,
  cpus,
  categories,
  selectedArchs,
  selectedCpus,
  selectedCategories,
  toggleFilter,
  setSelectedArchs,
  setSelectedCpus,
  setSelectedCategories,
  t,
}: FilterSectionsProps) {
  if (activeTab === 'devices') {
    return (
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Layers className="h-4 w-4 text-[var(--subtle)]" /> {t('architectures')}
          </h2>
          <div className="space-y-2">
            {archs.map((arch) => (
              <label
                key={arch.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]"
              >
                <input
                  type="checkbox"
                  checked={selectedArchs.has(arch.id)}
                  onChange={() => toggleFilter(selectedArchs, arch.id, setSelectedArchs)}
                  className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                />
                <span className="truncate" title={arch.display_name}>
                  {arch.display_name}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Cpu className="h-4 w-4 text-[var(--subtle)]" /> {t('cpus')}
          </h2>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {cpus.map((cpu) => (
              <label
                key={cpu.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]"
              >
                <input
                  type="checkbox"
                  checked={selectedCpus.has(cpu.id)}
                  onChange={() => toggleFilter(selectedCpus, cpu.id, setSelectedCpus)}
                  className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                />
                <span className="truncate" title={cpu.display_name}>
                  {cpu.display_name}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Tag className="h-4 w-4 text-[var(--subtle)]" /> {t('categories')}
      </h2>
      <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
        {categories.map((category) => (
          <label
            key={category}
            className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]"
          >
            <input
              type="checkbox"
              checked={selectedCategories.has(category)}
              onChange={() =>
                toggleFilter(selectedCategories, category, setSelectedCategories)
              }
              className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
            />
            <span className="truncate">{category}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

interface DeviceListProps {
  devices: Entity[];
  variantNames: Map<string, string>;
  t: (key: string) => string;
}

export function DeviceList({ devices, variantNames, t }: DeviceListProps) {
  if (devices.length === 0) {
    return (
      <div className="col-span-full flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white text-center shadow-sm">
        <Server className="h-10 w-10 text-[var(--home-ruyi-blue)]" />
        <div className="text-lg font-medium">{t('noDevices')}</div>
        <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {devices.map((device) => {
        const relatedVariants = (device.related || [])
          .filter((ref: string) => ref.startsWith('device-variant:'))
          .map((ref: string) => {
            const variantId = ref.slice('device-variant:'.length);
            return variantNames.get(variantId) || variantId;
          });

        return (
          <Link to={`/device/${device.id}`} key={device.id} className="block">
            <article className="pi-card h-full p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ifm-color-primary)]">
                    {device.display_name}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-[var(--subtle)]">
                    {device.id}
                  </p>
                </div>
                <span className="pi-chip px-2 py-1 text-[11px] font-medium">
                  {t('deviceType')}
                </span>
              </div>
              {relatedVariants.length > 0 && (
                <div className="text-sm text-[var(--light)]">
                  <span className="font-medium">{t('variants')}:</span>{' '}
                  {relatedVariants.join(', ')}
                </div>
              )}
            </article>
          </Link>
        );
      })}
    </div>
  );
}

interface PackageListProps {
  packages: PackageItem[];
  t: (key: string) => string;
}

export function PackageList({ packages, t }: PackageListProps) {
  if (packages.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white text-center shadow-sm">
        <Package className="h-10 w-10 text-[var(--home-ruyi-blue)]" />
        <div className="text-lg font-medium">{t('noPackages')}</div>
        <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {packages.map((pkg) => (
        <Link
          to={`/package/${pkg.category}/${pkg.package}/${pkg.version}`}
          key={`${pkg.category}-${pkg.package}-${pkg.version}`}
          className="block"
        >
          <article className="pi-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[var(--ifm-color-primary)]">
                    {pkg.package}
                  </h3>
                  <span className="rounded-md bg-[var(--tintColor)] px-2 py-0.5 text-xs font-mono text-[var(--subtle)]">
                    {pkg.version}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--light)]">
                  {pkg.desc || t('noDescription')}
                </p>
              </div>
              <span className="pi-chip px-3 py-1 text-xs font-medium">
                {pkg.category}
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
