import { DomController, Now, QueueApi } from '../util/interfaces';
import { PRIORITY } from '../util/constants';


export function createQueueClient(domCtrl: DomController, now: Now, resolvePending?: boolean, rafPending?: boolean): QueueApi {
  const raf = domCtrl.raf;
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
      raf(flush);
    }
  }

  function flush(start?: number) {
    // always run all of the high priority work if there is any
    doHighPriority();

    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    start = now();
    while (lowPriority.length > 0 && (now() - start < 4)) {
      lowPriority.shift()();
    }

    if (rafPending = (lowPriority.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      raf(doWork);
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
          raf(doWork);
        }
      }
    }
  };
}
