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
        task.commandActive = true;
        try {
          const result = await task.command(data.argv);
          if (!this.closedReason)
            this.worker.postMessage({ reply: data.request, result });
        } catch (error) {
          if (!this.closedReason)
            this.worker.postMessage({
              reply: data.request,
              error: String(error),
            });
        } finally {
          task.commandActive = false;
          if (this.closedReason) task.reject(Error(this.closedReason));
        }
        return;
      }
      this.pending.delete(data.id);
      data.error ? task.reject(Error(data.error)) : task.resolve(data.result);
    };
    this.worker.onerror = (event) => this.dispose(event.message);
  }
  run(job, command) {
    if (this.closedReason) return Promise.reject(Error(this.closedReason));
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
    if (this.closedReason) return;
    this.closedReason = reason || 'Session closed';
    this.worker.terminate();
    for (const task of this.pending.values()) {
      if (!task.commandActive) task.reject(Error(this.closedReason));
    }
    this.pending.clear();
  }
}
