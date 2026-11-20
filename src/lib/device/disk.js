export function desktopDisks() {
  const host = globalThis.window?.ruyiImager;
  return host?.version === 1 && host.rawDiskWrite === true ? host : null;
}

export function diskCommand({
  paths,
  targets,
  files,
  host,
  runtime,
  signal,
  log,
  directory,
  pkg,
}) {
  return async (argv) => {
    const slot = Object.keys(targets).find(
      (key) =>
        argv[1] === `if=${paths[key]}` &&
        argv[2] === `of=${targets[key].label}`,
    );
    if (
      argv.length !== 4 ||
      argv[0] !== 'dd' ||
      argv[3] !== 'bs=4096' ||
      slot === undefined
    )
      throw Error('Unreviewed disk write');
    const file = files.get(paths[slot]);
    if (!file?.size) throw Error('Missing disk image');
    signal.throwIfAborted();
    const digest = await runtime.run({ kind: 'hash', file });
    signal.throwIfAborted();
    log(`${file.name} → ${targets[slot].label}`);
    await host.writeAndVerify(targets[slot].id, {
      directory,
      parts: [
        'RuyiImages',
        pkg.package,
        pkg.version,
        'images',
        ...paths[slot].split('/'),
      ],
      size: file.size,
      sha256: digest,
    });
    log(`Read-back SHA-256 ✓ ${file.name}`);
    return { status: 0, output: '' };
  };
}
