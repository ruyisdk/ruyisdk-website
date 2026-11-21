function isDownloadURL(value) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
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

async function mirrorSource(url, signal) {
  signal.throwIfAborted();
  const host = globalThis.window?.ruyiImager;
  if (!host) return url;

  const cancelled = Promise.withResolvers();
  const onAbort = () => cancelled.reject(signal.reason);
  signal.addEventListener('abort', onAbort, { once: true });
  try {
    const ticket = await Promise.race([
      cancelled.promise,
      host.getMirrorDownloadURL(url),
    ]);
    if (
      typeof ticket !== 'string' ||
      !ticket.startsWith('ruyi-image://download/')
    )
      throw Error('Invalid desktop download URL');
    return ticket;
  } finally {
    signal.removeEventListener('abort', onAbort);
  }
}

async function saveDownload(stream, archives, spec, signal, progress) {
  const { name, size } = spec;
  const reader = stream.getReader();
  const stopReading = () => {
    void reader.cancel().catch(() => {});
  };
  signal.addEventListener('abort', stopReading, { once: true });
  let writer;
  let bytes = 0;
  try {
    signal.throwIfAborted();
    const handle = await archives.getFileHandle(segment(name), {
      create: true,
    });
    writer = await handle.createWritable();
    for (;;) {
      signal.throwIfAborted();
      let chunk;
      try {
        chunk = await reader.read();
      } catch {
        signal.throwIfAborted();
        return `Transfer interrupted after ${bytes} of ${size} bytes`;
      }
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > size) break;
      await writer.write(chunk.value);
      progress({ name, phase: 'Download', bytes, total: size });
    }
    signal.throwIfAborted();
    if (bytes !== size)
      return `Size mismatch: expected ${size} bytes, received ${bytes}`;
    await writer.close();
    writer = null;
  } catch (error) {
    signal.throwIfAborted();
    throw Error(`Cannot save ${name}: ${error.message || error}`);
  } finally {
    signal.removeEventListener('abort', stopReading);
    await writer?.abort().catch(() => {});
    await reader.cancel().catch(() => {});
    reader.releaseLock();
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
    const verified = async (file) => {
      if (file?.size !== spec.size) return false;
      progress({ name, phase: 'SHA-256', bytes: 0, total: spec.size });
      try {
        return (
          (await runtime.run({ kind: 'hash', file })) === spec.checksums.sha256
        );
      } catch (error) {
        signal.throwIfAborted();
        throw Error(
          `Cannot verify SHA-256 for ${name}: ${error.message || error}`,
        );
      }
    };
    let file = await existing(archives, name);
    if (await verified(file)) {
      log(`Using cached file: ${name}`);
    } else {
      if (file) log(`Cached file failed size or SHA-256 check: ${name}`);
      file = null;
      const urls = spec.resolved_urls.filter(isDownloadURL);
      for (const url of urls) {
        let response;
        const sourceLabel = `${new URL(url).host} · ${name}`;
        try {
          progress({ name, phase: 'Download', bytes: 0, total: spec.size });
          const source = await mirrorSource(url, signal);
          response = await fetch(source, {
            signal,
            credentials: 'omit',
          });
        } catch {
          signal.throwIfAborted();
          log(`${sourceLabel}: Download request failed`);
          continue;
        }
        if (!response.ok || !response.body) {
          log(`${sourceLabel}: HTTP ${response.status}`);
          await response.body?.cancel();
          continue;
        }
        const failure = await saveDownload(
          response.body,
          archives,
          spec,
          signal,
          progress,
        );
        if (failure) {
          log(`${sourceLabel}: ${failure}`);
          continue;
        }
        let candidate;
        try {
          candidate = await (await archives.getFileHandle(name)).getFile();
        } catch (error) {
          signal.throwIfAborted();
          throw Error(
            `Cannot read saved file ${name}: ${error.message || error}`,
          );
        }
        if (!(await verified(candidate))) {
          log(`${sourceLabel}: SHA-256 or size mismatch in saved file`);
          continue;
        }
        file = candidate;
        break;
      }
      if (!file) {
        progress(null);
        const local = await localFile(spec, urls);
        if (local.size !== spec.size)
          throw Error(`Incorrect file size for ${name}`);
        if (!(await verified(local))) throw Error(`SHA-256 mismatch: ${name}`);
        signal.throwIfAborted();
        try {
          const handle = await archives.getFileHandle(name, { create: true });
          await local
            .stream()
            .pipeTo(await handle.createWritable(), { signal });
        } catch (error) {
          signal.throwIfAborted();
          throw Error(`Cannot save ${name}: ${error.message || error}`);
        }
        file = local;
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
