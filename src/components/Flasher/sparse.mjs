import { FlasherError } from "./errors.mjs";

/** Parses the sparse format without loading payloads or treating malformed headers as raw images. */
export async function inspectImage(file) {
  if (!file.size) throw new FlasherError("error.emptyImage", "Empty image", {});
  const bytes = await file.slice(0, 28).arrayBuffer();
  const header = new DataView(bytes);
  if (bytes.byteLength < 4 || header.getUint32(0, true) !== 0xed26ff3a)
    return { sparse: false, size: file.size };
  if (
    bytes.byteLength < 28 ||
    header.getUint16(4, true) !== 1 ||
    header.getUint16(8, true) !== 28 ||
    header.getUint16(10, true) !== 12
  )
    throw new FlasherError(
      "error.sparseHeader",
      "Unsupported sparse image header",
      {},
    );
  const blockSize = header.getUint32(12, true);
  const blocks = header.getUint32(16, true);
  const count = header.getUint32(20, true);
  if (!blockSize || blockSize % 4 || !blocks || !count || count > 1000000)
    throw new FlasherError(
      "error.sparseDimensions",
      "Invalid sparse image dimensions",
      {},
    );
  const chunks = [];
  let offset = 28;
  let totalBlocks = 0;
  for (let index = 0; index < count; index++) {
    const buffer = await file.slice(offset, offset + 12).arrayBuffer();
    if (buffer.byteLength !== 12)
      throw new FlasherError(
        "error.sparseChunkHeader",
        "Truncated sparse chunk header",
        {},
      );
    const view = new DataView(buffer);
    const type = view.getUint16(0, true);
    const chunkBlocks = view.getUint32(4, true);
    const size = view.getUint32(8, true) - 12;
    const expected =
      type === 0xcac1
        ? chunkBlocks * blockSize
        : type === 0xcac2 || type === 0xcac4
          ? 4
          : type === 0xcac3
            ? 0
            : -1;
    if (
      size < 0 ||
      size !== expected ||
      offset + 12 + size > file.size ||
      (type === 0xcac4 && chunkBlocks !== 0)
    )
      throw new FlasherError("error.sparseChunk", "Invalid sparse chunk", {});
    chunks.push({ type, blocks: chunkBlocks, offset: offset + 12, size });
    totalBlocks += chunkBlocks;
    offset += 12 + size;
  }
  if (
    offset !== file.size ||
    totalBlocks !== blocks ||
    !Number.isSafeInteger(blocks * blockSize)
  )
    throw new FlasherError(
      "error.sparseLength",
      "Sparse image length mismatch",
      {},
    );
  return { sparse: true, blockSize, blocks, chunks, size: blocks * blockSize };
}

/** Encodes a sparse chunk header. */
function chunkHeader(type, blocks, bytes) {
  const result = new Uint8Array(12);
  const view = new DataView(result.buffer);
  view.setUint16(0, type, true);
  view.setUint32(4, blocks, true);
  view.setUint32(8, 12 + bytes, true);
  return result;
}

/** Builds a sparse fragment with leading/trailing skip chunks to preserve its partition offset. */
function fragment(blockSize, totalBlocks, start, blocks, type, data) {
  const header = new Uint8Array(28);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0xed26ff3a, true);
  view.setUint16(4, 1, true);
  view.setUint16(8, 28, true);
  view.setUint16(10, 12, true);
  view.setUint32(12, blockSize, true);
  view.setUint32(16, totalBlocks, true);
  view.setUint32(20, 3, true);
  return new Blob([
    header,
    chunkHeader(0xcac3, start, 0),
    chunkHeader(type, blocks, data.size),
    data,
    chunkHeader(0xcac3, totalBlocks - start - blocks, 0),
  ]);
}

/** Yields bounded raw or sparse downloads; split images require sparse support in the bootloader. */
export async function* imagePayloads(file, limit, info) {
  info ||= await inspectImage(file);
  if (file.size <= limit) {
    yield { blob: file, completed: info.size, total: info.size };
    return;
  }
  const blockSize = info.sparse ? info.blockSize : 4096;
  const totalBlocks = info.sparse
    ? info.blocks
    : Math.ceil(file.size / blockSize);
  if (totalBlocks > 0xffffffff)
    throw new FlasherError(
      "error.sparseBlockLimit",
      "Image exceeds sparse block count limit",
      {},
    );
  const capacity = Math.floor((limit - 64) / blockSize);
  if (capacity < 1)
    throw new FlasherError(
      "error.sparseDownloadLimit",
      "Device download limit is too small for sparse images",
      {},
    );
  const sourceChunks = info.sparse
    ? info.chunks
    : [{ type: 0xcac1, blocks: totalBlocks, offset: 0, size: file.size }];
  let position = 0;
  for (const chunk of sourceChunks) {
    if (chunk.type === 0xcac4) continue;
    if (chunk.type === 0xcac3) {
      position += chunk.blocks;
      continue;
    }
    if (chunk.type === 0xcac2) {
      yield {
        blob: fragment(
          blockSize,
          totalBlocks,
          position,
          chunk.blocks,
          chunk.type,
          file.slice(chunk.offset, chunk.offset + 4),
        ),
        completed: Math.min(info.size, (position + chunk.blocks) * blockSize),
        total: info.size,
      };
      position += chunk.blocks;
      continue;
    }
    let consumed = 0;
    while (consumed < chunk.blocks) {
      const blocks = Math.min(capacity, chunk.blocks - consumed);
      const start = chunk.offset + consumed * blockSize;
      const data = file.slice(
        start,
        Math.min(chunk.offset + chunk.size, start + blocks * blockSize),
      );
      const padding = blocks * blockSize - data.size;
      const payload = padding
        ? new Blob([data, new Uint8Array(padding)])
        : data;
      yield {
        blob: fragment(
          blockSize,
          totalBlocks,
          position,
          blocks,
          0xcac1,
          payload,
        ),
        completed: Math.min(info.size, (position + blocks) * blockSize),
        total: info.size,
      };
      position += blocks;
      consumed += blocks;
    }
  }
}
