import { FlasherError } from "./errors.mjs";
import { inspectImage, imagePayloads } from "./sparse.mjs";

/** Represents an explicit failure returned by the bootloader. */
class FastbootError extends Error {
  /** Stores the bootloader status and message. */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Identifies the standard fastboot USB interface. */
export const USB_FILTER = {
  classCode: 0xff,
  subclassCode: 0x42,
  protocolCode: 0x03,
};

/** Executes fastboot commands on one explicitly selected USB device. */
export class FlashClient {
  /** Creates a client that reports device messages through log. */
  constructor(log = () => {}) {
    this.device = null;
    this.epIn = null;
    this.epOut = null;
    this.log = log;
    this.interfaceNumber = null;
    this.responseTimeout = 120000;
  }

  /** Claims the fastboot interface of the device explicitly chosen by the user. */
  async open(device) {
    await this.close();
    this.device = device;
    try {
      await device.open();
      let selected;
      for (const config of device.configurations) {
        for (const iface of config.interfaces) {
          for (const alt of iface.alternates) {
            if (
              alt.interfaceClass === 0xff &&
              alt.interfaceSubclass === 0x42 &&
              alt.interfaceProtocol === 3
            ) {
              const input = alt.endpoints.find(
                (endpoint) =>
                  endpoint.type === "bulk" && endpoint.direction === "in",
              );
              const output = alt.endpoints.find(
                (endpoint) =>
                  endpoint.type === "bulk" && endpoint.direction === "out",
              );
              if (input && output)
                selected ||= { config, iface, alt, input, output };
            }
          }
        }
      }
      if (!selected)
        throw new FlasherError(
          "error.noInterface",
          "The selected device does not expose a fastboot interface",
          {},
        );
      if (
        device.configuration?.configurationValue !==
        selected.config.configurationValue
      )
        await device.selectConfiguration(selected.config.configurationValue);
      await device.claimInterface(selected.iface.interfaceNumber);
      await device.selectAlternateInterface(
        selected.iface.interfaceNumber,
        selected.alt.alternateSetting,
      );
      this.interfaceNumber = selected.iface.interfaceNumber;
      this.epIn = selected.input.endpointNumber;
      this.epOut = selected.output.endpointNumber;
    } catch (error) {
      await this.close();
      throw error;
    }
  }

  /** Reports whether this client's selected USB interface remains open. */
  get isConnected() {
    return Boolean(this.device?.opened && this.interfaceNumber !== null);
  }

  /** Closes the current device; a timed-out session must be reopened before reuse. */
  async close() {
    const device = this.device;
    this.device = null;
    this.interfaceNumber = null;
    if (device?.opened) await device.close().catch(() => {});
  }

  /** Bounds USB waits and invalidates the session if a transfer times out. */
  async transfer(operation, timeout = 30000) {
    let timer;
    try {
      return await Promise.race([
        operation,
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            void this.close();
            reject(
              new FlasherError(
                "error.usbTimeout",
                "USB operation timed out. Reconnect the device before continuing.",
                {},
              ),
            );
          }, timeout);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  /** Reads fastboot responses, retaining only the final response and forwarding INFO messages. */
  async _readResponse() {
    for (let messages = 0; messages < 10000; messages++) {
      if (!this.isConnected)
        throw new FlasherError("error.disconnected", "Device disconnected", {});
      const packet = await this.transfer(
        this.device.transferIn(this.epIn, 64),
        this.responseTimeout,
      );
      if (packet.status !== "ok" || !packet.data || packet.data.byteLength < 4)
        throw new FlasherError("error.usbResponse", "Invalid USB response", {});
      const text = new TextDecoder().decode(packet.data);
      const status = text.slice(0, 4);
      const message = text.slice(4).replace(/\0+$/, "");
      this.log("< " + status + (message ? " " + message : ""));
      if (status === "INFO" || status === "TEXT") {
        continue;
      }
      if (status === "FAIL") throw new FastbootError(status, message);
      if (status === "OKAY") return { text: message };
      if (status === "DATA" && /^[0-9a-f]{8}$/i.test(message))
        return { text: "", dataSize: message };
      throw new FlasherError(
        "error.fastbootResponse",
        "Unexpected fastboot response: {status}",
        { status: status },
      );
    }
    throw new FlasherError(
      "error.tooManyResponses",
      "Too many fastboot status messages",
      {},
    );
  }

  /** Sends one ASCII command and waits for its terminal response. */
  async runCommand(command) {
    if (!this.isConnected)
      throw new FlasherError("error.disconnected", "Device disconnected", {});
    if (!/^[\x20-\x7e]{1,64}$/.test(command))
      throw new FlasherError("error.command", "Invalid fastboot command", {});
    const bytes = new TextEncoder().encode(command);
    this.log("> " + command);
    const result = await this.transfer(
      this.device.transferOut(this.epOut, bytes),
    );
    if (result.status !== "ok" || result.bytesWritten !== bytes.length)
      throw new FlasherError(
        "error.commandTransfer",
        "Incomplete USB command transfer",
        {},
      );
    let response;
    try {
      response = await this._readResponse();
    } catch (error) {
      if (error instanceof FastbootError) error.command = command;
      throw error;
    }
    if (response.dataSize !== undefined && !command.startsWith("download:"))
      throw new FlasherError(
        "error.unexpectedData",
        "Unexpected DATA response to {command}",
        { command: command },
      );
    return response;
  }

  /** Reads a variable, allowing only recognized unsupported-variable failures to use a fallback. */
  async getVariable(name) {
    try {
      const value = (await this.runCommand("getvar:" + name)).text.trim();
      return value || null;
    } catch (error) {
      if (
        error instanceof FastbootError &&
        /^(?:unknown (?:variable|command)|(?:variable|command)(?: .+)? (?:not (?:found|implemented|supported)|is not supported)|(?:getvar:?)?\s*(?:not supported|not implemented|not support)|unsupported (?:variable|command))/i.test(
          error.message,
        )
      )
        return null;
      throw error;
    }
  }

  /** Caps each download to 64 MiB; unsupported limits use a conservative 16 MiB. */
  async _getDownloadSize() {
    const value = await this.getVariable("max-download-size");
    if (!value) return 16 * 1024 * 1024;
    if (!/^(0x)?[0-9a-f]+$/i.test(value))
      throw new FlasherError(
        "error.downloadLimit",
        "Invalid max-download-size",
        {},
      );
    const size = parseInt(value, 16);
    if (!Number.isSafeInteger(size) || size < 4096)
      throw new FlasherError(
        "error.downloadLimit",
        "Invalid max-download-size",
        {},
      );
    return Math.min(size, 64 * 1024 * 1024);
  }

  /** Sends a bounded payload, rejecting stalls and short writes. */
  async _sendRawPayload(buffer, onProgress) {
    for (let offset = 0; offset < buffer.byteLength; offset += 65536) {
      if (!this.isConnected)
        throw new FlasherError("error.disconnected", "Device disconnected", {});
      const bytes = new Uint8Array(
        buffer,
        offset,
        Math.min(65536, buffer.byteLength - offset),
      );
      const result = await this.transfer(
        this.device.transferOut(this.epOut, bytes),
      );
      if (result.status !== "ok" || result.bytesWritten !== bytes.byteLength)
        throw new FlasherError(
          "error.imageTransfer",
          "Incomplete USB image transfer",
          {},
        );
      onProgress((offset + bytes.byteLength) / buffer.byteLength);
    }
  }

  /** Downloads one bounded payload and verifies both protocol acknowledgements. */
  async upload(buffer, onProgress = () => {}) {
    const size = buffer.byteLength;
    if (!size || size > 0xffffffff)
      throw new FlasherError(
        "error.downloadLength",
        "Invalid fastboot download size",
        {},
      );
    const response = await this.runCommand(
      "download:" + size.toString(16).padStart(8, "0"),
    );
    if (parseInt(response.dataSize, 16) !== size)
      throw new FlasherError(
        "error.acceptedLength",
        "Device accepted an unexpected download size",
        {},
      );
    await this._sendRawPayload(buffer, onProgress);
    let result;
    try {
      result = await this._readResponse();
    } catch (error) {
      if (error instanceof FastbootError) error.command = "download (payload)";
      throw error;
    }
    if (result.dataSize !== undefined)
      throw new FlasherError(
        "error.dataAfterTransfer",
        "Unexpected DATA after image transfer",
        {},
      );
  }

  /** Flashes bounded payloads sequentially and advances only after the device acknowledges each write. */
  async flashBlob(partition, file, onProgress = () => {}) {
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(partition))
      throw new FlasherError(
        "error.partitionName",
        "Invalid partition name",
        {},
      );
    const info = await inspectImage(file);
    const limit = await this._getDownloadSize();
    if (partition === "ram" && file.size > limit)
      throw new FlasherError(
        "error.ramLimit",
        "RAM image exceeds the device download limit",
        {},
      );
    let completed = 0;
    for await (const payload of imagePayloads(file, limit, info)) {
      await this.upload(await payload.blob.arrayBuffer(), (progress) =>
        onProgress(
          (completed + progress * (payload.completed - completed)) /
            payload.total,
        ),
      );
      await this.runCommand("flash:" + partition);
      completed = payload.completed;
    }
    onProgress(1);
  }

  /** Downloads a small boot-stage payload without flashing a partition. */
  async stage(file, onProgress) {
    const limit = await this._getDownloadSize();
    if (!file.size || file.size > limit)
      throw new FlasherError(
        "error.stageLimit",
        "Boot-stage image exceeds the device download limit",
        {},
      );
    await this.upload(await file.arrayBuffer(), onProgress);
  }
}
