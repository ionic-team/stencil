import { QueueApi, IdleDeadline } from '../../util/interfaces';
import { PRIORITY_HIGH, PRIORITY_LOW } from '../../util/constants';


export function createQueueClient(win: any): QueueApi {
  const highPromise = Promise.resolve();

  const highCallbacks: Function[] = [];
  const mediumCallbacks: Function[] = [];
  const lowCallbacks: Function[] = [];

  let resolvePending = false;
  let ricPending = false;


  function doHighPriority() {
    // holy geez we need to get this stuff done and fast
    // all high priority callbacks should be fired off immediately
    var l = highCallbacks.length;
    if (l > 0) {
      for (var i = 0; i < l; i++) {
        highCallbacks[i]();
      }
      highCallbacks.length = 0;
    }
  }


  function doRequestIdleCallbackWork(deadline: IdleDeadline) {
    // always run all of the high priority work if there is any
    doHighPriority();

    if (drainRicQueue(mediumCallbacks, deadline)) {
      // we successfully drained the medium queue or the medium queue is empty
      // so now let's drain the low queue with our remaining time
      drainRicQueue(lowCallbacks, deadline);
    }

    // check to see if we still have work to do
    if (ricPending = (mediumCallbacks.length > 0 || lowCallbacks.length > 0)) {
      // everyone just settle down now
      // we already don't have time to do anything in this callback
      // let's throw the next one in a requestAnimationFrame
      // so we can just simmer down for a bit
      win.requestAnimationFrame(flush);
    }
  }

  function drainRicQueue(callbacks: Function[], deadline: IdleDeadline) {
    // let's see if we've got time to take care of things
    var l = callbacks.length;
    if (l > 0) {
      // ok, so we've got some functions to run in this queue
      for (var i = 0; i < l; i++) {
        // do some work while within the allowed time
        if (deadline.timeRemaining() < 1) {
          // not enough time to exec all the callbacks
          // but do remove the callbacks that we did run though
          callbacks.splice(0, i);
          return false;
        }

        // we've got time, so let's kick off the callback
        callbacks[i]();
      }

      // cool, we did end up running all the medium callbacks
      // let's reset the array back to zero
      callbacks.length = 0;
    }

    // all good yo
    return true;
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
      win.requestIdleCallback(doRequestIdleCallbackWork);
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
        win.requestIdleCallback(doRequestIdleCallbackWork);
      }
    }
  }

  return {
    add: add,
    flush: flush
  };
}
