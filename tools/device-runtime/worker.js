let runtime;
const responses = new Map();
const snapshots = new Map();
let sequence = 0;

async function initialize(runtimeURL) {
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
    const snapshot =
      job.kind === 'preview' ? new Map() : snapshots.get(job.snapshot);
    if (job.kind === 'flash' && !snapshot)
      throw Error('Missing reviewed plugin snapshot');
    const resource = async (url) => {
      if (snapshot?.has(url)) return snapshot.get(url);
      if (job.kind !== 'preview')
        throw Error(`Plugin resource was not reviewed: ${url}`);
      const contents = await text(url);
      snapshot.set(url, contents);
      return contents;
    };
    const modulePath = (name) => {
      if (!Object.hasOwn(job.modules, name))
        throw Error(`Plugin unavailable: ${name}`);
      return parts(job.modules[name]);
    };
    const host = {
      progress: (percent) => {
        if (data.reportProgress) self.postMessage({ id, percent });
      },
      source: async (name) =>
        resource(`${api}plugins/${modulePath(name).join('/')}`),
      asset: async (name, path) =>
        resource(
          `${api}plugins/${modulePath(name).slice(0, -1).join('/')}/data/${parts(path).join('/')}`,
        ),
      log: (level, message) => {
        self.postMessage({ id, level, log: message });
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
    if (job.kind === 'preview') {
      snapshots.set(id, snapshot);
      result.snapshot = id;
    }
    self.postMessage(
      { id, result },
      result instanceof Uint8Array ? [result.buffer] : [],
    );
  } catch (error) {
    if (writer) await writer.abort().catch(() => {});
    self.postMessage({ id, error: String(error) });
  }
};
