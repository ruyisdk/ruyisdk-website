import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Server } from 'lucide-react';
import { useI18n } from '../i18n';
import type { Entity, PackageItem } from './explorerFilters';

export function DeviceList({ devices, variantNames }: { devices: Entity[]; variantNames: Map<string, string> }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {devices.map((device) => {
        const relatedVariants = (device.related || [])
          .filter((ref) => ref.startsWith('device-variant:'))
          .map((ref) => {
            const variantId = ref.slice('device-variant:'.length);
            return variantNames.get(variantId) || variantId;
          });

        return (
          <Link to={`/device/${device.id}`} key={device.id} className="block">
            <article className="pi-card h-full p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--ifm-color-primary)]">{device.display_name}</h3>
                  <p className="mt-1 text-xs font-mono text-[var(--subtle)]">{device.id}</p>
                </div>
                <span className="pi-chip px-2 py-1 text-[11px] font-medium">{t('deviceType')}</span>
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

      {devices.length === 0 && (
        <div className="col-span-full flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white dark:bg-[#151b23] text-center shadow-sm">
          <Server className="h-10 w-10 text-[var(--ifm-color-primary)]" />
          <div className="text-lg font-medium">{t('noDevices')}</div>
          <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
        </div>
      )}
    </div>
  );
}

export function PackageList({ packages }: { packages: PackageItem[] }) {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      {packages.map((pkg) => (
        <Link to={`/package/${pkg.category}/${pkg.package}/${pkg.version}`} key={`${pkg.category}-${pkg.package}-${pkg.version}`} className="block">
          <article className="pi-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[var(--ifm-color-primary)]">{pkg.package}</h3>
                  <span className="rounded-md bg-[var(--tintColor)] px-2 py-0.5 text-xs font-mono text-[var(--subtle)]">{pkg.version}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--light)]">{pkg.desc || t('noDescription')}</p>
              </div>
              <span className="pi-chip self-start px-3 py-1 text-xs font-medium">
                {pkg.category}
              </span>
            </div>
          </article>
        </Link>
      ))}

      {packages.length === 0 && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white dark:bg-[#151b23] text-center shadow-sm">
          <Package className="h-10 w-10 text-[var(--ifm-color-primary)]" />
          <div className="text-lg font-medium">{t('noPackages')}</div>
          <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
        </div>
      )}
    </div>
  );
}
