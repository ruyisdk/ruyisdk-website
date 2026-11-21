export class ProvisionRuntime {
  constructor(base, log, signal, trace = () => {}) {
    this.base = new URL(base, location.origin).href;
    this.api = `${this.base}data/api/api_packages_index/`;
    this.worker = new Worker(`${this.base}device-worker.js`);
    this.sequence = 0;
    this.pending = new Map();
    this.worker.onmessage = async ({ data }) => {
      const task = this.pending.get(data.id);
      if (this.closedReason || !task || task.completion) return;
      if (data.log !== undefined) {
        trace(`Starlark [${data.level}]: ${data.log}`);
        if (data.level !== 'D') log(data.log);
        return;
      }
      if (data.request !== undefined) {
        task.activeCommands++;
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
          task.activeCommands--;
          this.settle(data.id, task);
        }
        return;
      }
      task.completion = data;
      this.settle(data.id, task);
    };
    this.worker.onerror = (event) => this.dispose(event.message);
    const onAbort = () => this.dispose();
    signal.addEventListener('abort', onAbort);
    this.unbind = () => signal.removeEventListener('abort', onAbort);
    if (signal.aborted) this.dispose();
  }
  settle(id, task) {
    if (task.activeCommands || (!this.closedReason && !task.completion)) return;
    this.pending.delete(id);
    const error = this.closedReason || task.completion.error;
    if (error) task.reject(Error(error));
    else task.resolve(task.completion.result);
  }
  run(job, command) {
    if (this.closedReason) return Promise.reject(Error(this.closedReason));
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, command, activeCommands: 0 });
      this.worker.postMessage({
        id,
        api: this.api,
        runtimeURL: `${this.base}device-runtime/`,
        job,
      });
    });
  }
  warmup() {
    return this.run({ kind: 'warmup' });
  }
  dispose(reason = 'Session closed') {
    if (this.closedReason) return;
    this.closedReason = reason || 'Session closed';
    this.unbind();
    this.worker.terminate();
    for (const [id, task] of this.pending) this.settle(id, task);
  }
}
