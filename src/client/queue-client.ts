import * as d from '../declarations';


export const createQueueClient = (App: d.AppGlobal, win: Window): d.QueueApi => {
  if (!_BUILD_.updatable) {
    const resolved = Promise.resolve();
    const now: d.Now = () => win.performance.now();
    function tick(cb: d.RafCallback) {
      resolved.then(() => cb(now()));
    }
    return {
      tick: tick,
      read: tick,
      write: tick,
    };

  } else {

    let congestion = 0;
    let rafPending = false;

    const now: d.Now = () => win.performance.now();
    const async = App.asyncQueue !== false;
    const resolved = Promise.resolve();
    const highPriority: d.RafCallback[] = [];
    const domReads: d.RafCallback[] = [];
    const domWrites: d.RafCallback[] = [];
    const domWritesLow: d.RafCallback[] = [];

    const queueTask = (queue: d.RafCallback[]) => (cb: d.RafCallback) => {
      // queue dom reads
      queue.push(cb);

      if (!rafPending) {
        rafPending = true;
        App.raf(flush);
      }
    };

    const consume = (queue: d.RafCallback[]) => {
      for (let i = 0; i < queue.length; i++) {
        try {
          queue[i](now());
        } catch (e) {
          console.error(e);
        }
      }
      queue.length = 0;
    };

    const consumeTimeout = (queue: d.RafCallback[], timeout: number) => {
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
    };

    const flush = () => {
      congestion++;

      // always force a bunch of medium callbacks to run, but still have
      // a throttle on how many can run in a certain time

      // DOM READS!!!
      consume(domReads);

      const timeout = async
        ? now() + (7 * Math.ceil(congestion * (1.0 / 22.0)))
        : Infinity;

      // DOM WRITES!!!
      consumeTimeout(domWrites, timeout);
      consumeTimeout(domWritesLow, timeout);

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
    };

    if (!App.raf) {
      App.raf = win.requestAnimationFrame.bind(win);
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
};
