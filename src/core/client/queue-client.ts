import { QueueApi, RequestIdleCallback, IdleDeadline } from '../../util/interfaces';


export function QueueClient(window: any): QueueApi {
  const hostScheduleDefer: RequestIdleCallback = window.requestIdleCallback;
  const callbacks: Function[] = [];
  let pending = false;

  function doWork(deadlineObj: IdleDeadline) {
    // let's see if we've got time to take care of things
    while (deadlineObj.timeRemaining() > 1 && callbacks.length > 0) {
      // do some work while within the allowed time
      // shift the array and fire off the callbacks from the beginning
      // once we run out of time or callbacks we'll stop
      callbacks.shift()();
    }

    // check to see if we still have work to do
    if (pending = (callbacks.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      requestAnimationFrame(flush);
    }
  }

  function flush() {
    // always force a bunch of callbacks to run, but still have
    // a throttle on how many can run in a certain time
    const start = performance.now();
    while (callbacks.length > 0 && (performance.now() - start < 4)) {
      callbacks.shift()();
    }

    if (pending = (callbacks.length > 0)) {
      // still more to do yet, but we've run out of time
      // let's let thing cool off and try again after a raf
      hostScheduleDefer(doWork);
    }
  }

  function add(cb: Function) {
    // add the work to the end of the callbacks
    callbacks.push(cb);

    if (!pending) {
      // not already pending work to do, so let's tee it up
      pending = true;
      hostScheduleDefer(doWork);
    }
  }

  return {
    add: add,
    flush: flush
  };
}
