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

function wireSession(replies) {
  const sent = [],
    log = [];
  const session = new FastbootSession(
    () => {},
    (message) => log.push(message),
    new AbortController().signal,
  );
  let remaining = 0;
  session.device = {
    opened: true,
    transferOut: async (_, bytes) => {
      const buffer = Buffer.from(bytes);
      if (remaining) {
        remaining -= buffer.length;
        assert.ok(remaining >= 0);
        sent.push(buffer);
        if (!remaining) replies.push('OKAY');
      } else {
        const cmd = buffer.toString();
        sent.push(cmd);
        if (cmd.startsWith('download:')) {
          remaining = Number.parseInt(cmd.slice(9), 16);
          replies.push('DATA' + cmd.slice(9));
        } else if (!cmd.startsWith('getvar:')) replies.push('OKAY');
      }
      return { status: 'ok', bytesWritten: buffer.length };
    },
    transferIn: async () => {
      assert.ok(replies.length);
      return {
        status: 'ok',
        data: new DataView(new TextEncoder().encode(replies.shift()).buffer),
      };
    },
  };
  return { session, sent, log };
}

test('INFO limit governs actual sparse downloads and their cumulative partition offsets', async () => {
  const { session, sent } = wireSession([
    'INFOmax-download-size: 0x2000',
    'OKAY',
  ]);
  const raw = Uint8Array.from(
    { length: 16384 },
    (_, index) => (index * 3) % 251,
  );
  await session.execute(
    ['fastboot', 'flash', 'root', 'root.img'],
    new Map([['root.img', new Blob([raw])]]),
  );
  assert.equal(session.limit, 8192);
  const disk = new Uint8Array(raw.length);
  const payloads = sent.filter(Buffer.isBuffer);
  assert.ok(payloads.length > 1);
  for (const payload of payloads) {
    assert.ok(payload.length <= session.limit);
    await applySparse(new Blob([payload]), disk);
  }
  assert.equal(
    sent.filter((cmd) => cmd === 'flash:root').length,
    payloads.length,
  );
  assert.deepEqual(disk, raw);
});

test('an oversized image stops before download when the board omits its limit', async () => {
  const { session, sent } = wireSession(['FAILunknown variable']);
  const image = new Blob([new Uint8Array(16 * 1024 * 1024 + 1)]);
  await assert.rejects(
    session.execute(
      ['fastboot', 'flash', 'root', 'root.img'],
      new Map([['root.img', image]]),
    ),
    /without a device-reported download limit/,
  );
  assert.deepEqual(sent, ['getvar:max-download-size']);
});

test('a newly opened device receives no commands until explicitly reconfirmed', async () => {
  const { session, sent } = wireSession([]);
  const original = session.device;
  let consent = false,
    prompts = 0;
  session.confirmTarget(original, async () => {
    prompts++;
    return consent;
  });
  session.device = { ...original };
  const files = new Map([['loader', new Blob(['data'])]]);
  await assert.rejects(
    session.execute(['fastboot', 'stage', 'loader'], files),
    /not confirmed/,
  );
  assert.equal(prompts, 1);
  assert.deepEqual(sent, []);
  consent = true;
  await session.execute(['fastboot', 'stage', 'loader'], files);
  await session.execute(['fastboot', 'stage', 'loader'], files);
  assert.equal(prompts, 2);
});

test('informational replies are bounded per command', async () => {
  const { session, log, sent } = wireSession(Array(129).fill('INFOprogress'));
  await assert.rejects(
    session.execute(['fastboot', 'getvar', 'version'], new Map()),
    /Too many/,
  );
  assert.equal(log.length, 128);
  assert.deepEqual(sent, ['getvar:version']);
});
