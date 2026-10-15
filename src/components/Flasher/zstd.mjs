import { FlasherError } from "./errors.mjs";

/** Validates complete Zstandard frames independently of the codec's permissive end() API. */
export class ZstdFrames {
  /** Starts at a frame boundary with no buffered payload. */
  constructor() {
    this.buffer = new Uint8Array();
    this.skip = 0;
    this.state = "magic";
    this.frames = 0;
    this.checksum = false;
  }

  /** Consumes framing bytes while skipping compressed payloads without buffering them. */
  push(input) {
    let offset = 0;
    while (offset < input.length || this.buffer.length) {
      if (this.skip) {
        const count = Math.min(this.skip, input.length - offset);
        this.skip -= count;
        offset += count;
        if (this.skip) return;
      }
      const need =
        this.state === "magic" || this.state === "skipSize"
          ? 4
          : this.state === "descriptor"
            ? 1
            : this.state === "header"
              ? this.headerSize
              : 3;
      if (this.buffer.length < need) {
        const count = Math.min(
          need - this.buffer.length,
          input.length - offset,
        );
        const next = new Uint8Array(this.buffer.length + count);
        next.set(this.buffer);
        next.set(input.subarray(offset, offset + count), this.buffer.length);
        this.buffer = next;
        offset += count;
        if (this.buffer.length < need) return;
      }
      const bytes = this.buffer;
      this.buffer = new Uint8Array();
      if (this.state === "magic") {
        const magic = new DataView(bytes.buffer).getUint32(0, true);
        if ((magic & 0xfffffff0) === 0x184d2a50) this.state = "skipSize";
        else if (magic === 0xfd2fb528) this.state = "descriptor";
        else
          throw new FlasherError(
            "error.zstdMagic",
            "Invalid Zstandard frame magic",
            {},
          );
      } else if (this.state === "skipSize") {
        this.skip = new DataView(bytes.buffer).getUint32(0, true);
        this.state = "magic";
      } else if (this.state === "descriptor") {
        const descriptor = bytes[0];
        if (descriptor & 0x18)
          throw new FlasherError(
            "error.zstdFlags",
            "Reserved Zstandard frame flags",
            {},
          );
        const single = Boolean(descriptor & 0x20);
        const sizeFlag = descriptor >> 6;
        this.checksum = Boolean(descriptor & 4);
        this.headerSize =
          (single ? 0 : 1) +
          [0, 1, 2, 4][descriptor & 3] +
          (sizeFlag === 0 ? (single ? 1 : 0) : [0, 2, 4, 8][sizeFlag]);
        this.state = this.headerSize ? "header" : "block";
      } else if (this.state === "header") {
        this.state = "block";
      } else {
        const header = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16);
        const type = (header >> 1) & 3;
        if (type === 3)
          throw new FlasherError(
            "error.zstdBlockType",
            "Invalid Zstandard block type",
            {},
          );
        const size = header >>> 3;
        if (size > 128 * 1024)
          throw new FlasherError(
            "error.zstdBlockSize",
            "Invalid Zstandard block size",
            {},
          );
        this.skip = type === 1 ? 1 : size;
        if (header & 1) {
          this.frames++;
          if (this.checksum) this.skip += 4;
          this.state = "magic";
        }
      }
      if (offset === input.length && !this.buffer.length) return;
    }
  }

  /** Rejects truncated streams, including streams ending inside a checksum. */
  finish() {
    if (
      !this.frames ||
      this.state !== "magic" ||
      this.skip ||
      this.buffer.length
    )
      throw new FlasherError(
        "error.truncatedZstd",
        "Truncated Zstandard image",
        {},
      );
  }
}
