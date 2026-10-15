import { FlasherError } from "./errors.mjs";
import { normalizePath } from "./plan.mjs";

/** Reads a stream sequentially without retaining whole image payloads. */
class StreamReader {
  /** Takes ownership of the supplied stream reader. */
  constructor(stream) {
    this.reader = stream.getReader();
    this.chunk = new Uint8Array();
    this.offset = 0;
  }

  /** Consumes exactly size bytes, passing bounded views to consume. */
  async take(size, consume = () => {}) {
    while (size > 0) {
      if (this.offset === this.chunk.length) {
        const result = await this.reader.read();
        if (result.done)
          throw new FlasherError(
            "error.truncatedArchive",
            "Truncated archive",
            {},
          );
        this.chunk = result.value;
        this.offset = 0;
      }
      const count = Math.min(size, this.chunk.length - this.offset);
      await consume(this.chunk.subarray(this.offset, this.offset + count));
      this.offset += count;
      size -= count;
    }
  }

  /** Returns an exact-size copy, intended only for small headers. */
  async bytes(size) {
    const result = new Uint8Array(size);
    let offset = 0;
    await this.take(size, (chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });
    return result;
  }
}

/** Decodes a NUL-terminated tar header field. */
function text(bytes) {
  return new TextDecoder().decode(bytes).split("\0")[0];
}

/** Reads an unsigned octal or GNU base-256 tar size. */
function number(bytes) {
  let result;
  if (bytes[0] & 0x80) {
    if (bytes[0] & 0x40)
      throw new FlasherError("error.negativeTarSize", "Negative tar size", {});
    result = bytes[0] & 0x7f;
    for (const byte of bytes.subarray(1)) result = result * 256 + byte;
  } else {
    const value = text(bytes).trim();
    if (!/^[0-7]*$/.test(value))
      throw new FlasherError("error.tarNumber", "Invalid tar number", {});
    result = value ? parseInt(value, 8) : 0;
  }
  if (!Number.isSafeInteger(result))
    throw new FlasherError("error.tarEntrySize", "Tar entry is too large", {});
  return result;
}

/** Parses length-prefixed POSIX extended headers. */
function parsePax(bytes) {
  const values = {};
  let offset = 0;
  while (offset < bytes.length) {
    const space = bytes.indexOf(32, offset);
    if (space < 0)
      throw new FlasherError("error.paxHeader", "Invalid PAX header", {});
    const lengthText = text(bytes.subarray(offset, space));
    const length = Number(lengthText);
    if (
      !/^\d+$/.test(lengthText) ||
      length <= space - offset + 1 ||
      offset + length > bytes.length ||
      bytes[offset + length - 1] !== 10
    )
      throw new FlasherError("error.paxRecord", "Invalid PAX record", {});
    const record = text(bytes.subarray(space + 1, offset + length - 1));
    const equals = record.indexOf("=");
    if (equals < 1)
      throw new FlasherError("error.paxField", "Invalid PAX field", {});
    values[record.slice(0, equals)] = record.slice(equals + 1);
    offset += length;
  }
  if (
    Object.keys(values).some(
      (key) =>
        key.startsWith("GNU.sparse") || key.startsWith("SCHILY.realsize"),
    )
  )
    throw new FlasherError(
      "error.sparseTar",
      "Sparse tar archives must be extracted before use",
      {},
    );
  return values;
}

/** Extracts regular tar entries; open returns a write/close sink or null to skip an entry. */
export async function extractTar(stream, open) {
  const source = new StreamReader(stream);
  let local = {};
  let global = {};
  let longName;
  try {
    while (true) {
      const header = await source.bytes(512);
      if (header.every((byte) => byte === 0)) {
        const second = await source.bytes(512);
        if (second.some((byte) => byte !== 0))
          throw new FlasherError("error.tarEnd", "Invalid tar end marker", {});
        // Drain the decompressor so trailer checksums and truncation errors are observed.
        if (source.chunk.subarray(source.offset).some((byte) => byte !== 0))
          throw new FlasherError(
            "error.tarTrailingData",
            "Unexpected data after tar end marker",
            {},
          );
        while (true) {
          const { value, done } = await source.reader.read();
          if (done) return;
          if (value.some((byte) => byte !== 0))
            throw new FlasherError(
              "error.tarTrailingData",
              "Unexpected data after tar end marker",
              {},
            );
        }
      }
      const checksum = header.reduce(
        (sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte),
        0,
      );
      if (checksum !== number(header.subarray(148, 156)))
        throw new FlasherError(
          "error.tarChecksum",
          "Invalid tar header checksum",
          {},
        );
      let size = number(header.subarray(124, 136));
      const type = String.fromCharCode(header[156]);
      if (["x", "g", "L", "K"].includes(type)) {
        if (size > 1024 * 1024)
          throw new FlasherError(
            "error.tarMetadataSize",
            "Tar metadata is too large",
            {},
          );
        const metadata = await source.bytes(size);
        if (type === "x") local = parsePax(metadata);
        if (type === "g") global = { ...global, ...parsePax(metadata) };
        if (type === "L") longName = text(metadata);
        await source.take((512 - (size % 512)) % 512);
        continue;
      }
      const pax = { ...global, ...local };
      if (pax.size !== undefined) {
        if (!/^\d+$/.test(pax.size) || !Number.isSafeInteger(Number(pax.size)))
          throw new FlasherError("error.paxSize", "Invalid PAX size", {});
        size = Number(pax.size);
      }
      const prefix = text(header.subarray(345, 500));
      const name =
        pax.path ||
        longName ||
        (prefix && text(header.subarray(257, 263)) === "ustar"
          ? prefix + "/"
          : "") + text(header.subarray(0, 100));
      local = {};
      longName = undefined;
      if (type === "S")
        throw new FlasherError(
          "error.sparseTar",
          "Sparse tar archives must be extracted before use",
          {},
        );
      let sink;
      if (type === "0" || type === "\0")
        sink = await open(normalizePath(name), size);
      try {
        await source.take(size, (chunk) => sink?.write(chunk));
      } finally {
        await sink?.close();
      }
      await source.take((512 - (size % 512)) % 512);
    }
  } finally {
    await source.reader.cancel().catch(() => {});
    source.reader.releaseLock();
  }
}
