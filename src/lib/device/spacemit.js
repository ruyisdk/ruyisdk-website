export async function packageFastboot(usb, runtime, strategy, paths, files) {
  if (!/^spacemit-k[13]-v[12]$/.test(strategy) || !files.has(paths.gpt))
    return (argv) => usb.execute(argv, files);

  const table = JSON.parse(await files.get(paths.gpt).text());
  const partitions = new Map();
  if (table.format === 'gpt') {
    for (const part of table.partitions) {
      const level = /^gzip-([1-9])$/.exec(part.compress);
      if (level && files.has(part.image))
        partitions.set(part.name, {
          path: part.image,
          level: Number(level[1]),
        });
    }
  }
  let gptActive = false;
  return async (argv) => {
    const [, action, partition, path] = argv;
    const entry = gptActive && action === 'flash' && partitions.get(partition);
    if (entry && entry.path === path)
      usb.trace?.(`GPT ${partition}: ${path}, gzip-${entry.level}`);
    const compress =
      entry && entry.path === path
        ? (file) => runtime.run({ kind: 'gzip', file, level: entry.level })
        : undefined;
    const result = await usb.execute(argv, files, compress);
    if (action === 'flash' && (partition === 'gpt' || partition === 'mtd'))
      gptActive =
        result.status === 0 && partition === 'gpt' && path === paths.gpt;
    if (action === 'reboot' || action === 'continue') gptActive = false;
    return result;
  };
}

export async function* gzipPayloads(file, limit, compress) {
  const alignment = 4096;
  const capacity =
    Math.floor(Math.min(limit, 16 * 1024 * 1024) / alignment) * alignment;
  for (let offset = 0; offset < file.size; ) {
    let length = Math.min(capacity, file.size - offset);
    for (;;) {
      if (!length) throw Error('Fastboot download limit is too small for gzip');
      const bytes = await compress(file.slice(offset, offset + length));
      if (bytes.byteLength <= limit) {
        yield new Blob([bytes]);
        offset += length;
        break;
      }
      length = Math.floor(length / 2 / alignment) * alignment;
    }
  }
}
