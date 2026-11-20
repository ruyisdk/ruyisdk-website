import test from 'node:test';
import assert from 'node:assert/strict';
import { flashPayloads } from '../src/lib/device/sparse.js';
import { FastbootSession } from '../src/lib/device/fastboot.js';

async function applySparse(blob, disk) {
  const data = new DataView(await blob.arrayBuffer()),
    block = data.getUint32(12, true);
  assert.equal(data.getUint32(0, true), 0xed26ff3a);
  assert.equal(data.getUint32(16, true) * block, disk.byteLength);
  let offset = 28,
    target = 0;
  for (let index = 0; index < data.getUint32(20, true); index++) {
    const kind = data.getUint16(offset, true),
      length = data.getUint32(offset + 4, true) * block;
    if (kind === 0xcac1)
      disk.set(new Uint8Array(data.buffer, offset + 12, length), target);
    else if (kind === 0xcac2) {
      for (let byte = 0; byte < length; byte++)
        disk[target + byte] = data.getUint8(offset + 12 + (byte % 4));
    } else assert.equal(kind, 0xcac3);
    target += length;
    offset += data.getUint32(offset + 8, true);
  }
  assert.equal(offset, blob.size);
  assert.equal(target, disk.length);
}

test('large raw and existing sparse images survive fastboot resplitting', async () => {
  const raw = Uint8Array.from(
    { length: 4096 * 6 },
    (_, index) => (index * 7) % 251,
  );
  const result = new Uint8Array(raw.length);
  for await (const first of flashPayloads(new Blob([raw]), 12360)) {
    for await (const next of flashPayloads(first, 4200)) {
      assert.ok(next.size <= 4200);
      await applySparse(next, result);
    }
  }
  assert.deepEqual(result, raw);
});

test('stage sends the exact download, without a flash command', async () => {
  const session = new FastbootSession(
    () => {},
    () => {},
    new AbortController().signal,
  );
  const replies = ['DATA00000004', 'OKAY'];
  const writes = [];
  session.device = {
    opened: true,
    transferOut: async (_, bytes) => {
      writes.push(new Uint8Array(bytes));
      return { status: 'ok', bytesWritten: bytes.byteLength };
    },
    transferIn: async () => ({
      status: 'ok',
      data: new DataView(new TextEncoder().encode(replies.shift()).buffer),
    }),
  };
  const files = new Map([
    ['FSBL.bin', new Blob([Uint8Array.from([1, 2, 3, 4])])],
  ]);
  await session.execute(['fastboot', 'stage', 'FSBL.bin'], files);
  assert.equal(new TextDecoder().decode(writes[0]), 'download:00000004');
  assert.deepEqual([...writes[1]], [1, 2, 3, 4]);
  assert.equal(writes.length, 2);
  replies.push('DATA00000003');
  await assert.rejects(
    session.execute(['fastboot', 'stage', 'FSBL.bin'], files),
    /different download size/,
  );
  assert.equal(writes.length, 3);
  await assert.rejects(
    session.execute(['fastboot', 'flash', 'boot', 'unknown'], files),
    /missing image/,
  );
  assert.equal(writes.length, 3);
});
