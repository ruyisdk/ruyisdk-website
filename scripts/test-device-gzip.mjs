import { FastbootSession } from '../src/lib/device/fastboot.js';
import { packageFastboot } from '../src/lib/device/spacemit.js';
import '../static/device-runtime/wasm_exec.js';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';

const go = new Go();
const { instance } = await WebAssembly.instantiate(
  await readFile(
    new URL('../static/device-runtime/device.wasm', import.meta.url),
  ),
  go.importObject,
);
go.run(instance);

test('xz and lz4 images stream to the declared partition file', async () => {
  const raw = Buffer.from('ruyi\n'.repeat(128));
  for (const [extension, archive] of [
    [
      '.xz',
      '/Td6WFoAAATm1rRGBMAXgAUhARYAAAAAAAAAAG1ISvDgAn8AD10AOR1LkfN1+t3cKlTio2AAAAC9UuZ8KQ8ztwABM4AFAAAAfuGDx7HEZ/sCAAAAAARZWg==',
    ],
    ['.lz4', 'BCJNGGRApxEAAABfcnV5aQoFAP//ZVBydXlpCgAAAABJpRs4'],
  ]) {
    const writes = [],
      percentages = [];
    let writer;
    const host = {
      progress: (percent) => percentages.push(percent),
      async open(name) {
        assert.equal(name, 'disk.img');
        const output = new WritableStream({
          write: (chunk) => {
            writes.push(Buffer.from(chunk));
          },
        });
        writer = output.getWriter();
      },
      write: (chunk) => writer.write(chunk),
      close: async () => {
        assert.ok(percentages.every((percent) => percent < 100));
        await writer.close();
      },
    };
    const found = await runProvisionTask(
      {
        kind: 'extract',
        file: new Blob([Buffer.from(archive, 'base64')]),
        name: `disk.img${extension}`,
        wanted: ['disk.img'],
      },
      host,
    );
    assert.deepEqual(found, ['disk.img']);
    assert.deepEqual(Buffer.concat(writes), raw);
    assert.ok(percentages.some((percent) => percent > 0 && percent < 100));
    assert.equal(percentages.at(-1), 100);
  }
});

test('ZIP progress counts only selected output and completes after the last close', async () => {
  const file = new Blob([
    Buffer.from(
      'UEsDBBQAAAAIAHKZdV3oDyghBgAAAFAAAAAEAAAAc2tpcKuooC4AAFBLAwQUAAAACABymXVdCuqbHAUAAAADAAAAAQAAAGGrqKgAAFBLAwQUAAAACABymXVdw/7CbgUAAAAJAAAAAQAAAGKrqIACAFBLAQIUAxQAAAAIAHKZdV3oDyghBgAAAFAAAAAEAAAAAAAAAAAAAACAAQAAAABza2lwUEsBAhQDFAAAAAgAcpl1XQrqmxwFAAAAAwAAAAEAAAAAAAAAAAAAAIABKAAAAGFQSwECFAMUAAAACABymXVdw/7CbgUAAAAJAAAAAQAAAAAAAAAAAAAAgAFMAAAAYlBLBQYAAAAAAwADAJAAAABwAAAAAAA=',
      'base64',
    ),
  ]);
  const job = { kind: 'extract', name: 'images.zip', file, wanted: ['a', 'b'] };
  const events = [];
  const host = {
    open: async (name) => {
      events.push(name);
    },
    write: async () => {},
    close: async () => {
      events.push('closed');
    },
    progress: (percent) => events.push(percent),
  };
  assert.deepEqual(await runProvisionTask(job, host), job.wanted);
  assert.deepEqual(events, ['a', 25, 'closed', 'b', 99, 'closed', 100]);
  events.length = 0;
  await assert.rejects(
    runProvisionTask(job, {
      ...host,
      close: async () => {
        throw Error('disk full');
      },
    }),
    /disk full/,
  );
  assert.deepEqual(events, ['a', 25]);
});
const limit = 16384;
const paths = { gpt: 'layout.json', rootfs: 'root.ext4' };
const layout = {
  format: 'gpt',
  partitions: [{ name: 'rootfs', image: paths.rootfs, compress: 'gzip-5' }],
};

async function fixture(packetSize, raw, strategy = 'spacemit-k3-v1') {
  const trace = [];
  const usb = new FastbootSession(
    () => {},
    () => {},
    new AbortController().signal,
    (line) => trace.push(line),
  );
  const alternate = {
    alternateSetting: 0,
    interfaceClass: 255,
    interfaceSubclass: 66,
    interfaceProtocol: 3,
    endpoints: ['in', 'out'].map((direction, index) => ({
      type: 'bulk',
      direction,
      endpointNumber: index + 1,
      packetSize,
    })),
  };
  const configuration = {
    configurationValue: 1,
    interfaces: [{ interfaceNumber: 0, alternate, alternates: [alternate] }],
  };
  const device = {
    configuration,
    configurations: [configuration],
    opened: true,
    open: async () => {},
    claimInterface: async () => {},
    vendorId: 1,
    productId: 1,
  };
  await usb.open(device);
  const commands = [],
    payloads = [],
    levels = [];
  usb.command = async (command) => {
    commands.push(command);
    if (command === 'getvar:max-download-size') return String(limit);
    if (device.failAt === payloads.length && command.startsWith('flash:'))
      throw Error('USB disconnected');
    return '';
  };
  usb.download = async (file) => {
    assert.ok(file.size <= limit);
    payloads.push(Buffer.from(await file.arrayBuffer()));
  };
  const runtime = {
    run: async (job) => {
      levels.push(job.level);
      return runProvisionTask(job, {});
    },
  };
  const files = new Map([
    [paths.gpt, new Blob([JSON.stringify(layout)])],
    [paths.rootfs, new Blob([raw])],
  ]);
  const execute = await packageFastboot(usb, runtime, strategy, paths, files);
  const flash = (partition, path) =>
    execute(['fastboot', 'flash', partition, path]);
  return { device, commands, payloads, levels, flash, trace };
}

test('USB 2 Bianbu writes independent gzip members at aligned partition offsets', async () => {
  const raw = randomBytes(limit * 3 + 193);
  const { flash, payloads, levels, commands, trace } = await fixture(512, raw);
  await flash('gpt', paths.gpt);
  await flash('rootfs', paths.rootfs);
  const blocks = payloads.slice(1).map((bytes) => gunzipSync(bytes));
  assert.ok(blocks.length > 1);
  for (const block of blocks.slice(0, -1)) assert.equal(block.length % 4096, 0);
  assert.deepEqual(Buffer.concat(blocks), raw);
  assert.ok(trace.includes('GPT rootfs: root.ext4, gzip-5'));
  assert.ok(
    trace.some(
      (line) => line.startsWith('rootfs: image=') && line.endsWith('gzip=on'),
    ),
  );
  assert.deepEqual(new Set(levels), new Set([5]));
  assert.equal(
    commands.filter((command) => command === 'flash:rootfs').length,
    blocks.length,
  );
});

test('USB speed, strategy, layout and sparse magic gate compression', async () => {
  const raw = Buffer.alloc(4096, 1);
  for (const condition of [
    'usb3',
    'unknown-speed',
    'unmarked',
    'wrong-path',
    'no-gpt',
    'mtd',
    'other-strategy',
    'sparse',
  ]) {
    const data = Buffer.from(raw);
    if (condition === 'sparse') data.writeUInt32LE(0xed26ff3a);
    const { flash, levels, payloads, trace } = await fixture(
      condition === 'usb3'
        ? 1024
        : condition === 'unknown-speed'
          ? undefined
          : 512,
      data,
      condition === 'other-strategy' ? 'std-fastboot-v1' : 'spacemit-k1-v1',
    );
    if (condition !== 'no-gpt') await flash('gpt', paths.gpt);
    if (condition === 'mtd') await flash('mtd', paths.gpt);
    await flash(
      condition === 'unmarked' ? 'uboot' : 'rootfs',
      condition === 'wrong-path' ? paths.gpt : paths.rootfs,
    );
    assert.equal(levels.length, 0, condition);
    assert.match(
      trace.findLast((line) => line.includes('gzip=off')),
      /gzip=off \(.+\)/,
      condition,
    );
    assert.deepEqual(
      payloads.at(-1),
      condition === 'wrong-path' ? Buffer.from(JSON.stringify(layout)) : data,
      condition,
    );
  }
});

test('lost flash acknowledgement stops gzip without resending the block', async () => {
  const { device, flash, commands, payloads, trace } = await fixture(
    512,
    Buffer.alloc(limit * 4),
  );
  await flash('gpt', paths.gpt);
  device.failAt = 3;
  await assert.rejects(flash('rootfs', paths.rootfs), /USB disconnected/);
  assert.equal(payloads.length, 3);
  assert.match(
    trace.at(-1),
    /ERROR fastboot flash rootfs root.ext4 \(chunk 2\): USB disconnected/,
  );
  assert.equal(
    commands.filter((command) => command === 'flash:rootfs').length,
    2,
  );
});
