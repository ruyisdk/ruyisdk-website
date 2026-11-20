import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diskCommand, desktopDisks } from '../src/lib/device/disk.js';
import { provision } from '../src/lib/device/provision.js';

test('ordinary browsers have no disk capability', () =>
  assert.equal(desktopDisks(), null));

for (const graphical of [true, false]) {
  test(`dd provisioning in the ${graphical ? 'GUI' : 'terminal'} uses only the selected disk`, async (context) => {
    const writes = [];
    const capability = {
      version: 1,
      rawDiskWrite: true,
      selectDisk: async (slot) => {
        assert.equal(slot, 'live');
        return { id: 'selection', label: 'SD reader' };
      },
      writeAndVerify: async (...args) => writes.push(args),
    };
    const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { showDirectoryPicker() {}, ruyiImager: capability },
    });
    context.after(() => {
      if (original) Object.defineProperty(globalThis, 'window', original);
      else delete globalThis.window;
    });
    const device = {
        type: 'device',
        id: 'board',
        related: ['device-variant:variant'],
      },
      variant = { type: 'device-variant', id: 'variant' },
      combo = { type: 'image-combo', id: 'combo', file_path: 'combo.toml' };
    const row = {
      category: 'board-image',
      package: 'demo',
      version: '1',
      file_path: 'pkg.toml',
    };
    const pkg = {
      ...row,
      data: {
        provisionable: { strategy: 'dd-v1', partition_map: { live: 'sd.img' } },
        blob: { distfiles: ['sd.img'] },
        distfiles: [
          {
            name: 'sd.img',
            size: 5,
            checksums: { sha256: 'digest' },
            resolved_urls: [],
          },
        ],
      },
    };
    const catalog = {
      entities: [device, variant, combo],
      packages: [row],
      hierarchy: { 'device-variant:variant': ['image-combo:combo'] },
      'plugins/index': { modules: {} },
      'vendors/en': {},
      combo: {
        data: { 'image-combo': { package_atoms: ['board-image/demo'] } },
      },
      pkg,
    };
    context.mock.method(globalThis, 'fetch', async (url) =>
      url.endsWith('.toml')
        ? new Response('')
        : Response.json(catalog[url.slice(5, -5)]),
    );
    const file = new File(['image'], 'sd.img'),
      root = {
        name: 'work',
        getDirectoryHandle: async () => root,
        getFileHandle: async () => ({ getFile: async () => file }),
      };
    const runtime = {
      api: '/api/',
      base: '/',
      run: async (job, command) => {
        if (job.kind === 'hash') return 'digest';
        if (job.kind === 'extract') return ['sd.img'];
        assert.deepEqual(job.blockDevices, { live: 'SD reader' });
        if (job.kind === 'preview')
          return { snapshot: 7, priority: 0, steps: ['sd.img → SD reader'] };
        assert.equal(job.snapshot, 7);
        return command(['dd', 'if=sd.img', 'of=SD reader', 'bs=4096']);
      },
    };
    const ui = {
      choose: async () => 0,
      confirm: async () => true,
      log() {},
      progress() {},
      directory: async () => root,
      device: assert.fail,
      fastbootRequired: (value) => assert.equal(value, false),
    };
    if (graphical) {
      ui.selectSystem = async () => combo;
      ui.preparePackages = async ({ inspect, defaults }) => {
        const result = await inspect(defaults);
        assert.equal(result.issue, undefined);
        return result.packages;
      };
      ui.review = (steps) => assert.deepEqual(steps, ['sd.img → SD reader']);
    }
    await provision({
      runtime,
      usb: {},
      ui,
      locale: 'en_US',
      signal: new AbortController().signal,
    });
    assert.equal(writes.length, 1);
    assert.equal(writes[0][0], 'selection');
  });
}

test('only the reviewed image and disk can reach the host writer', async () => {
  const calls = [];
  const execute = diskCommand({
    paths: { live: 'sd.img' },
    targets: { live: { id: 'token', label: 'Reader A' } },
    files: new Map([['sd.img', new File(['image'], 'sd.img')]]),
    runtime: { run: async () => 'digest' },
    host: { writeAndVerify: async (...args) => calls.push(args) },
    signal: new AbortController().signal,
    log() {},
    directory: 'work',
    pkg: { package: 'os', version: '1' },
  });
  for (const argv of [
    ['dd', 'if=sd.img', 'of=Reader B', 'bs=4096'],
    ['dd', 'if=unknown', 'of=Reader A', 'bs=4096'],
    ['sudo', 'dd'],
    ['dd', 'if=sd.img', 'of=Reader A', 'bs=4096', 'seek=1'],
  ])
    await assert.rejects(execute(argv), /Unreviewed/);
  assert.deepEqual(
    await execute(['dd', 'if=sd.img', 'of=Reader A', 'bs=4096']),
    { status: 0, output: '' },
  );
  assert.deepEqual(calls, [
    [
      'token',
      {
        directory: 'work',
        parts: ['RuyiImages', 'os', '1', 'images', 'sd.img'],
        size: 5,
        sha256: 'digest',
      },
    ],
  ]);
});

test('the published dd-v1 plugin previews and executes the selected disk and live slots', async () => {
  const runtime = new URL('../static/device-runtime/', import.meta.url);
  const bundle = new URL(
    '../static/data/api/api_packages_index/plugins/',
    import.meta.url,
  );
  await import(new URL('wasm_exec.js', runtime));
  const go = new globalThis.Go();
  const { instance } = await WebAssembly.instantiate(
    await readFile(new URL('device.wasm', runtime)),
    go.importObject,
  );
  void go.run(instance);
  const { modules } = JSON.parse(
    await readFile(new URL('index.json', bundle), 'utf8'),
  );
  for (const slot of ['disk', 'live']) {
    const commands = [];
    const host = {
      source: async (name) => readFile(new URL(modules[name], bundle), 'utf8'),
      asset: async (name, path) =>
        readFile(
          new URL(`data/${path}`, new URL(modules[name], bundle)),
          'utf8',
        ),
      log() {},
      command: async (argv) => {
        commands.push(argv);
        return { status: 0, output: '' };
      },
    };
    const args = {
      strategy: 'dd-v1',
      paths: { [slot]: 'sd.img' },
      blockDevices: { [slot]: 'Reader A' },
      locale: 'en_US',
      messages: await readFile(new URL('messages.toml', runtime), 'utf8'),
    };
    const plan = await globalThis.runProvisionTask(
      { kind: 'preview', ...args },
      host,
    );
    assert.match(plan.steps[0], /Reader A/);
    await globalThis.runProvisionTask({ kind: 'flash', ...args }, host);
    assert.deepEqual(commands, [['dd', 'if=sd.img', 'of=Reader A', 'bs=4096']]);
    await assert.rejects(
      globalThis.runProvisionTask(
        { kind: 'preview', ...args, blockDevices: {} },
        host,
      ),
      /Missing target disk/,
    );
  }
});
