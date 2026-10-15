import { FlasherError, serializeError } from "./errors.mjs";
import { normalizePath } from "./plan.mjs";
import { inspectImage } from "./sparse.mjs";
import { extractTar } from "./tar.mjs";
import { ZstdFrames } from "./zstd.mjs";
import { ZipReader, BlobReader } from "@zip.js/zip.js";
import { createSHA256, createSHA512 } from "hash-wasm";
import createZstd from "zstd-codec/lib/zstd-codec-binding-wasm.js";

/** Loads the pinned codec's streaming binding without collecting its output in memory. */
const zstdReady = new Promise((resolve, reject) => {
  const binding = {
    onRuntimeInitialized: () => resolve({ binding }),
    onAbort: (reason) => reject(new Error(String(reason))),
  };
  createZstd(binding);
});

/** Reads a file in bounded chunks, reporting progress to the page. */
async function* chunks(file, phase) {
  const size = 64 * 1024;
  let last = 0;
  for (let offset = 0; offset < file.size; offset += size) {
    const bytes = new Uint8Array(
      await file.slice(offset, offset + size).arrayBuffer(),
    );
    yield bytes;
    if (Date.now() - last > 150 || offset + size >= file.size) {
      self.postMessage({
        type: "progress",
        phase,
        name: file.name,
        progress: Math.min(1, (offset + size) / file.size),
      });
      last = Date.now();
    }
  }
}

/** Verifies the original download against the selected catalog profile. */
async function verify(file, distfiles) {
  const expected = distfiles.find((item) => item.name === file.name);
  if (!expected) return false;
  if (expected.size && file.size !== expected.size)
    throw new FlasherError(
      "error.downloadSize",
      "Download size mismatch: {name}",
      { name: file.name },
    );
  const algorithm = expected.checksums?.sha256
    ? "sha256"
    : expected.checksums?.sha512
      ? "sha512"
      : null;
  if (!algorithm)
    throw new FlasherError(
      "error.noChecksum",
      "No checksum is available for {name}",
      { name: file.name },
    );
  const hash = await (algorithm === "sha256" ? createSHA256() : createSHA512());
  hash.init();
  for await (const chunk of chunks(file, "verifying")) hash.update(chunk);
  if (hash.digest() !== expected.checksums[algorithm].toLowerCase())
    throw new FlasherError("error.checksum", "Checksum mismatch: {name}", {
      name: file.name,
    });
  return true;
}

/** Prepares local image files in a session-specific browser storage directory. */
async function prepare({ files, session, profile }) {
  const storage = await navigator.storage.getDirectory();
  const directory = await storage.getDirectoryHandle(session, { create: true });
  const entries = [];
  const seen = new Set();
  const expected = profile
    ? Object.values(profile.partition_map).map(normalizePath)
    : null;
  let total = 0;
  let currentVerified = false;
  const estimate = await navigator.storage.estimate();
  const limit = Math.min(
    64 * 1024 ** 3,
    Math.max(0, (estimate.quota || 64 * 1024 ** 3) - (estimate.usage || 0)),
  );
  const wanted = (name) =>
    expected
      ? expected.some((path) => name === path || name.endsWith("/" + path))
      : /\.(img|ext4|bin|itb|vfat)$/i.test(name);

  /** Opens one selected image with a generated storage name. */
  async function open(name, size) {
    name = normalizePath(name);
    if (!wanted(name)) return null;
    if (seen.has(name))
      throw new FlasherError("error.duplicate", "Duplicate image: {name}", {
        name: name,
      });
    seen.add(name);
    if (entries.length >= 128)
      throw new FlasherError("error.tooManyImages", "Too many image files", {});
    if (size !== undefined && size > limit - total)
      throw new FlasherError(
        "error.storageInsufficient",
        "Not enough browser storage for the extracted images",
        {},
      );
    const handle = await directory.getFileHandle(String(entries.length), {
      create: true,
    });
    const writer = await handle.createSyncAccessHandle();
    let written = 0;
    const entry = { name, handle, verified: currentVerified };
    entries.push(entry);
    return {
      write(bytes) {
        if (total + bytes.byteLength > limit)
          throw new FlasherError(
            "error.storageLimit",
            "Browser storage limit exceeded",
            {},
          );
        let offset = 0;
        while (offset < bytes.length) {
          const count = writer.write(bytes.subarray(offset), { at: written });
          if (!count)
            throw new FlasherError(
              "error.storageWrite",
              "Failed to write extracted image",
              {},
            );
          offset += count;
          written += count;
          total += count;
        }
      },
      close() {
        try {
          writer.flush();
        } finally {
          writer.close();
        }
        if (size !== undefined && written !== size)
          throw new FlasherError(
            "error.truncatedImage",
            "Truncated image: {name}",
            { name: name },
          );
      },
    };
  }

  for (const file of files) {
    if (!file.size)
      throw new FlasherError("error.emptyInput", "Empty input file: {name}", {
        name: file.name,
      });
    currentVerified = await verify(file, profile?.distfiles || []);
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".zip")) {
      const zip = new ZipReader(new BlobReader(file), { useWebWorkers: false });
      try {
        for await (const entry of zip.getEntriesGenerator()) {
          if (entry.directory) continue;
          const name = normalizePath(entry.filename);
          if (!wanted(name)) continue;
          if (entry.encrypted)
            throw new FlasherError(
              "error.encryptedZip",
              "Encrypted ZIP files are not supported",
              {},
            );
          const sink = await open(name, entry.uncompressedSize);
          if (sink) {
            try {
              await entry.getData(
                new WritableStream({ write: (chunk) => sink.write(chunk) }),
                {
                  checkSignature: true,
                  onprogress: (done, totalBytes) =>
                    self.postMessage({
                      type: "progress",
                      phase: "extracting",
                      name,
                      progress: totalBytes ? done / totalBytes : 0,
                    }),
                },
              );
            } finally {
              sink.close();
            }
          }
        }
      } finally {
        await zip.close();
      }
    } else if (
      lower.endsWith(".tar.gz") ||
      lower.endsWith(".tgz") ||
      lower.endsWith(".tar")
    ) {
      const iterator = chunks(file, "extracting");
      const input = new ReadableStream({
        async pull(controller) {
          try {
            const { value, done } = await iterator.next();
            if (done) controller.close();
            else controller.enqueue(value);
          } catch (error) {
            controller.error(error);
          }
        },
        cancel() {
          return iterator.return();
        },
      });
      await extractTar(
        lower.endsWith(".tar")
          ? input
          : input.pipeThrough(new DecompressionStream("gzip")),
        open,
      );
    } else if (lower.endsWith(".zst")) {
      const sink = await open(file.name.slice(0, -4));
      if (!sink)
        throw new FlasherError(
          "error.profileMismatch",
          "This image does not belong to the selected profile: {name}",
          { name: file.name },
        );
      const { binding } = await zstdReady;
      const decoder = new binding.ZstdDecompressStreamBinding();
      const framing = new ZstdFrames();
      try {
        if (!decoder.begin())
          throw new FlasherError(
            "error.zstdInit",
            "Could not initialize Zstandard",
            {},
          );
        for await (const chunk of chunks(file, "decompressing")) {
          framing.push(chunk);
          if (!decoder.transform(chunk, (bytes) => sink.write(bytes)))
            throw new FlasherError(
              "error.invalidZstd",
              "Invalid Zstandard image",
              {},
            );
        }
        framing.finish();
        if (!decoder.end((bytes) => sink.write(bytes)))
          throw new FlasherError(
            "error.truncatedZstd",
            "Truncated Zstandard image",
            {},
          );
      } finally {
        decoder.delete();
        sink.close();
      }
    } else if (lower.endsWith(".gz")) {
      const sink = await open(file.name.slice(0, -3));
      if (!sink)
        throw new FlasherError(
          "error.profileMismatch",
          "This image does not belong to the selected profile: {name}",
          { name: file.name },
        );
      try {
        await file
          .stream()
          .pipeThrough(new DecompressionStream("gzip"))
          .pipeTo(new WritableStream({ write: (chunk) => sink.write(chunk) }));
      } finally {
        sink.close();
      }
    } else {
      const name = normalizePath(file.name);
      if (!wanted(name))
        throw new FlasherError(
          "error.unsupportedFile",
          "Unsupported file or image does not match the selected profile: {name}",
          { name: file.name },
        );
      if (seen.has(name))
        throw new FlasherError("error.duplicate", "Duplicate image: {name}", {
          name: name,
        });
      seen.add(name);
      entries.push({ name, file, verified: currentVerified });
    }
  }
  if (!entries.length)
    throw new FlasherError("error.noImages", "No matching images found", {});
  return Promise.all(
    entries.map(async ({ name, file, handle, verified }) => ({
      name,
      file: file || (await handle.getFile()),
      verified,
    })),
  );
}

/** Handles a single preparation request; the page terminates this worker on cancellation. */
self.onmessage = async (event) => {
  try {
    const entries = await prepare(event.data);
    for (const entry of entries) await inspectImage(entry.file);
    self.postMessage({ type: "done", entries });
  } catch (error) {
    self.postMessage({
      type: "error",
      ...serializeError(error),
    });
  }
};
