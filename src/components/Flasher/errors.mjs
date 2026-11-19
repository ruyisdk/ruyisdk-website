/** Carries a stable message ID and parameters without depending on the UI locale. */
export class FlasherError extends Error {
  /** Retains an English diagnostic message for logs and protocol-layer tests. */
  constructor(code, message, values = {}) {
    super(
      message.replace(/\{(\w+)\}/g, (token, key) =>
        Object.hasOwn(values, key) ? String(values[key]) : token,
      ),
    );
    this.name = "FlasherError";
    this.code = code;
    this.values = values;
  }

  /** Restores worker metadata without interpolating the diagnostic a second time. */
  static from(data) {
    const error = new FlasherError(data.code, data.message);
    error.values = data.values || {};
    return error;
  }
}

/** Serializes message metadata across the worker boundary, preserving external details. */
export function serializeError(error) {
  return {
    code: typeof error?.code === "string" ? error.code : undefined,
    values: error?.values || {},
    message: error?.message || String(error),
  };
}
