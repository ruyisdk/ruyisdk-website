import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the published worker warms up and hashes with only the WASM request', async (context) => {
  const bytes = await readFile(
    new URL('../static/device-runtime/device.wasm', import.meta.url),
  );
  const replies = [];
  globalThis.self = { postMessage: (message) => replies.push(message) };
  context.after(() => delete globalThis.self);
  const fetch = context.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, '/en/device-runtime/device.wasm');
    return new Response(bytes);
  });
  await import('../static/device-worker.js');
  await self.onmessage({
    data: {
      id: 0,
      runtimeURL: '/en/device-runtime/',
      job: { kind: 'warmup' },
    },
  });
  await self.onmessage({
    data: {
      id: 1,
      runtimeURL: '/en/device-runtime/',
      job: { kind: 'hash', file: new Blob(['image']) },
    },
  });
  assert.deepEqual(replies, [
    { id: 0, result: null },
    { id: 1, result: createHash('sha256').update('image').digest('hex') },
  ]);
  assert.equal(fetch.mock.callCount(), 1);
});
