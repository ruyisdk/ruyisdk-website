export class ProvisionRuntime {
  constructor(base, log, trace = () => {}) {
    this.base = new URL(base, location.origin).href;
    this.api = `${this.base}data/api/api_packages_index/`;
    this.worker = new Worker(`${this.base}device-worker.js`);
    this.sequence = 0;
    this.pending = new Map();
    this.worker.onmessage = async ({ data }) => {
      const task = this.pending.get(data.id);
      if (!task) return;
      if (data.log !== undefined) {
        trace(`Starlark [${data.level}]: ${data.log}`);
        if (data.level !== 'D') log(data.log);
        return;
      }
      if (data.request !== undefined) {
        try {
          this.worker.postMessage({
            reply: data.request,
            result: await task.command(data.argv),
          });
        } catch (error) {
          this.worker.postMessage({
            reply: data.request,
            error: String(error),
          });
        }
        return;
      }
      this.pending.delete(data.id);
      data.error ? task.reject(Error(data.error)) : task.resolve(data.result);
    };
    this.worker.onerror = (event) => this.dispose(event.message);
  }
  run(job, command) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, command });
      this.worker.postMessage({
        id,
        api: this.api,
        runtimeURL: `${this.base}device-runtime/`,
        job,
      });
    });
  }
  dispose(reason = 'Session closed') {
    this.worker.terminate();
    for (const task of this.pending.values()) task.reject(Error(reason));
    this.pending.clear();
  }
}
