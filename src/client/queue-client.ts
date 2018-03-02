import { AppGlobal, Now, QueueApi } from '../declarations';
import { PRIORITY } from '../util/constants';


export function createQueueClient(App: AppGlobal, win: Window, resolvePending?: boolean, rafPending?: boolean): QueueApi {
  const now: Now = () => win.performance.now();

  const highPromise = Promise.resolve();
  const highPriority: Function[] = [];
  const lowPriority: Function[] = [];


  function doHighPriority() {
    // holy geez we need to get this stuff done and fast
    // all high priority callbacks should be fired off immediately
    while (highPriority.length > 0) {
      highPriority.shift()();
    }
    resolvePending = false;
  }


  function doWork(start?: number) {
    start = now();

    // always run all of the high priority work if there is any
    doHighPriority();

    while (lowPriority.length > 0 && (now() - start < 40)) {
      lowPriority.shift()();
    }

    // check to see if we still have work to do
    if (rafPending = (lowPriority.length > 0)) {
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
    start = 4 + now();
    while (lowPriority.length > 0 && (now() < start)) {
      lowPriority.shift()();
    }

    if (rafPending = (lowPriority.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      App.raf(doWork);
    }
  }

  return {
    add: (cb: Function, priority?: number) => {
      if (priority === PRIORITY.High) {
        // uses Promise.resolve() for next tick
        highPriority.push(cb);

        if (!resolvePending) {
          // not already pending work to do, so let's tee it up
          resolvePending = true;
          highPromise.then(doHighPriority);
        }

      } else {
        // defaults to low priority
        // uses requestAnimationFrame
        lowPriority.push(cb);

        if (!rafPending) {
          // not already pending work to do, so let's tee it up
          rafPending = true;
          App.raf(doWork);
        }
      }
    }
  };
}
