import { provision } from '../src/lib/device/provision.js';
import { prepareImages, trustedDownload } from '../src/lib/device/storage.js';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const setupCatalog = (signal, selectSystem) =>
  provision({
    runtime: { api: '/api/' },
    locale: 'zh_CN',
    ui: { selectSystem },
    signal,
  });

test('setup uses English vendor names when the Chinese map is unavailable', async (context) => {
  const requests = [];
  context.mock.method(globalThis, 'fetch', async (url) => {
    requests.push(url);
    if (url.endsWith('zh-Hans.json'))
      return new Response(null, { status: 404 });
    if (url.endsWith('en.json')) return Response.json({ sipeed: 'Sipeed' });
    if (url.endsWith('combo.json'))
      return Response.json({ data: { 'image-combo': { package_atoms: [] } } });
    return Response.json([]);
  });
  await setupCatalog(new AbortController().signal, (catalog, vendors) => {
    assert.deepEqual(vendors, { sipeed: 'Sipeed' });
    return { file_path: 'combo.toml' };
  });
  assert.deepEqual(
    requests.filter((url) => url.includes('/vendors/')),
    ['/api/vendors/zh-Hans.json', '/api/vendors/en.json'],
  );
});

test('stalled vendor response bodies time out, including the English fallback', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const requests = [];
  context.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    if (!url.includes('/vendors/')) return Response.json([]);
    return {
      ok: true,
      json: () =>
        new Promise((resolve, reject) => {
          requests.push(url);
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          );
        }),
    };
  });
  const done = assert.rejects(
    setupCatalog(new AbortController().signal, assert.fail),
    /读取索引超时.*vendors\/en\.json/,
  );
  await new Promise(setImmediate);
  assert.deepEqual(requests, ['/api/vendors/zh-Hans.json']);
  context.mock.timers.tick(15_000);
  await new Promise(setImmediate);
  assert.deepEqual(requests, [
    '/api/vendors/zh-Hans.json',
    '/api/vendors/en.json',
  ]);
  context.mock.timers.tick(15_000);
  await done;
});

test('cancelling setup does not start an English fallback request', async (context) => {
  const controller = new AbortController();
  context.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    if (!url.includes('/vendors/')) return Response.json([]);
    assert.ok(url.endsWith('zh-Hans.json'));
    controller.abort();
    signal.throwIfAborted();
  });
  await assert.rejects(setupCatalog(controller.signal, assert.fail), {
    name: 'AbortError',
  });
});

test('automatic downloads use trusted HTTPS origins and refuse redirects', async (context) => {
  const trusted =
    'https://mirror.iscas.ac.cn/revyos/image?signature=test-token';
  const blocked = [
    'https://',
    'https://example.org/image',
    'http://mirror.iscas.ac.cn/image',
    'https://mirror.iscas.ac.cn:8443/image',
    'https://mirror.iscas.ac.cn.example.org/image',
    'https://user@mirror.iscas.ac.cn/image',
    'blob:' + trusted,
    'http://127.0.0.1/image',
  ];
  assert.ok(blocked.every((url) => !trustedDownload(url)));
  const requests = [];
  const phases = [];
  const logs = [];
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push(url);
    assert.equal(options.redirect, 'error');
    throw new TypeError(`Failed to fetch ${url}`);
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
  const prepare = () =>
    prepareImages(pkg, {
      root,
      runtime: {},
      progress: (value) => phases.push(value?.phase ?? null),
      log: (line) => logs.push(line),
      signal: new AbortController().signal,
      localFile: async (spec, mirrors) => {
        assert.deepEqual(mirrors, [trusted]);
        assert.deepEqual(phases, ['Download', null]);
        throw Error('manual import requested');
      },
    });
  await assert.rejects(prepare(), /manual import requested/);
  assert.deepEqual(requests, [trusted]);
  assert.deepEqual(logs, ['mirror.iscas.ac.cn: Download failed']);

  await context.test(
    'Electron fetches the host-issued URL and keeps manual fallback',
    async (subtest) => {
      const ticket = 'ruyi-image://download/test-ticket';
      globalThis.window = {
        ruyiImager: {
          getMirrorDownloadURL(url) {
            assert.equal(url, trusted);
            return ticket;
          },
        },
      };
      subtest.after(() => delete globalThis.window);
      phases.length = 0;
      await assert.rejects(prepare(), /manual import requested/);
      assert.deepEqual(requests, [trusted, ticket]);
      assert.equal(logs.at(-1), 'mirror.iscas.ac.cn: Download failed');
    },
  );
});

test('manual import verifies the selected file and extracts it without caching a copy', async () => {
  const name = 'root.ext4.zst';
  const archive = new File(['archive'], name);
  const image = new File(['partition'], 'root.ext4');
  const archives = {
    getFileHandle: async (path, options) => {
      assert.equal(path, name);
      assert.ok(!options?.create, 'manual imports must not create an archive');
      throw new DOMException('missing', 'NotFoundError');
    },
  };
  const images = {
    getFileHandle: async (path) => {
      assert.equal(path, image.name);
      return { getFile: async () => image };
    },
  };
  const root = {
    getDirectoryHandle: async (path) =>
      ({ downloads: archives, images })[path] ?? root,
  };
  const pkg = {
    package: 'test',
    version: '1',
    data: {
      provisionable: { partition_map: { root: image.name } },
      blob: { distfiles: [name] },
      distfiles: [
        {
          name,
          size: archive.size,
          checksums: { sha256: 'expected' },
          resolved_urls: [],
        },
      ],
    },
  };
  let checksum = 'wrong';
  const jobs = [];
  const options = {
    root,
    log: () => {},
    progress: () => {},
    signal: new AbortController().signal,
    localFile: async () => archive,
    runtime: {
      run: async (job) => {
        jobs.push(job.kind);
        assert.equal(job.file, archive);
        if (job.kind === 'hash') return checksum;
        assert.equal(job.dir, images);
        return [image.name];
      },
    },
  };
  await assert.rejects(prepareImages(pkg, options), /SHA-256 mismatch/);
  assert.deepEqual(jobs, ['hash']);
  checksum = 'expected';
  assert.equal((await prepareImages(pkg, options)).get(image.name), image);
  assert.deepEqual(jobs, ['hash', 'hash', 'extract']);
});

test('flash reuses reviewed module and asset bytes and cannot fetch additional resources', async () => {
  const worker = await readFile(
    new URL('../tools/device-runtime/worker.js', import.meta.url),
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
