import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEntityDetail, getHierarchy, getPackages } from '../api';
import { useI18n } from '../i18n';
import { ArrowLeft, Server, Package as PackageIcon, Cpu, Layers } from 'lucide-react';

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const handleBack = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate('/');
    } catch (e) {
      navigate('/');
    }
  };

  const [device, setDevice] = useState<any>(null);
  const [hierarchy, setHierarchy] = useState<Record<string, string[]>>({});
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [deviceData, hier, pkgs] = await Promise.all([
          getEntityDetail('device', id!),
          getHierarchy(),
          getPackages()
        ]);
        setDevice(deviceData);
        setHierarchy(hier);
        setAllPackages(pkgs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAll();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">{t('loading')}</div>;
  }

  if (!device || device.error) {
    return <div className="p-8 text-center text-red-500">{t('notFound')}</div>;
  }

  const deviceId = `device:${id}`;
  
  // Find variants for this device
  const variants = Object.keys(hierarchy).filter((key) => 
    key.startsWith('device-variant:') && hierarchy[key].includes(deviceId)
  );

  // Find CPUs for those variants
  const cpus = Object.keys(hierarchy).filter((key) => 
    key.startsWith('cpu:') && variants.some(v => hierarchy[key].includes(v))
  );

  // Find uarches for those CPUs
  const uarches = Object.keys(hierarchy).filter((key) => 
    key.startsWith('uarch:') && cpus.some(c => hierarchy[key].includes(c))
  );

  // Find arches for those uarches
  const arches = Object.keys(hierarchy).filter((key) => 
    key.startsWith('arch:') && uarches.some(u => hierarchy[key].includes(u))
  );

  // Find image combos for variants
  const imageCombos = new Set<string>();
  variants.forEach((variant) => {
    hierarchy[variant]?.forEach((ref) => {
      if (ref.startsWith('image-combo:')) {
        imageCombos.add(ref);
      }
    });
  });

  // Find packages for those image combos
  const supportedPackageRefs = new Set<string>();
  imageCombos.forEach((ic) => {
    hierarchy[ic]?.forEach((ref) => {
      if (ref.startsWith('package:')) {
        supportedPackageRefs.add(ref);
      }
    });
  });

  const supportedPackages = allPackages.filter((pkg) => 
    supportedPackageRefs.has(`package:${pkg.category}/${pkg.package}`)
  );

  const displayName = device.data?.device?.display_name || id;

  return (
    <div className="pi-animate-fade-in-up flex min-h-screen flex-col text-[var(--text)]">
      <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <button type="button" onClick={handleBack} className="pi-button-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5" aria-label={t('back')}>
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t('back')}</span>
              </button>
              <h1 className="text-xl font-bold text-[var(--ifm-color-primary)] m-0 leading-tight">
                {displayName}
              </h1>
            </div>
            <section className="pi-surface rounded-[1.5rem] p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">{t('details')}</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[var(--subtle)]">{t('id')}</dt>
                  <dd className="mt-1 font-mono font-medium">{id}</dd>
                </div>
                {device.data?.device?.manufacturer && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('manufacturer')}</dt>
                    <dd className="mt-1 font-medium">{device.data.device.manufacturer}</dd>
                  </div>
                )}
                {arches.length > 0 && (
                  <div>
                    <dt className="text-[var(--subtle)] flex items-center gap-1"><Layers className="h-3 w-3" /> {t('architectures')}</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {arches.map(a => (
                        <span key={a} className="rounded-md bg-[var(--tintColor)] px-2 py-1 text-xs font-mono text-[var(--subtle)]">
                          {a.replace('arch:', '')}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {uarches.length > 0 && (
                  <div>
                    <dt className="text-[var(--subtle)] flex items-center gap-1"><Cpu className="h-3 w-3" /> UArchs</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {uarches.map(a => (
                        <span key={a} className="rounded-md bg-[var(--tintColor)] px-2 py-1 text-xs font-mono text-[var(--subtle)]">
                          {a.replace('uarch:', '')}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {cpus.length > 0 && (
                  <div>
                    <dt className="text-[var(--subtle)] flex items-center gap-1"><Cpu className="h-3 w-3" /> {t('cpus')}</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {cpus.map(c => (
                        <span key={c} className="rounded-md bg-[var(--tintColor)] px-2 py-1 text-xs font-mono text-[var(--subtle)]">
                          {c.replace('cpu:', '')}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {variants.length > 0 && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('variants')} ({variants.length})</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {variants.map(v => (
                        <span key={v} className="rounded-md bg-[var(--tintColor)] px-2 py-1 text-xs font-mono text-[var(--subtle)]">
                          {v.replace('device-variant:', '')}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <PackageIcon className="h-5 w-5 text-[var(--subtle)]" />
                {t('supportedPackages')}
                <span className="rounded-full bg-[var(--tintColor)] px-2 py-0.5 text-xs text-[var(--subtle)]">
                  {supportedPackages.length}
                </span>
              </h2>
              
              {supportedPackages.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {supportedPackages.map(pkg => (
                    <Link to={`/package/${pkg.category}/${pkg.package}/${pkg.version}`} key={`${pkg.category}-${pkg.package}-${pkg.version}`} className="block">
                      <article className="pi-card h-full p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[var(--ifm-color-primary)]">{pkg.package}</h3>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--light)]">
                          {pkg.desc || t('noDescription')}
                        </p>
                        <div className="mt-3">
                          <span className="pi-chip px-2 py-0.5 text-[10px] font-medium">
                            {pkg.category}
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white p-8 text-center text-sm text-[var(--subtle)] shadow-sm">
                  {t('noPackages')}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
