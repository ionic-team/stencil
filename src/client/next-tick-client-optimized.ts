import { NextTickApi, RequestIdleCallback, IdleDeadline } from '../util/interfaces';


export function NextTickClient(window: any): NextTickApi {
  const hostScheduleDeferredCallback: RequestIdleCallback = window.requestIdleCallback;
  const callbacks: Function[] = [];
  let pending = false;

  function doWork(deadlineObj: IdleDeadline) {
    while (deadlineObj.timeRemaining() > 0 && callbacks.length > 0) {
      callbacks.shift()();
    }

    if (pending = (callbacks.length > 0)) {
      hostScheduleDeferredCallback(doWork);
    }
  }

  function queueNextTick(cb: Function) {
    callbacks.push(cb);

    if (!pending) {
      pending = true;
      hostScheduleDeferredCallback(doWork);
    }
  }

  return {
    nextTick: queueNextTick
  };
}
