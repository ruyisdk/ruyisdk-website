import { gzipPayloads } from './spacemit.js';
import { flashPayloads } from './sparse.js';

const filter = { classCode: 0xff, subclassCode: 0x42, protocolCode: 0x03 };
const encoder = new TextEncoder(),
  decoder = new TextDecoder();
class RemoteFailure extends Error {}

async function gzipSkipReason(session, file, compress) {
  if (!compress) return 'no matching gzip rule';
  if (!session.usb2Bulk) return 'USB 2 bulk connection not detected';
  if (!session.reportedLimit) return 'device download limit unknown';
  if (session.limit < 8192) return 'device download limit too small';
  if (file.size < 4) return 'image too small';
  const header = new DataView(await file.slice(0, 4).arrayBuffer());
  return header.getUint32(0, true) === 0xed26ff3a
    ? 'Android sparse image'
    : null;
}

export class FastbootSession {
  constructor(changed, log, signal, trace = () => {}) {
    this.changed = changed;
    this.log = log;
    this.trace = trace;
    this.signal = signal;
    this.label = 'Disconnected';
    this.acceptSelection = true;
    this.disconnect = (event) => {
      if (event.device === this.device) {
        this.device = null;
        this.limit = null;
        this.status('Disconnected');
      }
    };
    navigator.usb?.addEventListener('disconnect', this.disconnect);
  }
  status(label) {
    this.label = label;
    this.trace(`USB: ${label}`);
    this.changed();
  }
  async select() {
    if (!this.acceptSelection || this.selecting) return;
    this.selecting = true;
    try {
      const device = await navigator.usb.requestDevice({ filters: [filter] });
      this.signal.throwIfAborted();
      if (this.device && this.device !== device) await this.device.close();
      await this.open(device);
    } finally {
      this.selecting = false;
      this.changed();
    }
  }
  async open(device) {
    await device.open();
    try {
      let match;
      for (const config of device.configurations)
        for (const iface of config.interfaces)
          for (const alt of iface.alternates) {
            if (
              alt.interfaceClass !== filter.classCode ||
              alt.interfaceSubclass !== filter.subclassCode ||
              alt.interfaceProtocol !== filter.protocolCode
            )
              continue;
            const bulk = alt.endpoints.filter(
              (endpoint) => endpoint.type === 'bulk',
            );
            const input = bulk.find((endpoint) => endpoint.direction === 'in'),
              output = bulk.find((endpoint) => endpoint.direction === 'out');
            if (input && output) match = { config, iface, alt, input, output };
          }
      if (!match) throw Error('No fastboot bulk interface on this device');
      if (
        device.configuration?.configurationValue !==
        match.config.configurationValue
      )
        await device.selectConfiguration(match.config.configurationValue);
      await device.claimInterface(match.iface.interfaceNumber);
      if (
        match.alt.alternateSetting !==
        device.configuration.interfaces.find(
          (item) => item.interfaceNumber === match.iface.interfaceNumber,
        ).alternate.alternateSetting
      )
        await device.selectAlternateInterface(
          match.iface.interfaceNumber,
          match.alt.alternateSetting,
        );
      this.signal.throwIfAborted();
      this.device = device;
      this.lastDevice = device;
      this.input = match.input.endpointNumber;
      this.output = match.output.endpointNumber;
      this.usb2Bulk =
        [8, 16, 32, 64, 512].includes(match.output.packetSize) &&
        [8, 16, 32, 64, 512].includes(match.input.packetSize);
      this.limit = null;
      this.status(
        `${device.productName || 'Fastboot'} · ${device.vendorId.toString(16)}:${device.productId.toString(16)}${device.serialNumber ? ` · ${device.serialNumber}` : ''}`,
      );
      this.trace(
        `USB bulk: IN ${this.input} (${match.input.packetSize ?? '?'} B), OUT ${this.output} (${match.output.packetSize ?? '?'} B)`,
      );
    } catch (error) {
      await device.close().catch(() => {});
      throw error;
    }
  }
  async ready() {
    if (this.device?.opened) return;
    this.acceptSelection = true;
    this.status('Reconnect the same board in fastboot mode');
    this.log(
      'Waiting for the same board. If USB re-enumerated, use “Connect board” to authorize its next stage.',
    );
    const deadline = Date.now() + 120000;
    let lastError;
    while (!this.device?.opened) {
      this.signal.throwIfAborted();
      if (Date.now() > deadline) throw Error('Timed out waiting for the board');
      if (
        !this.selecting &&
        this.lastDevice &&
        (await navigator.usb.getDevices()).includes(this.lastDevice)
      ) {
        this.selecting = true;
        try {
          await this.open(this.lastDevice);
        } catch (error) {
          if (error.message !== lastError)
            this.trace(`USB reconnect: ${error.message}`);
          lastError = error.message;
        } finally {
          this.selecting = false;
        }
      }
      if (!this.device?.opened)
        await new Promise((resolve) => setTimeout(resolve, 400));
    }
    this.acceptSelection = false;
    this.changed();
  }
  async send(bytes) {
    this.signal.throwIfAborted();
    const result = await this.device.transferOut(this.output, bytes);
    if (result.status !== 'ok' || result.bytesWritten !== bytes.byteLength)
      throw Error('Incomplete USB write');
  }
  async response() {
    for (;;) {
      this.signal.throwIfAborted();
      const result = await this.device.transferIn(this.input, 64);
      if (result.status !== 'ok' || !result.data || result.data.byteLength < 4)
        throw Error('Invalid fastboot reply');
      const packet = decoder.decode(result.data),
        type = packet.slice(0, 4),
        value = packet.slice(4).replace(/\0+$/, '');
      this.trace(`← ${type}${value ? ` ${value}` : ''}`);
      if (type === 'INFO' || type === 'TEXT') {
        this.log(value);
        continue;
      }
      if (type === 'FAIL') throw new RemoteFailure(value);
      if (type !== 'OKAY' && type !== 'DATA')
        throw Error(`Unexpected fastboot response ${type}`);
      return { type, value };
    }
  }
  async command(text, expected = 'OKAY') {
    const bytes = encoder.encode(text);
    if (bytes.length > 64) throw Error('Fastboot command exceeds 64 bytes');
    this.trace(`→ ${text}`);
    await this.send(bytes);
    const reply = await this.response();
    if (reply.type !== expected)
      throw Error(`Expected ${expected}, received ${reply.type}`);
    return reply.value;
  }
  async download(file) {
    if (!file.size || file.size > 0xffffffff)
      throw Error('Invalid fastboot download length');
    const size = file.size.toString(16).padStart(8, '0');
    const accepted = await this.command(`download:${size}`, 'DATA');
    if (!/^[\da-f]{8}$/i.test(accepted) || parseInt(accepted, 16) !== file.size)
      throw Error('Device accepted a different download size');
    for (let offset = 0; offset < file.size; offset += 1048576)
      await this.send(await file.slice(offset, offset + 1048576).arrayBuffer());
    if ((await this.response()).type !== 'OKAY')
      throw Error('Device did not accept the download');
  }
  async execute(argv, files, compress) {
    const [program, action, ...args] = argv;
    if (program !== 'fastboot')
      throw Error(`Unsupported device command: ${program}`);
    this.trace(argv.join(' '));
    let chunk = 0;
    try {
      await this.ready();
      this.acceptSelection = false;
      this.changed();
      if (action === 'getvar' && args.length === 1 && /^[\w.-]+$/.test(args[0]))
        return {
          status: 0,
          output: `${args[0]}: ${await this.command(`getvar:${args[0]}`)}\n`,
        };
      if (['continue', 'reboot'].includes(action) && !args.length) {
        await this.command(action);
        const previous = this.device;
        this.device = null;
        this.limit = null;
        await previous?.close().catch(() => {});
        this.status('Waiting for next boot stage');
      } else if (
        action === 'oem' &&
        args.length === 1 &&
        args[0] === 'speed:super-speed'
      )
        await this.command('oem speed:super-speed');
      else if (action === 'stage' && args.length === 1 && files.has(args[0]))
        await this.download(files.get(args[0]));
      else if (
        action === 'flash' &&
        args.length === 2 &&
        /^[\w.-]+$/.test(args[0]) &&
        files.has(args[1])
      ) {
        if (!this.limit) {
          let value;
          try {
            value = await this.command('getvar:max-download-size');
          } catch (error) {
            if (!(error instanceof RemoteFailure)) throw error;
          }
          const limit =
            value && /^(?:0x[\da-f]+|\d+)$/i.test(value) ? Number(value) : 0;
          this.limit =
            limit > 0 ? Math.min(limit, 0xffffffff) : 16 * 1024 * 1024;
          this.reportedLimit = limit > 0;
          this.trace(
            `max-download-size=${this.limit} B (${this.reportedLimit ? 'device' : 'fallback'})`,
          );
        }
        const file = files.get(args[1]);
        const skipReason = await gzipSkipReason(this, file, compress);
        this.trace(
          `${args[0]}: image=${args[1]} (${file.size} B), gzip=${skipReason ? `off (${skipReason})` : 'on'}`,
        );
        const payloads = skipReason
          ? flashPayloads(file, this.limit)
          : gzipPayloads(file, this.limit, compress);
        let completed = 0;
        for await (const payload of payloads) {
          chunk = completed + 1;
          this.trace(`${args[0]}: chunk ${chunk}, payload=${payload.size} B`);
          await this.download(payload);
          await this.command(`flash:${args[0]}`);
          completed = chunk;
          chunk = 0;
        }
      } else
        throw Error(
          `Unsupported fastboot operation or missing image: ${argv.join(' ')}`,
        );
      return { status: 0, output: '' };
    } catch (error) {
      this.trace(
        `ERROR ${argv.join(' ')}${chunk ? ` (chunk ${chunk})` : ''}: ${error.message}`,
      );
      if (!(error instanceof RemoteFailure)) throw error;
      const output = `FAILED (remote: '${error.message}')`;
      this.log(output);
      return { status: 1, output };
    }
  }
  async dispose() {
    navigator.usb?.removeEventListener('disconnect', this.disconnect);
    await this.device?.close().catch(() => {});
    this.device = null;
  }
}
