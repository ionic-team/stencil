import { NextTickApi } from '../util/interfaces';


export function NextTickClient(window: Window): NextTickApi {
  var hostScheduleDeferredCallback = window.requestIdleCallback;
  let callbacks: Function[] = [];
  let pending = false;
  let callBackHandle: any;

  function nextTickHandler() {
    pending = true;
    callBackHandle = hostScheduleDeferredCallback(doWork);
  }

  function doWork(deadlineObj: any) {
    while (deadlineObj.timeRemaining() > 0 && callbacks.length > 0) {
      callbacks.shift()();
    }
    if (callbacks.length > 0) {
      return nextTickHandler();
    }
    pending = false;
  }

  function queueNextTick(cb: Function) {
    callbacks.push(cb);

    if (!pending) {
      nextTickHandler();
    }
  }

  return {
    nextTick: queueNextTick
  };
}

