import * as d from '../declarations';


export function createQueueClient(App: d.AppGlobal, win: Window): d.QueueApi {
  const now: d.Now = () => win.performance.now();

  const resolved = Promise.resolve();
  const highPriority: d.RafCallback[] = [];
  const domReads: d.RafCallback[] = [];
  const domWrites: d.RafCallback[] = [];
  const domWritesLow: d.RafCallback[] = [];
  let congestion = 0;
  let rafPending = false;

  if (!App.raf) {
    App.raf = win.requestAnimationFrame.bind(win);
  }

  function queueTask(queue: d.RafCallback[]) {
    return (cb: d.RafCallback) => {
      // queue dom reads
      queue.push(cb);
       if (!rafPending) {
        rafPending = true;
        App.raf(flush);
      }
    };
  }

  function consumeAll(queue: d.RafCallback[]) {
    for (let i = 0; i < queue.length; i++) {
      try {
        queue[i](now());
      } catch (e) {
        console.error(e);
      }
    }
  }

  function consumeUntilTimeout(queue: d.RafCallback[], timeout: number) {
    let i = 0;
    let ts = 0;
    while (i < queue.length && (ts = now()) < timeout) {
      try {
        queue[i++](ts);
      } catch (e) {
        console.error(e);
      }
    }
    if (i === queue.length) {
      queue.length = 0;
    } else if (i !== 0) {
      queue.splice(0, i);
    }
  }

  function flush() {
    congestion++;

    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time

    // Copy tasks to digest
    const reads = domReads.slice();
    const writes = domWrites.slice();
    domWrites.length = 0;
    domReads.length = 0;

    // DOM READS!!!
    // All reads must be done before starting with writes
    consumeAll(reads);

    const start = now() + (7 * Math.ceil(congestion * (1.0 / 22.0)));

    // DOM WRITES!!!
    consumeUntilTimeout(writes, start);
    consumeUntilTimeout(domWritesLow, start);

    // Write tasks that could not be finish on time are moved to the low priority queue
    domWritesLow.push(...writes);

    if (rafPending = ((domReads.length + domWrites.length + domWritesLow.length) > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next tick
      App.raf(flush);
    } else {
      congestion = 0;
    }
  }

  return {

    tick(cb: d.RafCallback) {
      // queue high priority work to happen in next tick
      // uses Promise.resolve() for next tick
      highPriority.push(cb);

      if (highPriority.length === 1) {
        resolved.then(() => consumeAll(highPriority));
      }
    },

    read: queueTask(domReads),
    write: queueTask(domWrites)
  };
}
