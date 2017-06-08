import { QueueApi } from '../../util/interfaces';
import { PRIORITY_HIGH, PRIORITY_LOW } from '../../util/constants';


export function createQueueClient(win: any): QueueApi {
  const requestAnimationFrame = win.requestAnimationFrame;
  const highPromise = Promise.resolve();

  const highCallbacks: Function[] = [];
  const mediumCallbacks: Function[] = [];
  const lowCallbacks: Function[] = [];

  let resolvePending = false;
  let ricPending = false;


  function doHighPriority() {
    // holy geez we need to get this stuff done and fast
    // all high priority callbacks should be fired off immediately
    while (highCallbacks.length > 0) {
      highCallbacks.shift()();
    }
    resolvePending = false;
  }


  function doWork() {
    const start = performance.now();

    // always run all of the high priority work if there is any
    doHighPriority();

    while (mediumCallbacks.length > 0 && (performance.now() - start < 40)) {
      mediumCallbacks.shift()();
    }

    if (mediumCallbacks.length === 0) {
      // we successfully drained the medium queue or the medium queue is empty
      // so now let's drain the low queue with our remaining time
      while (lowCallbacks.length > 0 && (performance.now() - start < 40)) {
        lowCallbacks.shift()();
      }
    }

    // check to see if we still have work to do
    if (ricPending = (mediumCallbacks.length > 0 || lowCallbacks.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      requestAnimationFrame(flush);
    }
  }

  function flush() {
    // always run all of the high priority work if there is any
    doHighPriority();

    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    const start = performance.now();
    while (mediumCallbacks.length > 0 && (performance.now() - start < 4)) {
      mediumCallbacks.shift()();
    }

    if (ricPending = (mediumCallbacks.length > 0 || lowCallbacks.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next ric
      requestAnimationFrame(doWork);
    }
  }

  function add(cb: Function, priority?: number) {
    if (priority === PRIORITY_HIGH) {
      // uses Promise.resolve() for next tick
      highCallbacks.push(cb);

      if (!resolvePending) {
        // not already pending work to do, so let's tee it up
        resolvePending = true;
        highPromise.then(doHighPriority);
      }

    } else {
      if (priority === PRIORITY_LOW) {
        lowCallbacks.push(cb);

      } else {
        // defaults to medium priority
        // uses requestIdleCallback
        mediumCallbacks.push(cb);
      }

      if (!ricPending) {
        // not already pending work to do, so let's tee it up
        ricPending = true;
        requestAnimationFrame(doWork);
      }
    }
  }

  return {
    add: add,
    flush: flush
  };
}
