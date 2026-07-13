import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHierarchy, getEntities, getPackageDetail } from '../api';
import { useI18n } from '../i18n';
import { ArrowLeft, Package as PackageIcon, Server, FileBox, Info, Terminal, Copy, ExternalLink } from 'lucide-react';

function formatBytes(size?: number) {
  if (!size || Number.isNaN(size)) return null;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = size;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function getMirrorLabel(url: string, index: number) {
  try {
    return new URL(url).hostname;
  } catch {
    return `Mirror ${index + 1}`;
  }
}

function renderTypeSpecificInfo(category: string, typeData: any, t: any) {
  if (!typeData || Object.keys(typeData).length === 0) return null;
  
  switch(category) {
    case 'toolchain':
      return (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {typeData.target && (
            <div>
              <dt className="text-[var(--subtle)]">{t('target')}</dt>
              <dd className="mt-1 font-mono">{typeData.target}</dd>
            </div>
          )}
          {typeData.components && typeData.components.length > 0 && (
            <div className="col-span-full">
              <dt className="text-[var(--subtle)]">{t('components')}</dt>
              <dd className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {typeData.components.map((c: any, i: number) => (
                  <div key={i} className="pi-card p-3 flex justify-between items-center">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs font-mono text-[var(--subtle)]">{c.version}</span>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </dl>
      );
    case 'binary':
      return (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {typeData.host && (
            <div>
              <dt className="text-[var(--subtle)]">{t('host')}</dt>
              <dd className="mt-1 font-mono">{typeData.host}</dd>
            </div>
          )}
          {typeData.commands && Object.keys(typeData.commands).length > 0 && (
            <div className="col-span-full">
              <dt className="text-[var(--subtle)]">{t('commands')}</dt>
              <dd className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(typeData.commands).map(([cmd, path]: any, i: number) => (
                  <div key={i} className="pi-card p-3 flex flex-col">
                    <span className="font-semibold font-mono text-[var(--ifm-color-primary)]">{cmd}</span>
                    <span className="text-xs font-mono text-[var(--subtle)] break-all mt-1">{path}</span>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </dl>
      );
    case 'emulator':
      return (
        <dl className="space-y-4 text-sm">
          {typeData.programs && typeData.programs.length > 0 && (
            <div>
              <dt className="text-[var(--subtle)] mb-2">{t('programs')}</dt>
              <dd className="space-y-3">
                {typeData.programs.map((p: any, i: number) => (
                  <div key={i} className="pi-card p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><span className="text-[var(--subtle)]">{t('flavor')}:</span> <span className="font-mono">{p.flavor}</span></div>
                      <div><span className="text-[var(--subtle)]">{t('path')}:</span> <span className="font-mono">{p.path}</span></div>
                      {p.binfmt_misc && <div className="col-span-full font-mono text-xs break-all bg-[var(--tintColor)] p-2 rounded"><strong>{t('binfmtMisc')}:</strong> {p.binfmt_misc}</div>}
                      {p.supported_arches && <div className="col-span-full"><span className="text-[var(--subtle)]">{t('supportedArches')}:</span> <div className="flex gap-1 mt-1 flex-wrap">{p.supported_arches.map((a: string) => <span key={a} className="pi-chip px-2 py-0.5 text-xs font-mono">{a}</span>)}</div></div>}
                    </div>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </dl>
      );
    case 'provisionable':
      return (
        <dl className="space-y-4 text-sm">
          {typeData.strategy && (
            <div>
              <dt className="text-[var(--subtle)]">{t('strategy')}</dt>
              <dd className="mt-1 font-mono">{typeData.strategy}</dd>
            </div>
          )}
          {typeData.partition_map && (
            <div>
              <dt className="text-[var(--subtle)] mb-2">{t('partitionMap')}</dt>
              <dd className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(typeData.partition_map).map(([k, v]: any, i: number) => (
                  <div key={i} className="pi-card p-3 flex flex-col">
                    <span className="font-semibold uppercase text-[var(--ifm-color-primary)] text-xs">{k}</span>
                    <span className="text-xs font-mono text-[var(--light)] break-all mt-1">{v}</span>
                  </div>
                ))}
              </dd>
            </div>
          )}
        </dl>
      );
    default:
      return <pre className="font-mono text-xs text-[var(--light)] whitespace-pre-wrap break-all">{JSON.stringify(typeData, null, 2)}</pre>;
  }
}

export default function PackageDetail() {
  const { category, name, version } = useParams<{ category: string; name: string; version: string }>();
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
  const [pkg, setPkg] = useState<any>(null);
  const [hierarchy, setHierarchy] = useState<Record<string, string[]>>({});
  const [allEntities, setAllEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [hier, ents, pkgData] = await Promise.all([
          getHierarchy(),
          getEntities(),
          getPackageDetail(category!, name!, version!)
        ]);
        setHierarchy(hier);
        setAllEntities(ents);
        if (!pkgData.error) {
          setPkg(pkgData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (category && name && version) fetchAll();
  }, [category, name, version]);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">{t('loading')}</div>;
  }

  if (!pkg) {
    return <div className="p-8 text-center text-red-500">{t('notFound')}</div>;
  }

  const pkgRef = `package:${category}/${name}`;
  
  const imageCombos = Object.keys(hierarchy).filter((key) => 
    key.startsWith('image-combo:') && hierarchy[key].includes(pkgRef)
  );

  const variants = new Set<string>();
  const allVariants = Object.keys(hierarchy).filter((key) => key.startsWith('device-variant:'));
  imageCombos.forEach((ic) => {
    allVariants.forEach((v) => {
      if (hierarchy[v].includes(ic)) {
        variants.add(v);
      }
    });
  });

  const supportedDeviceRefs = new Set<string>();
  variants.forEach((v) => {
    hierarchy[v]?.forEach((ref) => {
      if (ref.startsWith('device:')) {
        supportedDeviceRefs.add(ref);
      }
    });
  });

  const supportedDevices = allEntities.filter((e) => 
    e.type === 'device' && supportedDeviceRefs.has(`device:${e.id}`)
  );

  const meta = pkg.data?.metadata || {};
  const distfiles = pkg.data?.distfiles || [];
  const typeData = pkg.data?.[category!] || {}; 

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
                {pkg.package}
              </h1>
            </div>
            <section className="pi-surface rounded-[1.5rem] p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">
                <Info className="h-4 w-4" /> {t('details')}
              </h2>
              <dl className="space-y-4 text-sm break-words">
                <div>
                  <dt className="text-[var(--subtle)]">{t('categoryLabel')}</dt>
                  <dd className="mt-1 font-mono font-medium">
                    <span className="pi-chip px-2 py-1 text-xs font-medium">{pkg.category}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--subtle)]">{t('version')}</dt>
                  <dd className="mt-1 font-mono font-medium">{pkg.version}</dd>
                </div>
                {meta.upstream_version && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('upstreamVersion')}</dt>
                    <dd className="mt-1 font-mono font-medium">{meta.upstream_version}</dd>
                  </div>
                )}
                {meta.slug && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('slug')}</dt>
                    <dd className="mt-1 font-mono">{meta.slug}</dd>
                  </div>
                )}
                {meta.vendor && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('vendor')}</dt>
                    <dd className="mt-1 font-medium">{meta.vendor.name}</dd>
                    {meta.vendor.eula && (
                      <dd className="mt-1 text-xs text-[var(--subtle)]">EULA: {meta.vendor.eula}</dd>
                    )}
                  </div>
                )}
                {meta.service_level && (
                  <div>
                    <dt className="text-[var(--subtle)]">{t('serviceLevel')}</dt>
                    <dd className="mt-1 font-mono font-medium">{meta.service_level.level}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[var(--subtle)]">{t('descriptionLabel')}</dt>
                  <dd className="mt-1 leading-relaxed text-[var(--light)]">
                    {meta.desc || t('noDescription')}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            {Object.keys(typeData).length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold capitalize">
                  <Terminal className="h-5 w-5 text-[var(--subtle)]" />
                  {t(category!) || category}
                </h2>
                <div className="pi-surface rounded-[1.5rem] p-6">
                  {renderTypeSpecificInfo(category!, typeData, t)}
                </div>
              </section>
            )}

            {distfiles.length > 0 && (
              <section>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                      <FileBox className="h-5 w-5 text-[var(--subtle)]" />
                      {t('distfiles')}
                      <span className="rounded-full bg-[var(--tintColor)] px-2 py-0.5 text-xs text-[var(--subtle)]">
                        {distfiles.length}
                      </span>
                    </h2>
                    <p className="mt-1 text-sm text-[var(--subtle)]">
                      {t('downloadHint', { count: distfiles.length })}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {distfiles.map((file: any, idx: number) => {
                    const downloadUrls = file.resolved_urls?.length ? file.resolved_urls : (file.urls || []);

                    return (
                      <article key={idx} className="pi-surface overflow-hidden rounded-[1.5rem] border border-[var(--divider)]">
                        <div className="border-b border-[var(--divider)] bg-[var(--tintColor)]/40 px-5 py-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate font-mono text-sm font-semibold text-[var(--text)]">{file.name}</h3>
                                <span className="pi-chip px-2 py-0.5 text-[10px] font-medium">{idx + 1}</span>
                              </div>
                              <p className="mt-1 text-xs text-[var(--subtle)]">
                                {formatBytes(file.size) ? `${t('size')}: ${formatBytes(file.size)}` : ' '}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {downloadUrls?.[0] && (
                                <a
                                  href={downloadUrls[0]}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="pi-button-secondary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  {t('openLink')}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                          <div className="space-y-4">
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--subtle)]">{t('downloadMirrors')}</div>
                              <div className="space-y-2">
                                {downloadUrls.map((url: string, uidx: number) => {
                                  const isPrimary = uidx === 0;
                                  const mirrorLabel = getMirrorLabel(url, uidx);
                                  return (
                                    <div key={`${url}-${uidx}`} className={`rounded-xl border px-3 py-3 ${isPrimary ? 'border-[var(--ifm-color-primary)] bg-[var(--ifm-color-primary)]/5' : 'border-[var(--divider)] bg-white'}`}>
                                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-medium text-[var(--text)]">{mirrorLabel}</span>
                                            {isPrimary && <span className="pi-chip px-2 py-0.5 text-[10px] font-medium">{t('primaryMirror')}</span>}
                                          </div>
                                          <a href={url} target="_blank" rel="noreferrer" className="mt-1 block break-all font-mono text-xs text-[var(--ifm-color-primary)] hover:underline">
                                            {url}
                                          </a>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => navigator.clipboard?.writeText(url)}
                                          className="inline-flex items-center justify-center self-start rounded-full border border-[var(--divider)] p-2 text-xs text-[var(--subtle)] transition hover:border-[var(--ifm-color-primary)] hover:text-[var(--text)]"
                                          title={t('copyLink')}
                                          aria-label={t('copyLink')}
                                        >
                                          <Copy className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 rounded-2xl bg-[var(--tintColor)]/40 p-4">
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--subtle)]">{t('checksums')}</div>
                              <div className="space-y-2 text-xs font-mono break-all text-[var(--light)]">
                                {file.checksums?.sha256 && <div className="rounded-lg bg-white px-3 py-2"><span className="mr-2 font-semibold text-[var(--text)]">SHA256</span>{file.checksums.sha256}</div>}
                                {file.checksums?.sha512 && <div className="rounded-lg bg-white px-3 py-2"><span className="mr-2 font-semibold text-[var(--text)]">SHA512</span>{file.checksums.sha512}</div>}
                                {!file.checksums?.sha256 && !file.checksums?.sha512 && <div className="text-[var(--subtle)]">{t('noChecksum')}</div>}
                              </div>
                            </div>

                            {file.fetch_restriction && (
                              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                                <div className="font-semibold">{t('fetchRestriction')}</div>
                                <div className="mt-1 font-mono">{file.fetch_restriction.msgid}</div>
                                {file.fetch_restriction.params && (
                                  <pre className="mt-2 overflow-auto rounded-lg bg-white/70 p-2 text-[10px]">{JSON.stringify(file.fetch_restriction.params, null, 2)}</pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Server className="h-5 w-5 text-[var(--subtle)]" />
                {t('supportedDevices')}
                <span className="rounded-full bg-[var(--tintColor)] px-2 py-0.5 text-xs text-[var(--subtle)]">
                  {supportedDevices.length}
                </span>
              </h2>
              
              {supportedDevices.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {supportedDevices.map(device => (
                    <Link to={`/device/${device.id}`} key={device.id} className="block">
                      <article className="pi-card h-full p-4">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-[var(--ifm-color-primary)]">{device.display_name}</h3>
                            <p className="mt-1 text-[10px] font-mono text-[var(--subtle)]">{device.id}</p>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[var(--divider)] bg-white p-8 text-center text-sm text-[var(--subtle)] shadow-sm">
                  {t('noDevices')}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
