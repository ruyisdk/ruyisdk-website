import { provision } from '../src/lib/device/provision.js';
import { prepareImages } from '../src/lib/device/storage.js';
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

test('automatic and manual downloads use the catalog URLs and allow redirects', async (context) => {
  const catalogURL = 'https://github.com/vendor/image?signature=test-token';
  const blocked = [
    'https://',
    'https://user@mirror.iscas.ac.cn/image',
    'blob:' + catalogURL,
    'file:///image',
  ];
  const requests = [];
  const phases = [];
  const logs = [];
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url, redirect: new Request(url, options).redirect });
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
          resolved_urls: [...blocked, catalogURL],
        },
      ],
    },
  };
  const prepare = (overrides = {}) =>
    prepareImages(pkg, {
      root,
      runtime: {},
      progress: (value) => phases.push(value?.phase ?? null),
      log: (line) => logs.push(line),
      signal: new AbortController().signal,
      localFile: async (spec, mirrors) => {
        assert.deepEqual(mirrors, [catalogURL]);
        assert.deepEqual(phases, ['Download', null]);
        throw Error('manual import requested');
      },
      ...overrides,
    });
  const expectedRequest = (url) => ({ url, redirect: 'follow' });
  await assert.rejects(prepare(), /manual import requested/);
  assert.deepEqual(requests, [expectedRequest(catalogURL)]);
  assert.deepEqual(logs, ['github.com · image: Download request failed']);

  for (const stage of ['write', 'hash']) {
    await context.test(
      `a local ${stage} error does not prompt for another download`,
      async (subtest) => {
        subtest.mock.method(
          globalThis,
          'fetch',
          async () => new Response('img'),
        );
        let saved;
        const writer = {
          write: async () => {
            if (stage === 'write')
              throw new DOMException('Disk full', 'QuotaExceededError');
          },
          close: async () => {
            saved = new File(['img'], 'image');
          },
          abort: subtest.mock.fn(async () => {}),
        };
        const handle = {
          createWritable: async () => writer,
          getFile: async () => saved,
        };
        subtest.mock.method(root, 'getFileHandle', async (_name, options) => {
          if (!options?.create && !saved)
            throw new DOMException('missing', 'NotFoundError');
          return handle;
        });
        const manual = subtest.mock.fn(assert.fail);
        await assert.rejects(
          prepare({
            localFile: manual,
            runtime: {
              run: async () => {
                throw Error('Worker unavailable');
              },
            },
          }),
          stage === 'write'
            ? /Cannot save image: Disk full/
            : /Cannot verify SHA-256 for image: Worker unavailable/,
        );
        assert.equal(manual.mock.callCount(), 0);
        assert.equal(writer.abort.mock.callCount(), stage === 'write' ? 1 : 0);
      },
    );
  }

  const ticket = 'ruyi-image://download/test-ticket';
  const installHost = (subtest, lookup) => {
    globalThis.window = { ruyiImager: { getMirrorDownloadURL: lookup } };
    subtest.after(() => delete globalThis.window);
    requests.length = 0;
    phases.length = 0;
  };
  await context.test(
    'a failed desktop download prompts for import without a direct request',
    async (subtest) => {
      const lookup = subtest.mock.fn(() => ticket);
      installHost(subtest, lookup);
      await assert.rejects(prepare(), /manual import requested/);
      assert.deepEqual(
        lookup.mock.calls.map(({ arguments: args }) => args),
        [[catalogURL]],
      );
      assert.deepEqual(requests, [expectedRequest(ticket)]);
      assert.equal(logs.at(-1), 'github.com · image: Download request failed');
    },
  );

  await context.test(
    'cancelling a pending desktop lookup settles before it replies',
    { timeout: 2000 },
    async (subtest) => {
      const started = Promise.withResolvers();
      const lookup = Promise.withResolvers();
      installHost(subtest, () => {
        started.resolve();
        return lookup.promise;
      });
      const controller = new AbortController();
      const stopped = assert.rejects(
        prepare({ signal: controller.signal, localFile: assert.fail }),
        { name: 'AbortError' },
      );
      await started.promise;
      controller.abort();
      await stopped;
      lookup.resolve(ticket);
      await new Promise(setImmediate);
      assert.deepEqual(requests, []);
    },
  );

  for (const [scenario, lookup] of [
    ['lookup rejects', () => Promise.reject(Error('IPC unavailable'))],
    ['lookup returns an invalid address', () => undefined],
  ]) {
    await context.test(
      `manual import is available when desktop ${scenario}`,
      async (subtest) => {
        installHost(subtest, lookup);
        await assert.rejects(prepare(), /manual import requested/);
        assert.deepEqual(requests, []);
      },
    );
  }
});

test('preparing multiple images downloads only missing archives and reuses them on restart', async (context) => {
  const names = ['boot', 'root'];
  const cached = new Map([['boot', new File(['boot'], 'boot')]]);
  const archives = {
    async getFileHandle(name, options) {
      if (!cached.has(name) && !options?.create)
        throw new DOMException('missing', 'NotFoundError');
      return {
        getFile: async () => cached.get(name),
        createWritable: async () => {
          const chunks = [];
          return {
            write: async (chunk) => chunks.push(chunk),
            close: async () => cached.set(name, new File(chunks, name)),
          };
        },
      };
    },
  };
  const images = {
    getFileHandle: async (name) => ({ getFile: async () => cached.get(name) }),
  };
  const root = {
    getDirectoryHandle: async (name) =>
      ({ downloads: archives, images })[name] ?? root,
  };
  const pkg = {
    package: 'test',
    version: '1',
    data: {
      provisionable: { partition_map: { boot: 'boot', root: 'root' } },
      blob: { distfiles: names },
      distfiles: names.map((name) => ({
        name,
        size: name.length,
        checksums: { sha256: name },
        resolved_urls: [`https://example.org/${name}`],
      })),
    },
  };
  const requests = context.mock.method(
    globalThis,
    'fetch',
    async () => new Response('root'),
  );
  const jobs = [];
  const options = {
    root,
    signal: new AbortController().signal,
    localFile: assert.fail,
    log() {},
    progress() {},
    runtime: {
      async run({ kind, file }) {
        jobs.push([kind, file.name]);
        return kind === 'hash' ? file.text() : [file.name];
      },
    },
  };
  for (let run = 0; run < 2; run++) {
    jobs.length = 0;
    assert.deepEqual([...(await prepareImages(pkg, options)).keys()], names);
    assert.deepEqual(
      jobs,
      names.flatMap((name) => [
        ['hash', name],
        ['extract', name],
      ]),
    );
    assert.deepEqual(
      requests.mock.calls.map((call) => call.arguments[0]),
      ['https://example.org/root'],
    );
  }
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
