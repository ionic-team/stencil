import { QueueApi, RequestIdleCallback, IdleDeadline } from '../util/interfaces';


export function QueueClient(window: any): QueueApi {
  const hostScheduleDefer: RequestIdleCallback = window.requestIdleCallback;
  const callbacks: Function[] = [];
  let pending = false;


  function doWork(deadlineObj: IdleDeadline) {
    console.log(`queue, doWork, timeRemaining: ${deadlineObj.timeRemaining()}, callbacks: ${callbacks.length}`);

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
      requestAnimationFrame(rafChillout);
    }
  }

  function rafChillout() {
    console.log(`queue, rafChillout, callbacks: ${callbacks.length}`);

    const start = Date.now();
    while (callbacks.length > 0 && (Date.now() - start < 4)) {
      callbacks.shift()();
    }
    hostScheduleDefer(doWork);
  }

  function flush() {
    console.log(`queue, flush, callbacks: ${callbacks.length}`);

    const start = Date.now();
    while (callbacks.length > 0 && (Date.now() - start < 9)) {
      callbacks.shift()();
    }

    if (callbacks.length > 0) {
      pending = true;
      requestAnimationFrame(rafChillout);

    } else {
      pending = false;
    }
  }

  function add(cb: Function) {
    callbacks.push(cb);
    if (!pending) {
      pending = true;
      hostScheduleDefer(doWork);
    }
  }

  return {
    add: add,
    flush: flush
  };
}
