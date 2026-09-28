import React, { useEffect, useMemo, useState, useRef } from 'react';
import { getEntities, getPackages, getHierarchy } from '../api';
import { Search, X, Filter } from 'lucide-react';
import { useI18n } from '../i18n';
import {
  Entity,
  PackageItem,
  sortByDisplayName,
  filterDevices,
  filterPackages,
} from './Explorer.filters';
import { FilterSections, DeviceList, PackageList } from './Explorer.tree';

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
  const mainRef = useRef<HTMLDivElement>(null);
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
          setTimeout(() => {
            isRestoring = false;
          }, 50);
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
        const [ents, pkgs, hier] = await Promise.all([
          getEntities(),
          getPackages(),
          getHierarchy(),
        ]);
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

  const archs = useMemo(
    () => sortByDisplayName(entities.filter((entity) => entity.type === 'arch')),
    [entities],
  );
  const cpus = useMemo(
    () => sortByDisplayName(entities.filter((entity) => entity.type === 'cpu')),
    [entities],
  );
  const devices = useMemo(
    () => entities.filter((entity) => entity.type === 'device'),
    [entities],
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(packages.map((pkg) => pkg.category))).sort((left, right) =>
        left.localeCompare(right, undefined, { sensitivity: 'base' }),
      ),
    [packages],
  );
  const variantNames = useMemo(
    () =>
      new Map(
        entities
          .filter((entity) => entity.type === 'device-variant')
          .map((entity) => [entity.id, entity.display_name]),
      ),
    [entities],
  );

  const toggleFilter = (
    set: Set<string>,
    value: string,
    setter: (next: Set<string>) => void,
  ) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filteredDevices = useMemo(
    () => filterDevices(devices, selectedArchs, selectedCpus, searchQuery, hierarchy),
    [devices, selectedArchs, selectedCpus, searchQuery, hierarchy],
  );

  const filteredPackages = useMemo(
    () => filterPackages(packages, selectedCategories, searchQuery),
    [packages, selectedCategories, searchQuery],
  );

  const activeFiltersCount =
    activeTab === 'devices'
      ? selectedArchs.size + selectedCpus.size
      : selectedCategories.size;

  const searchPlaceholder =
    activeTab === 'devices' ? t('searchPlaceholderDevices') : t('searchPlaceholderPackages');
  const showingCount = activeTab === 'devices' ? filteredDevices.length : filteredPackages.length;
  const listLabel = activeTab === 'devices' ? t('listByDevice') : t('listByPackages');

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
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] transition-colors duration-200 ${
            activeTab === 'devices'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              : 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400'
          }`}
        >
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
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] transition-colors duration-200 ${
            activeTab === 'packages'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
              : 'bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400'
          }`}
        >
          {packages.length}
        </span>
      </button>
    </div>
  );

  return (
    <div className="pi-animate-fade-in-up flex h-full flex-col text-[var(--text)]">
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-80 bg-white p-4 shadow-lg pi-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text)]">{t('activeFilters')}</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label={t('clearFilters')}
                className="text-[var(--subtle)]"
              >
                ✕
              </button>
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
            <FilterSections
              activeTab={activeTab}
              archs={archs}
              cpus={cpus}
              categories={categories}
              selectedArchs={selectedArchs}
              selectedCpus={selectedCpus}
              selectedCategories={selectedCategories}
              toggleFilter={toggleFilter}
              setSelectedArchs={setSelectedArchs}
              setSelectedCpus={setSelectedCpus}
              setSelectedCategories={setSelectedCategories}
              t={t}
            />
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

            <FilterSections
              activeTab={activeTab}
              archs={archs}
              cpus={cpus}
              categories={categories}
              selectedArchs={selectedArchs}
              selectedCpus={selectedCpus}
              selectedCategories={selectedCategories}
              toggleFilter={toggleFilter}
              setSelectedArchs={setSelectedArchs}
              setSelectedCpus={setSelectedCpus}
              setSelectedCategories={setSelectedCategories}
              t={t}
            />
          </div>
        </aside>

        <main
          ref={mainRef}
          onScroll={(e) => {
            if (!loading && !isRestoring) {
              lastMainScrollTop = e.currentTarget.scrollTop;
            }
          }}
          className="flex-1 overflow-y-auto p-8"
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
              <span>
                {t('results')}: {showingCount}
              </span>
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
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--subtle)]">
              {t('loading')}
            </div>
          ) : activeTab === 'devices' ? (
            <DeviceList
              devices={filteredDevices}
              variantNames={variantNames}
              t={t}
            />
          ) : (
            <PackageList packages={filteredPackages} t={t} />
          )}
        </main>
      </div>
    </div>
  );
}
