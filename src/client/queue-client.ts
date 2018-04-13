import * as d from '../declarations';


export function createQueueClient(App: d.AppGlobal, win: Window, highPriorityPending?: boolean, rafPending?: boolean) {
  const now: d.Now = () => win.performance.now();

  const resolved = Promise.resolve();
  const highPriority: Function[] = [];
  const domReads: d.RafCallback[] = [];
  const domWrites: d.RafCallback[] = [];

  if (!App.raf) {
    App.raf = win.requestAnimationFrame.bind(win);
  }

  function doHighPriority(cb?: Function) {
    // holy geez we need to get this stuff done and fast
    // all high priority callbacks should be fired off immediately
    while (cb = highPriority.shift()) {
      cb();
    }
    highPriorityPending = false;
  }


  function doWork(start?: number) {
    start = now();

    // always run all of the high priority work if there is any
    doHighPriority();

    // DOM READS!!!
    while (domReads.length > 0) {
      domReads.shift()(start);
    }

    // -------------------------------

    // DOM WRITES!!!
    while (domWrites.length > 0 && (now() - start < 40)) {
      domWrites.shift()(start);
    }

    // check to see if we still have work to do
    if (rafPending = (domReads.length > 0 || domWrites.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      App.raf(flush);
    }
  }

  function flush(start?: number) {
    // always run all of the high priority work if there is any
    doHighPriority();

    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    // DOM READS!!!
    while (domReads.length > 0) {
      domReads.shift()(start);
    }

    // -------------------------------

    start = 4 + now();
    // DOM WRITES!!!
    while (domWrites.length > 0 && (now() < start)) {
      domWrites.shift()();
    }

    if (rafPending = (domReads.length > 0 || domWrites.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      App.raf(doWork);
    }
  }

  return {

    tick: (cb: Function) => {
      // queue high priority work to happen in next tick
      // uses Promise.resolve() for next tick
      highPriority.push(cb);

      if (!highPriorityPending) {
        highPriorityPending = true;
        resolved.then(doHighPriority as any);
      }
    },

    read: (cb: d.RafCallback) => {
      // queue dom reads
      domReads.push(cb);

      if (!rafPending) {
        rafPending = true;
        App.raf(doWork);
      }
    },

    write: (cb: d.RafCallback) => {
      // queue dom writes
      domWrites.push(cb);

      if (!rafPending) {
        rafPending = true;
        App.raf(doWork);
      }
    }

  } as d.QueueApi;
}
