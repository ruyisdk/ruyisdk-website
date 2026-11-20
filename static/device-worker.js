let runtime;
const responses = new Map();
let sequence = 0;

async function initialize(runtimeURL) {
  importScripts(`${runtimeURL}wasm_exec.js`);
  const go = new Go();
  const response = await fetch(`${runtimeURL}device.wasm`);
  if (!response.ok) throw new Error(`Runtime download: ${response.status}`);
  const { instance } = await WebAssembly.instantiate(
    await response.arrayBuffer(),
    go.importObject,
  );
  go.run(instance);
}

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

function parts(name) {
  const result = name.split('/');
  if (
    result.some(
      (part) =>
        !part ||
        part === '.' ||
        part === '..' ||
        /[\\:%?#\x00-\x1f]/.test(part),
    )
  )
    throw new Error(`Invalid path: ${name}`);
  return result;
}

self.onmessage = async ({ data }) => {
  if (data.reply !== undefined) {
    const pending = responses.get(data.reply);
    if (pending) {
      responses.delete(data.reply);
      data.error
        ? pending.reject(Error(data.error))
        : pending.resolve(data.result);
    }
    return;
  }
  const { id, runtimeURL, api, job } = data;
  let writer;
  try {
    await (runtime ??= initialize(runtimeURL));
    const modulePath = (name) => {
      if (!Object.hasOwn(job.modules, name))
        throw Error(`Plugin unavailable: ${name}`);
      return parts(job.modules[name]);
    };
    const host = {
      source: async (name) =>
        text(`${api}plugins/${modulePath(name).join('/')}`),
      asset: async (name, path) =>
        text(
          `${api}plugins/${modulePath(name).slice(0, -1).join('/')}/data/${parts(path).join('/')}`,
        ),
      log: (level, message) => {
        if (level !== 'D') self.postMessage({ id, log: message });
      },
      command: (argv) =>
        new Promise((resolve, reject) => {
          const request = ++sequence;
          responses.set(request, { resolve, reject });
          self.postMessage({ id, request, argv });
        }),
      open: async (name) => {
        if (!job.wanted.includes(name)) throw Error(`Undeclared image ${name}`);
        let dir = job.dir;
        const segments = parts(name),
          filename = segments.pop();
        for (const segment of segments)
          dir = await dir.getDirectoryHandle(segment, { create: true });
        writer = await (
          await dir.getFileHandle(filename, { create: true })
        ).createWritable();
      },
      write: async (bytes) => writer.write(bytes),
      close: async () => {
        await writer.close();
        writer = undefined;
      },
    };
    const result = await runProvisionTask(job, host);
    self.postMessage(
      { id, result },
      result instanceof Uint8Array ? [result.buffer] : [],
    );
  } catch (error) {
    if (writer) await writer.abort().catch(() => {});
    self.postMessage({ id, error: String(error) });
  }
};
