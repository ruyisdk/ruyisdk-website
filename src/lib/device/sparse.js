const MAGIC = 0xed26ff3a;
const RAW = 0xcac1,
  FILL = 0xcac2,
  SKIP = 0xcac3,
  CRC = 0xcac4;

async function view(file, offset, length) {
  if (offset + length > file.size)
    throw Error('Truncated Android sparse image');
  return new DataView(await file.slice(offset, offset + length).arrayBuffer());
}

function header(blockSize, blocks, count) {
  const buffer = new ArrayBuffer(28),
    data = new DataView(buffer);
  data.setUint32(0, MAGIC, true);
  data.setUint16(4, 1, true);
  data.setUint16(8, 28, true);
  data.setUint16(10, 12, true);
  data.setUint32(12, blockSize, true);
  data.setUint32(16, blocks, true);
  data.setUint32(20, count, true);
  return buffer;
}

function chunk(kind, blocks, length = 0) {
  const buffer = new ArrayBuffer(12),
    data = new DataView(buffer);
  data.setUint16(0, kind, true);
  data.setUint32(4, blocks, true);
  data.setUint32(8, 12 + length, true);
  return buffer;
}

async function imageLayout(file) {
  const first = await view(file, 0, 4);
  if (first.getUint32(0, true) !== MAGIC) {
    const blockSize = 4096,
      blocks = Math.ceil(file.size / blockSize);
    return {
      blockSize,
      blocks,
      extents: [{ kind: RAW, start: 0, blocks, offset: 0 }],
    };
  }
  const info = await view(file, 0, 28);
  const blockSize = info.getUint32(12, true),
    blocks = info.getUint32(16, true),
    count = info.getUint32(20, true);
  const chunkSize = info.getUint16(10, true);
  let offset = info.getUint16(8, true),
    start = 0;
  if (
    info.getUint16(4, true) !== 1 ||
    offset < 28 ||
    chunkSize < 12 ||
    !blockSize ||
    blockSize % 4 ||
    count > file.size / chunkSize
  )
    throw Error('Invalid Android sparse header');
  const extents = [];
  for (let index = 0; index < count; index++) {
    const entry = await view(file, offset, chunkSize),
      kind = entry.getUint16(0, true),
      length = entry.getUint32(4, true),
      size = entry.getUint32(8, true);
    const payload =
      kind === RAW
        ? length * blockSize
        : kind === FILL || kind === CRC
          ? 4
          : kind === SKIP
            ? 0
            : -1;
    if (
      payload < 0 ||
      size !== chunkSize + payload ||
      offset + size > file.size ||
      (kind === CRC && length !== 0)
    )
      throw Error('Invalid Android sparse chunk');
    if (kind === RAW || kind === FILL)
      extents.push({ kind, start, blocks: length, offset: offset + chunkSize });
    offset += size;
    start += length;
  }
  if (offset !== file.size || start !== blocks)
    throw Error('Sparse image length mismatch');
  return { blockSize, blocks, extents };
}

export async function* flashPayloads(file, limit) {
  if (file.size <= limit) {
    yield file;
    return;
  }
  const { blockSize, blocks, extents } = await imageLayout(file);
  if (limit < 64 + blockSize || blocks > 0xffffffff || !extents.length)
    throw Error('Cannot split image within device download limit');
  let parts = [],
    size = 28,
    count = 0,
    end = 0;
  function payload() {
    if (end < blocks) {
      parts.push(chunk(SKIP, blocks - end));
      count++;
    }
    const result = new Blob([header(blockSize, blocks, count), ...parts]);
    parts = [];
    size = 28;
    count = 0;
    end = 0;
    return result;
  }
  for (const extent of extents) {
    for (let consumed = 0; consumed < extent.blocks; ) {
      const start = extent.start + consumed,
        gap = start - end;
      const available = limit - size - 24 - (gap ? 12 : 0);
      if (available < (extent.kind === FILL ? 4 : blockSize)) {
        yield payload();
        continue;
      }
      const length =
        extent.kind === FILL
          ? extent.blocks
          : Math.min(
              extent.blocks - consumed,
              Math.floor(available / blockSize),
            );
      const dataSize = extent.kind === FILL ? 4 : length * blockSize;
      const offset =
        extent.offset + (extent.kind === RAW ? consumed * blockSize : 0);
      const bytes = file.slice(offset, offset + dataSize);
      if (gap) {
        parts.push(chunk(SKIP, gap));
        size += 12;
        count++;
      }
      parts.push(chunk(extent.kind, length, dataSize), bytes);
      if (bytes.size < dataSize)
        parts.push(new Uint8Array(dataSize - bytes.size));
      consumed += length;
      end = start + length;
      size += 12 + dataSize;
      count++;
    }
  }
  if (count) yield payload();
}
