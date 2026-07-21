import React, { useEffect, useMemo, useState } from 'react';
import { getEntities, getPackages, getHierarchy } from '../api';
import { Link } from 'react-router-dom';
import { Search, Package, Server, Cpu, Layers, Tag, X, Filter } from 'lucide-react';
import { useI18n } from '../i18n';

type Entity = {
  type: string;
  id: string;
  display_name: string;
  related?: string[];
};

type PackageItem = {
  category: string;
  package: string;
  version: string;
  desc?: string;
};

let lastScrollTop = 0;
let lastMainScrollTop = 0;
let lastActiveTab: 'devices' | 'packages' = 'devices';
let lastSearchQuery = '';
let lastSelectedArchs = new Set<string>();
let lastSelectedCpus = new Set<string>();
let lastSelectedCategories = new Set<string>();

let cachedEntities: Entity[] | null = null;
let cachedPackages: PackageItem[] | null = null;
let cachedHierarchy: Record<string, string[]> | null = null;

let isRestoring = false;

export default function Explorer() {
  const { t } = useI18n();
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [entities, setEntities] = useState<Entity[]>(cachedEntities || []);
  const [packages, setPackages] = useState<PackageItem[]>(cachedPackages || []);
  const [hierarchy, setHierarchy] = useState<Record<string, string[]>>(cachedHierarchy || {});
  const [loading, setLoading] = useState(!cachedEntities);
  const [activeTab, setActiveTab] = useState<'devices' | 'packages'>(lastActiveTab);
  const [searchQuery, setSearchQuery] = useState(lastSearchQuery);
  const [selectedArchs, setSelectedArchs] = useState<Set<string>>(lastSelectedArchs);
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
    lastSelectedArchs = selectedArchs;
  }, [selectedArchs]);

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
      if (cachedEntities && cachedPackages && cachedHierarchy) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [ents, pkgs, hier] = await Promise.all([getEntities(), getPackages(), getHierarchy()]);
        cachedEntities = ents;
        cachedPackages = pkgs;
        cachedHierarchy = hier;
        setEntities(ents);
        setPackages(pkgs);
        setHierarchy(hier);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const archs = useMemo(() => entities.filter((entity) => entity.type === 'arch'), [entities]);
  const cpus = useMemo(() => entities.filter((entity) => entity.type === 'cpu'), [entities]);
  const devices = useMemo(() => entities.filter((entity) => entity.type === 'device'), [entities]);
  const categories = useMemo(() => Array.from(new Set(packages.map((pkg) => pkg.category))).sort(), [packages]);

  const renderIosSelector = () => (
    <div className="relative flex bg-[#e3e3e6] dark:bg-zinc-800 p-0.5 rounded-lg w-full mb-4">
      <div 
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] bg-white dark:bg-zinc-700 rounded-md shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          activeTab === 'packages' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        onClick={() => setActiveTab('devices')}
        className={`z-10 flex-1 flex justify-center items-center gap-1 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 ${
          activeTab === 'devices'
            ? 'text-zinc-900 dark:text-white'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        {t('listByDevice')}
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] transition-colors duration-200 ${
          activeTab === 'devices' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' : 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400'
        }`}>
          {devices.length}
        </span>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('packages')}
        className={`z-10 flex-1 flex justify-center items-center gap-1 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 ${
          activeTab === 'packages'
            ? 'text-zinc-900 dark:text-white'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
      >
        {t('listByPackages')}
        <span className={`px-1.5 py-0.2 rounded-full text-[10px] transition-colors duration-200 ${
          activeTab === 'packages' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' : 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400'
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

  const getDescendants = (startNodes: string[]) => {
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
  };

  const filteredDevices = useMemo(() => {
    let validDeviceIds: Set<string> | null = null;

    if (selectedArchs.size > 0 || selectedCpus.size > 0) {
      const archDescendants = selectedArchs.size > 0
        ? getDescendants(Array.from(selectedArchs).map((arch) => `arch:${arch}`))
        : null;
      const cpuDescendants = selectedCpus.size > 0
        ? getDescendants(Array.from(selectedCpus).map((cpu) => `cpu:${cpu}`))
        : null;

      validDeviceIds = new Set(devices.map((device) => `device:${device.id}`));

      if (archDescendants) {
        validDeviceIds = new Set([...validDeviceIds].filter((id) => archDescendants.has(id)));
      }
      if (cpuDescendants) {
        validDeviceIds = new Set([...validDeviceIds].filter((id) => cpuDescendants.has(id)));
      }
    }

    return devices.filter((device) => {
      if (validDeviceIds && !validDeviceIds.has(`device:${device.id}`)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const haystack = [device.display_name, device.id, ...(device.related || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [devices, selectedArchs, selectedCpus, searchQuery, hierarchy]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(pkg.category)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return [pkg.package, pkg.category, pkg.version, pkg.desc || ''].join(' ').toLowerCase().includes(q);
    });
  }, [packages, selectedCategories, searchQuery]);

  const activeFiltersCount = activeTab === 'devices'
    ? selectedArchs.size + selectedCpus.size
    : selectedCategories.size;

  const searchPlaceholder = activeTab === 'devices' ? t('searchPlaceholderDevices') : t('searchPlaceholderPackages');
  const showingCount = activeTab === 'devices' ? filteredDevices.length : filteredPackages.length;
  const listLabel = activeTab === 'devices' ? t('listByDevice') : t('listByPackages');
  const activeDescription = activeTab === 'devices' ? t('deviceListDescription') : t('packageListDescription');

  return (
    <div className="pi-animate-fade-in-up flex h-full flex-col text-[var(--text)]">

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-80 bg-white p-4 shadow-lg pi-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text)]">{t('activeFilters')}</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label={t('clearFilters')} className="text-[var(--subtle)]">✕</button>
            </div>
            <div className="mb-4">
              <label className="relative block">
                <span className="sr-only">{searchPlaceholder}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-[var(--divider)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
            </div>
            {renderIosSelector()}
            {activeTab === 'devices' ? (
              <div className="space-y-6">
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Layers className="h-4 w-4 text-[var(--subtle)]" /> {t('architectures')}
                  </h2>
                  <div className="space-y-2">
                    {archs.map((arch) => (
                      <label key={arch.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input type="checkbox" checked={selectedArchs.has(arch.id)} onChange={() => toggleFilter(selectedArchs, arch.id, setSelectedArchs)} className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                        <span className="truncate" title={arch.display_name}>{arch.display_name}</span>
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
                      <label key={cpu.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input type="checkbox" checked={selectedCpus.has(cpu.id)} onChange={() => toggleFilter(selectedCpus, cpu.id, setSelectedCpus)} className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                        <span className="truncate" title={cpu.display_name}>{cpu.display_name}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-[var(--subtle)]" /> {t('categories')}
                </h2>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                      <input type="checkbox" checked={selectedCategories.has(category)} onChange={() => toggleFilter(selectedCategories, category, setSelectedCategories)} className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]" />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[90rem] flex-1 overflow-hidden px-4 pt-6 pb-5 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 overflow-y-auto pr-6 md:block">
          <div className="pi-surface rounded-[1.5rem] p-4">
            <div className="mb-3">
              <label className="relative block">
                <span className="sr-only">{searchPlaceholder}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--subtle)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-full border border-[var(--divider)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
            </div>

            {renderIosSelector()}

            {activeTab === 'devices' ? (
              <div className="space-y-6">
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Layers className="h-4 w-4 text-[var(--subtle)]" /> {t('architectures')}
                  </h2>
                  <div className="space-y-2">
                    {archs.map((arch) => (
                      <label key={arch.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input
                          type="checkbox"
                          checked={selectedArchs.has(arch.id)}
                          onChange={() => toggleFilter(selectedArchs, arch.id, setSelectedArchs)}
                          className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                        />
                        <span className="truncate" title={arch.display_name}>{arch.display_name}</span>
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
                      <label key={cpu.id} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                        <input
                          type="checkbox"
                          checked={selectedCpus.has(cpu.id)}
                          onChange={() => toggleFilter(selectedCpus, cpu.id, setSelectedCpus)}
                          className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
                        />
                        <span className="truncate" title={cpu.display_name}>{cpu.display_name}</span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-[var(--subtle)]" /> {t('categories')}
                </h2>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--light)] transition hover:text-[var(--ifm-color-primary)]">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category)}
                        onChange={() => toggleFilter(selectedCategories, category, setSelectedCategories)}
                        className="rounded border-[var(--divider)] text-[var(--ifm-color-primary)] focus:ring-[var(--ifm-color-primary)]"
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
          className="flex-1 overflow-y-auto px-4 py-2 md:pl-2 md:pr-4"
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
                  className="w-full rounded-full border border-[var(--divider)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--ifm-color-primary)] focus:ring-2 focus:ring-[var(--ifm-color-primary)]/15"
                />
              </label>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--divider)] bg-white p-2 text-[var(--subtle)] shadow-sm"
                aria-label={t('activeFilters')}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            {renderIosSelector()}
          </div>

          <div className="mb-4 flex items-center justify-between gap-4 text-sm text-[var(--subtle)]">
            <div>
              <span className="font-medium text-[var(--text)]">{listLabel}</span>
              <span className="mx-2">·</span>
              <span>{t('results')}: {showingCount}</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedArchs(new Set());
                  setSelectedCpus(new Set());
                  setSelectedCategories(new Set());
                }}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[var(--subtle)] transition hover:bg-[var(--tintColor)] hover:text-[var(--text)]"
              >
                <X className="h-4 w-4" /> {t('clearFilters')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--subtle)]">{t('loading')}</div>
          ) : activeTab === 'devices' ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredDevices.map((device) => {
                const relatedVariants = (device.related || [])
                  .filter((ref) => ref.startsWith('device-variant:'))
                  .map((ref) => ref.split(':')[1]);

                return (
                  <Link to={`/device/${device.id}`} key={device.id} className="block">
                    <article className="pi-card h-full p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
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

              {filteredDevices.length === 0 && (
                <div className="col-span-full flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white text-center shadow-sm">
                  <Server className="h-10 w-10 text-[var(--home-ruyi-blue)]" />
                  <div className="text-lg font-medium">{t('noDevices')}</div>
                  <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPackages.map((pkg) => (
                <Link to={`/package/${pkg.category}/${pkg.package}/${pkg.version}`} key={`${pkg.category}-${pkg.package}-${pkg.version}`} className="block">
                  <article className="pi-card p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-[var(--ifm-color-primary)]">{pkg.package}</h3>
                          <span className="rounded-md bg-[var(--tintColor)] px-2 py-0.5 text-xs font-mono text-[var(--subtle)]">{pkg.version}</span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--light)]">{pkg.desc || t('noDescription')}</p>
                      </div>
                      <span className="pi-chip px-3 py-1 text-xs font-medium">
                        {pkg.category}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}

              {filteredPackages.length === 0 && (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white text-center shadow-sm">
                  <Package className="h-10 w-10 text-[var(--home-ruyi-blue)]" />
                  <div className="text-lg font-medium">{t('noPackages')}</div>
                  <div className="max-w-md text-sm text-[var(--subtle)]">{t('adjustFilters')}</div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
