const downloadOrigins = new Set([
  'https://mirror.iscas.ac.cn',
  'https://archive.spacemit.com',
  'https://developer.zhcomputing.com',
]);

export function trustedDownload(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      downloadOrigins.has(url.origin) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function segment(value) {
  if (
    !value ||
    value === '.' ||
    value === '..' ||
    /[\\/:\x00-\x1f]/.test(value)
  )
    throw Error(`Invalid image path: ${value}`);
  return value;
}

async function directory(parent, path) {
  for (const part of path)
    parent = await parent.getDirectoryHandle(segment(part), { create: true });
  return parent;
}

async function existing(dir, name) {
  try {
    return await (await dir.getFileHandle(segment(name))).getFile();
  } catch (error) {
    if (error.name !== 'NotFoundError') throw error;
    return null;
  }
}

export async function prepareImages(
  pkg,
  { root, runtime, log, progress, localFile, signal },
) {
  const base = await directory(root, ['RuyiImages', pkg.package, pkg.version]);
  const archives = await directory(base, ['downloads']),
    extracted = await directory(base, ['images']);
  const wanted = [
    ...new Set(Object.values(pkg.data.provisionable.partition_map)),
  ];
  for (const path of wanted) path.split('/').forEach(segment);
  const files = new Map();
  for (const name of pkg.data.blob.distfiles) {
    signal.throwIfAborted();
    const spec = pkg.data.distfiles.find((item) => item.name === name);
    if (!spec?.checksums?.sha256) throw Error(`No SHA-256 for ${name}`);
    const verified = async (file) =>
      file?.size === spec.size &&
      (await runtime.run({ kind: 'hash', file })) === spec.checksums.sha256;
    progress({ name, phase: 'SHA-256', bytes: 0, total: spec.size });
    let file = await existing(archives, name);
    if (!(await verified(file))) {
      file = null;
      const urls = spec.resolved_urls.filter(trustedDownload);
      const save = async (stream) => {
        const writer = await (
          await archives.getFileHandle(segment(name), { create: true })
        ).createWritable();
        let bytes = 0;
        try {
          await stream
            .pipeThrough(
              new TransformStream({
                transform(chunk, controller) {
                  bytes += chunk.byteLength;
                  if (bytes > spec.size)
                    throw Error(`Oversized download: ${name}`);
                  progress({
                    name,
                    phase: 'Download',
                    bytes,
                    total: spec.size,
                  });
                  controller.enqueue(chunk);
                },
              }),
            )
            .pipeTo(writer, { signal });
        } catch (error) {
          await writer.abort().catch(() => {});
          throw error;
        }
        const candidate = await existing(archives, name);
        progress({ name, phase: 'SHA-256', bytes: 0, total: spec.size });
        if (!(await verified(candidate)))
          throw Error(`Size or SHA-256 mismatch: ${name}`);
        return candidate;
      };
      for (const url of urls) {
        try {
          const response = await fetch(url, {
            signal,
            credentials: 'omit',
            redirect: 'error',
          });
          if (!response.ok || !response.body)
            throw Error(`HTTP ${response.status}`);
          file = await save(response.body);
          break;
        } catch (error) {
          signal.throwIfAborted();
          log(`${new URL(url).host}: ${error.message}`);
        }
      }
      if (!file) {
        const local = await localFile(spec);
        if (local.size !== spec.size)
          throw Error(`Incorrect file size for ${name}`);
        file = await save(local.stream());
      }
    }
    log(`SHA-256 ✓ ${name}`);
    progress({ name, phase: 'Extract', bytes: 0, total: file.size });
    const found = await runtime.run({
      kind: 'extract',
      file,
      dir: extracted,
      name,
      wanted,
      strip: spec.strip_components ?? 1,
    });
    for (const path of found) {
      if (files.has(path)) throw Error(`Duplicate package image: ${path}`);
      const parts = path.split('/'),
        filename = parts.pop();
      const image = await existing(await directory(extracted, parts), filename);
      if (!image?.size) throw Error(`Empty or missing image: ${path}`);
      files.set(path, image);
    }
  }
  for (const path of wanted)
    if (!files.has(path)) throw Error(`Package does not contain ${path}`);
  progress(null);
  return files;
}
