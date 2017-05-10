import { NextTickApi } from '../util/interfaces';
import { noop } from '../util/helpers';

var hostScheduleDeferredCallback = window.requestIdleCallback;


export function NextTickClient(window: Window): NextTickApi {
  /* Adopted from Vue.js, MIT, https://github.com/vuejs/vue */
  const callbacks: Function[] = [];
  let pending = false;
  let timerFunc: Function;
  const isIOS = /iphone|ipad|ipod|ios/.test(window.navigator.userAgent.toLowerCase());

  let deadlineObj: any;


  function nextTickHandler() {
    hostScheduleDeferredCallback((dl: any) => {
      deadlineObj = dl;
      doWork();
    });
  }

  function doWork() {
    pending = false;
    const copies = callbacks.slice(0);

    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      if (!deadlineObj.didTimeout) {
        copies[i]();
      } else {
        break;
      }
    }
    nextTickHandler();
  }
/*
  function scheduleDeferredCallback(callback) {
    if (!isDeferredCallbackScheduled) {
      isDeferredCallbackScheduled = true;
      hostScheduleDeferredCallback(callback);
    }
  }

  function performDeferredWork(deadline) {
    // We pass the lowest deferred priority here because it acts as a minimum.
    // Higher priorities will also be performed.
    isDeferredCallbackScheduled = false;
    performWork(OffscreenPriority, deadline);
  }

  function performWork(priorityLevel: number, deadline: any) {
  }
*/


  if (typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1) {
    const p = Promise.resolve();
    const logError = (err: any) => { console.error(err); };

    timerFunc = function promiseTick() {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop);
    };

  } else {
    // fallback to setTimeout
    timerFunc = function timeoutTick() {
      setTimeout(nextTickHandler, 0);
    };
  }

  function queueNextTick(cb: Function) {
    callbacks.push(cb);
    console.log(callbacks.length);

    if (!pending) {
      pending = true;
      timerFunc();
    }
  }

  return {
    nextTick: queueNextTick
  };
}

