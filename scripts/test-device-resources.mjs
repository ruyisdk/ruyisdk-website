import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { prepareImages, trustedDownload } from '../src/lib/device/storage.js';

test('automatic downloads use trusted HTTPS origins and refuse redirects', async (context) => {
  const trusted = 'https://mirror.iscas.ac.cn/revyos/image';
  const blocked = [
    'http://mirror.iscas.ac.cn/image',
    'https://mirror.iscas.ac.cn:8443/image',
    'https://mirror.iscas.ac.cn.example.org/image',
    'https://user@mirror.iscas.ac.cn/image',
    'blob:' + trusted,
    'http://127.0.0.1/image',
  ];
  assert.ok(blocked.every((url) => !trustedDownload(url)));
  const requests = [];
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push(url);
    assert.equal(options.redirect, 'error');
    throw new TypeError('redirect rejected');
  });
  const root = {
    getDirectoryHandle: async () => root,
    getFileHandle: async () => {
      throw new DOMException('missing', 'NotFoundError');
    },
  };
  const pkg = {
    package: 'test',
    version: '1',
    data: {
      provisionable: { partition_map: { boot: 'image' } },
      blob: { distfiles: ['image'] },
      distfiles: [
        {
          name: 'image',
          size: 3,
          checksums: { sha256: 'fixture' },
          resolved_urls: [...blocked, trusted],
        },
      ],
    },
  };
  await assert.rejects(
    prepareImages(pkg, {
      root,
      runtime: {},
      progress: () => {},
      log: () => {},
      signal: new AbortController().signal,
      localFile: async () => {
        throw Error('manual import requested');
      },
    }),
    /manual import requested/,
  );
  assert.deepEqual(requests, [trusted]);
});

test('flash reuses reviewed module and asset bytes and cannot fetch additional resources', async () => {
  const worker = await readFile(
    new URL('../static/device-worker.js', import.meta.url),
    'utf8',
  );
  const replies = [],
    requests = [];
  let version = 'old';
  const self = { postMessage: (message) => replies.push(message) };
  const ctx = vm.createContext({
    self,
    Uint8Array,
    Map,
    importScripts() {},
    Go: class {
      run() {}
    },
    WebAssembly: { instantiate: async () => ({ instance: {} }) },
    fetch: async (url) => {
      requests.push(url);
      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(0),
        text: async () => version,
      };
    },
    runProvisionTask: async (job, host) => ({
      source: await host.source('plugin'),
      asset: await host.asset('plugin', job.asset),
    }),
  });
  vm.runInContext(worker, ctx);
  const run = async (id, kind, asset, snapshot) => {
    await self.onmessage({
      data: {
        id,
        api: '/api/',
        runtimeURL: '/wasm/',
        job: { kind, modules: { plugin: 'plugin/mod.star' }, asset, snapshot },
      },
    });
    return replies.at(-1);
  };
  const { result: preview } = await run(1, 'preview', 'layout.toml');
  version = 'new';
  const before = requests.length;
  const { result } = await run(2, 'flash', 'layout.toml', preview.snapshot);
  assert.equal(result.source, 'old');
  assert.equal(result.asset, 'old');
  assert.match(
    (await run(3, 'flash', 'different.toml', preview.snapshot)).error,
    /not reviewed/,
  );
  assert.match(
    (await run(4, 'flash', 'layout.toml', 999)).error,
    /Missing reviewed/,
  );
  assert.equal(requests.length, before);
});
