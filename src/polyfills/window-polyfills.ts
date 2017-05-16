/**
 * Window Polyfills
 * - performance.now
 * - requestAnimationFrame
 * - requestIdleCallback
 */
(function(window: any){


  // performance.now
  // ---------------------
  // https://gist.github.com/paulirish/5438650
  // @license http://opensource.org/licenses/MIT
  // copyright Paul Irish 2015
  if ('performance' in window === false) {
    window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
    return new Date().getTime();
  });

  if ('now' in window.performance === false) {

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    };
  }



  // requestAnimationFrame
  // ---------------------
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit'];

  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: Function) => {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id: any) => {
      clearTimeout(id);
    };
  }



  // requestIdleCallback
  // ---------------------

  if (typeof window.requestIdleCallback !== 'function') {
    // darn, this browser does not support requestIdleCallback
    // use requestAnimationFrame to simulate rIC

    // used to remember if a queue has already been created or not
    let isRicQueued = false;
    let isRafQueued = false;

    // arrays to store all of the callbacks to be fired off
    let queuedRafCBs: Function = null;
    let queuedRicCBs: Function = null;

    let deadline = 0;

    // object to keep track of time remaining
    // this gets passed into the ric callbacks
    const frameDeadline = {
      timeRemaining: () => deadline - performance.now()
    };

    // create a unique id to be reused in each post message
    const queueRicId = `ric${Math.random()}`;

    // using post message as a way to queue up ric callbacks after paint
    // add a message listener and if it has the same id as
    // queueRicId then that means we've queued up a requestIdleCallback
    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.source === window && ev.data === queueRicId) {
        // cool, so this message was created because there's
        // a ric to do!
        isRicQueued = false;

        const ricCB = queuedRicCBs;

        queuedRicCBs = null;

        ricCB && ricCB(frameDeadline);
      }
    });

    // keep track of how long it's taking each frame and adjust accordingly
    let lastFrameTime = 33;
    let currentFrameTime = 33;

    function animationTick(timestamp: number) {
      let nextFrameTime = (timestamp - deadline + currentFrameTime);

      isRafQueued = false;

      if (nextFrameTime < currentFrameTime && lastFrameTime < currentFrameTime) {
        if (nextFrameTime < 8) {
          nextFrameTime = 8;
        }

        currentFrameTime = nextFrameTime < lastFrameTime
          ? lastFrameTime
          : nextFrameTime;

      } else {
        lastFrameTime = nextFrameTime;
      }

      deadline = (timestamp + currentFrameTime);
      if (!isRicQueued) {
        isRicQueued = true;
        window.postMessage(queueRicId, '*');
      }

      var cb = queuedRafCBs;
      queuedRafCBs = null;

      cb && cb(timestamp);
    }

    // remember the original raf
    const orgRaf = window.requestAnimationFrame;

    // create a new raf which helps to polyfill ric
    window.requestAnimationFrame = (rafCb: (time: number) => void) => {
      queuedRafCBs = rafCb;

      if (!isRafQueued) {
        // haven't started up the queue yet
        isRafQueued = true;
        orgRaf(animationTick);
      }
    };

    // create the ric which this browser doesn't already have
    window.requestIdleCallback = (ricCb: (deadline: any) => void) => {
      // remember the callback to be fired
      queuedRicCBs = ricCb;

      if (!isRafQueued) {
        // haven't started up the queue yet
        isRafQueued = true;
        orgRaf(animationTick);
      }
    };
  }

})(window);
