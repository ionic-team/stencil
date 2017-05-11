import { NextTickApi } from '../util/interfaces';


export function NextTickClient(window: any): NextTickApi {
  const hostScheduleDeferredCallback: RequestIdleCallback = window.requestIdleCallback;
  const callbacks: Function[] = [];
  let pending = false;
  let callBackHandle: number;

  function doWork(deadlineObj: IdleDeadline) {
    while (deadlineObj.timeRemaining() > 0 && callbacks.length > 0) {
      callbacks.shift()();
    }
    if (callbacks.length > 0) {
      pending = true;
      callBackHandle = hostScheduleDeferredCallback(doWork);
      return;
    }
    pending = false;
  }

  function queueNextTick(cb: Function) {
    callbacks.push(cb);

    if (!pending) {
      pending = true;
      callBackHandle = hostScheduleDeferredCallback(doWork);
    }
  }

  return {
    nextTick: queueNextTick
  };
}

interface RequestIdleCallback {
  (callback: IdleCallback): number;
}

interface IdleCallback {
  (deadline: IdleDeadline, options?: IdleOptions): void;
}

interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

interface IdleOptions {
  timeout?: number;
}
