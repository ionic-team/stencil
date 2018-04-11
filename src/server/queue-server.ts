import * as d from '../declarations';


export function createQueueServer() {
  const highPriority: Function[] = [];
  const domReads: d.RafCallback[] = [];
  const domWrites: d.RafCallback[] = [];

  let queued = false;

  function flush(cb?: Function) {
    while (highPriority.length > 0) {
      highPriority.shift()();
    }

    while (domReads.length > 0) {
      domReads.shift()();
    }

    while (domWrites.length > 0) {
      domWrites.shift()();
    }

    queued = (highPriority.length > 0) || (domReads.length > 0) || (domWrites.length > 0);
    if (queued) {
      process.nextTick(flush);
    }

    cb && cb();
  }

  function clear() {
    highPriority.length = 0;
    domReads.length = 0;
    domWrites.length = 0;
  }

  return {

    tick: (cb: Function) => {
      // queue high priority work to happen in next tick
      // uses Promise.resolve() for next tick
      highPriority.push(cb);

      if (!queued) {
        queued = true;
        process.nextTick(flush);
      }
    },

    read: (cb: d.RafCallback) => {
      // queue dom reads
      domReads.push(cb);

      if (!queued) {
        queued = true;
        process.nextTick(flush);
      }
    },

    write: (cb: d.RafCallback) => {
      // queue dom writes
      domWrites.push(cb);

      if (!queued) {
        queued = true;
        process.nextTick(flush);
      }
    },

    flush: flush,

    clear: clear

  } as d.QueueApi;
}
