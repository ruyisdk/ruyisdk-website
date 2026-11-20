import React, { useEffect, useMemo, useState } from 'react';
import { getEntities, getPackages, getHierarchy, getVendors } from '../api';
import { Search, Cpu, Factory, Tag, X, Filter } from 'lucide-react';
import { useI18n } from '../i18n';
import { filterDevices, filterPackages, getVendorId, getVendorName, sortByDisplayName } from './explorerFilters';
import type { Entity, PackageItem, VendorMap } from './explorerFilters';
import { DeviceList, PackageList } from './ExplorerResults';

let lastScrollTop = 0;
let lastMainScrollTop = 0;
let lastActiveTab: 'devices' | 'packages' = 'devices';
let lastSearchQuery = '';
let lastSelectedVendors = new Set<string>();
let lastSelectedCpus = new Set<string>();
let lastSelectedCategories = new Set<string>();

let cachedEntities: Entity[] | null = null;
let cachedPackages: PackageItem[] | null = null;
let cachedHierarchy: Record<string, string[]> | null = null;
const cachedVendors: Partial<Record<'en' | 'zh-Hans', VendorMap>> = {};

let isRestoring = false;

export default function Explorer() {
  const { locale, t } = useI18n();
  const vendorLocale = locale === 'zh-CN' ? 'zh-Hans' : 'en';
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [entities, setEntities] = useState<Entity[]>(cachedEntities || []);
  const [packages, setPackages] = useState<PackageItem[]>(cachedPackages || []);
  const [hierarchy, setHierarchy] = useState<Record<string, string[]>>(cachedHierarchy || {});
  const [vendors, setVendors] = useState<VendorMap>(cachedVendors[vendorLocale] || {});
  const [loading, setLoading] = useState(!cachedEntities || !cachedVendors[vendorLocale]);
  const [activeTab, setActiveTab] = useState<'devices' | 'packages'>(lastActiveTab);
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery);
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(lastSelectedVendors);
  const [selectedCpus, setSelectedCpus] = useState<Set<string>>(lastSelectedCpus);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(lastSelectedCategories);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    lastActiveTab = activeTab;
  }, [activeTab]);

  useEffect(() => {
    lastSearchQuery = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    lastSelectedVendors = selectedVendors;
  }, [selectedVendors]);

  useEffect(() => {
    lastSelectedCpus = selectedCpus;
  }, [selectedCpus]);

  useEffect(() => {
    lastSelectedCategories = selectedCategories;
  }, [selectedCategories]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (!loading && !isRestoring) {
        lastScrollTop = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      let attempts = 0;
      isRestoring = true;
      const restoreScroll = () => {
        let isDone = true;

        if (lastScrollTop > 0) {
          window.scrollTo(0, lastScrollTop);
          const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
          const isAtMax = Math.abs(window.scrollY - maxScrollY) < 5;
          const isAtTarget = Math.abs(window.scrollY - lastScrollTop) < 5;
          if (!isAtTarget && !isAtMax) {
            isDone = false;
          }
        }

        if (mainRef.current && lastMainScrollTop > 0) {
          const el = mainRef.current;
          el.scrollTop = lastMainScrollTop;
          const maxScrollTop = el.scrollHeight - el.clientHeight;
          const isAtMax = Math.abs(el.scrollTop - maxScrollTop) < 5;
          const isAtTarget = Math.abs(el.scrollTop - lastMainScrollTop) < 5;
          if (!isAtTarget && !isAtMax) {
            isDone = false;
          }
        }

        attempts++;
        if (!isDone && attempts < 15) {
          setTimeout(restoreScroll, 30);
        } else {
          setTimeout(() => { isRestoring = false; }, 50);
        }
      };

      const timer = setTimeout(restoreScroll, 50);
      return () => {
        clearTimeout(timer);
        isRestoring = false;
      };
    }
  }, [loading]);

  useEffect(() => {
    const fetchAll = async () => {
      const cachedVendorMap = cachedVendors[vendorLocale];
      if (cachedEntities && cachedPackages && cachedHierarchy && cachedVendorMap) {
        setVendors(cachedVendorMap);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [ents, pkgs, hier, vendorMap] = await Promise.all([
          getEntities(),
          getPackages(),
          getHierarchy(),
          getVendors(vendorLocale),
        ]);
        cachedEntities = ents;
        cachedPackages = pkgs;
        cachedHierarchy = hier;
        cachedVendors[vendorLocale] = vendorMap;
        setEntities(ents);
        setPackages(pkgs);
        setHierarchy(hier);
        setVendors(vendorMap);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [vendorLocale]);

  const cpus = useMemo(
    () => sortByDisplayName(entities.filter((entity) => entity.type === 'cpu')),
    [entities],
  );
  const devices = useMemo(
    () => [...entities].filter((entity) => entity.type === 'device').sort((left, right) =>
      left.id.localeCompare(right.id, undefined, { sensitivity: 'base' }),
    ),
    [entities],
  );
  const vendorOptions = useMemo(
    () => Array.from(new Set(devices.map((device) => getVendorId(device.id))))
      .map((id) => ({ id, name: getVendorName(id, vendors) }))
      .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: 'base' })),
    [devices, vendors],
  );
  const categories = useMemo(
    () => Array.from(new Set(packages.map((pkg) => pkg.category))).sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: 'base' }),
    ),
    [packages],
  );
  const variantNames = useMemo(
    () => new Map(
      entities
        .filter((entity) => entity.type === 'device-variant')
        .map((entity) => [entity.id, entity.display_name]),
    ),
    [entities],
  );

  const renderIosSelector = () => (
    <div className="relative mb-4 flex w-full shrink-0 rounded-lg bg-slate-200/80 p-0.5 dark:bg-[#11161d] dark:ring-1 dark:ring-white/8">
      <div 
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] bg-white dark:bg-[#232c3d] rounded-md shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeTab === 'packages' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        onClick={() => setActiveTab('devices')}
        className={`z-10 flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md py-1.5 text-xs font-semibold transition-colors duration-200 ${
          activeTab === 'devices'
            ? 'text-slate-900 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        {t('listByDevice')}
        <span className={`shrink-0 rounded-full px-1.5 py-0.2 text-[10px] transition-colors duration-200 ${
          activeTab === 'devices' ? 'bg-slate-100 dark:bg-[#151b23] text-slate-600 dark:text-slate-300' : 'bg-slate-200/50 dark:bg-white/6 text-slate-500 dark:text-slate-400'
        }`}>
          {devices.length}
        </span>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('packages')}
        className={`z-10 flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md py-1.5 text-xs font-semibold transition-colors duration-200 ${
          activeTab === 'packages'
            ? 'text-slate-900 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        {t('listByPackages')}
        <span className={`shrink-0 rounded-full px-1.5 py-0.2 text-[10px] transition-colors duration-200 ${
          activeTab === 'packages' ? 'bg-slate-100 dark:bg-[#151b23] text-slate-600 dark:text-slate-300' : 'bg-slate-200/50 dark:bg-white/6 text-slate-500 dark:text-slate-400'
        }`}>
          {packages.length}
        </span>
      </button>
    </div>
  );

  const toggleFilter = (set: Set<string>, value: string, setter: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filteredDevices = useMemo(
    () => filterDevices(devices, selectedVendors, selectedCpus, searchQuery, hierarchy, vendors),
    [devices, selectedVendors, selectedCpus, searchQuery, hierarchy, vendors],
  );
  const filteredPackages = useMemo(
    () => filterPackages(packages, selectedCategories, searchQuery),
    [packages, selectedCategories, searchQuery],
  );

  const activeFiltersCount = activeTab === 'devices'
    ? selectedVendors.size + selectedCpus.size
    : selectedCategories.size;

  const searchPlaceholder = activeTab === 'devices' ? t('searchPlaceholderDevices') : t('searchPlaceholderPackages');
  const showingCount = activeTab === 'devices' ? filteredDevices.length : filteredPackages.length;
  const listLabel = activeTab === 'devices' ? t('listByDevice') : t('listByPackages');
  const activeDescription = activeTab === 'devices' ? t('deviceListDescription') : t('packageListDescription');

  return (
    <>
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[var(--ifm-z-index-overlay)] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <aside className="pi-surface absolute right-0 top-0 flex h-dvh max-h-dvh w-80 flex-col overflow-hidden bg-white dark:bg-[#151b23] p-4 shadow-lg">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <h3 className="font-semibold text-[var(--text)]">{t('activeFilters')}</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label={t('clearFilters')} className="text-[var(--subtle)]">✕</button>
            </div>
            <div className="mb-4 shrink-0">
              <label className="relative block">
                <span className="sr-only">{searchPlaceholder}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-[var(--divider)] bg-white dark:bg-[#0d1117]/90 py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--subtle)] outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
            </div>
            {renderIosSelector()}
            {activeTab === 'devices' ? (
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Factory className="h-4 w-4 text-[var(--subtle)]" /> {t('boardVendors')}
                  </h2>
                  <div className="space-y-2">
                    {vendorOptions.map((vendor) => (
                      <label key={vendor.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input type="checkbox" checked={selectedVendors.has(vendor.id)} onChange={() => toggleFilter(selectedVendors, vendor.id, setSelectedVendors)} className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                        <span className="truncate" title={vendor.name}>{vendor.name}</span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Cpu className="h-4 w-4 text-[var(--subtle)]" /> {t('cpus')}
                  </h2>
                  <div className="space-y-2">
                    {cpus.map((cpu) => (
                      <label key={cpu.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input type="checkbox" checked={selectedCpus.has(cpu.id)} onChange={() => toggleFilter(selectedCpus, cpu.id, setSelectedCpus)} className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                        <span className="truncate" title={cpu.display_name}>{cpu.display_name}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <section className="min-h-0 flex-1 overflow-y-auto pr-1">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-[var(--subtle)]" /> {t('categories')}
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                      <input type="checkbox" checked={selectedCategories.has(category)} onChange={() => toggleFilter(selectedCategories, category, setSelectedCategories)} className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      )}

      <div className="pi-animate-fade-in-up flex h-full flex-col text-[var(--text)]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden px-4 pt-(--ruyi-page-start) pb-[calc(var(--ruyi-page-end)-2rem)]">
        <aside className="hidden w-72 shrink-0 overflow-y-auto pr-6 md:block">
          <div className="pi-surface flex max-h-[calc(100dvh-7rem)] flex-col rounded-[1.5rem] p-4">
            <div className="mb-3 shrink-0">
              <label className="relative block">
                <span className="sr-only">{searchPlaceholder}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-[var(--divider)] bg-white dark:bg-[#0d1117]/90 py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--subtle)] outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
            </div>

            {renderIosSelector()}

            {activeTab === 'devices' ? (
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Factory className="h-4 w-4 text-[var(--subtle)]" /> {t('boardVendors')}
                  </h2>
                  <div className="space-y-2">
                    {vendorOptions.map((vendor) => (
                      <label key={vendor.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input
                          type="checkbox"
                          checked={selectedVendors.has(vendor.id)}
                          onChange={() => toggleFilter(selectedVendors, vendor.id, setSelectedVendors)}
                          className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                        />
                        <span className="truncate" title={vendor.name}>{vendor.name}</span>
                      </label>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Cpu className="h-4 w-4 text-[var(--subtle)]" /> {t('cpus')}
                  </h2>
                  <div className="space-y-2">
                    {cpus.map((cpu) => (
                      <label key={cpu.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input
                          type="checkbox"
                          checked={selectedCpus.has(cpu.id)}
                          onChange={() => toggleFilter(selectedCpus, cpu.id, setSelectedCpus)}
                          className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                        />
                        <span className="truncate" title={cpu.display_name}>{cpu.display_name}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <section className="min-h-0 flex-1 overflow-y-auto pr-1">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-[var(--subtle)]" /> {t('categories')}
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category)}
                        onChange={() => toggleFilter(selectedCategories, category, setSelectedCategories)}
                        className="rounded border-[var(--divider)] accent-[var(--ifm-color-primary)] dark:bg-[#0d1117] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                      />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        <main
          ref={mainRef}
          onScroll={(e) => {
            if (!loading && !isRestoring) {
              lastMainScrollTop = e.currentTarget.scrollTop;
            }
          }}
          className="-mr-4 flex-1 overflow-y-auto pb-8 pr-4 md:pt-8 md:pl-8"
        >
          <div className="block md:hidden mb-4">
            <div className="flex items-center gap-2 mb-3">
              <label className="relative flex-1">
                <span className="sr-only">{searchPlaceholder}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-[var(--divider)] bg-white dark:bg-[#0d1117]/90 py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--subtle)] outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--divider)] bg-white dark:bg-[#151b23] p-2 text-[var(--subtle)] shadow-sm"
                aria-label={t('activeFilters')}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            {renderIosSelector()}
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--subtle)]">
            <div className="min-w-0">
              <span className="font-medium text-[var(--text)]">{listLabel}</span>
              <span className="mx-2">·</span>
              <span>{t('results')}: {showingCount}</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedVendors(new Set());
                  setSelectedCpus(new Set());
                  setSelectedCategories(new Set());
                }}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[var(--subtle)] transition hover:bg-[var(--tintColor)] hover:text-[var(--text)]"
              >
                <X className="h-4 w-4" /> {t('clearFilters')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--subtle)]">{t('loading')}</div>
          ) : activeTab === 'devices' ? (
            <DeviceList devices={filteredDevices} variantNames={variantNames} />
          ) : (
            <PackageList packages={filteredPackages} />
          )}
        </main>
      </div>
      </div>
    </>
  );
}
