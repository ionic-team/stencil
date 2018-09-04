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

  function consume(queue: d.RafCallback[]) {
    for (let i = 0; i < queue.length; i++) {
      try {
        queue[i](now());
      } catch (e) {
        console.error(e);
      }
    }
    queue.length = 0;
  }

  function consumeTimeout(queue: d.RafCallback[], timeout: number) {
    let i = 0;
    let ts: number;
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

    // DOM READS!!!
    consume(domReads);

    const start = now() + (7 * Math.ceil(congestion * (1.0 / 22.0)));

    // DOM WRITES!!!
    consumeTimeout(domWrites, start);
    consumeTimeout(domWritesLow, start);

    if (domWrites.length > 0) {
      domWritesLow.push(...domWrites);
      domWrites.length = 0;
    }

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
        resolved.then(() => consume(highPriority));
      }
    },

    read: queueTask(domReads),
    write: queueTask(domWrites),

  };
}
