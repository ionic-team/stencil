import { NextTickApi } from '../util/interfaces';
import { noop } from '../util/helpers';


export function NextTickClient(window: Window): NextTickApi {
  /* Adopted from Vue.js, MIT, https://github.com/vuejs/vue */
  const callbacks: Function[] = [];
  let pending = false;
  let timerFunc: Function;
  const isIOS = /iphone|ipad|ipod|ios/.test(window.navigator.userAgent.toLowerCase());


  function nextTickHandler() {
    pending = false;
    const copies = callbacks.slice(0);

    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }


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

    if (!pending) {
      pending = true;
      timerFunc();
    }
  }

  return {
    nextTick: queueNextTick
  };
}
