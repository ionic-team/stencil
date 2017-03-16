(function () {
  'use strict';

  var debouncerQueue = [];

  /**
   * Adds a `Polymer.Debouncer` to a list of globally flushable tasks.
   *
   * @memberof Polymer
   * @param {Polymer.Debouncer} debouncer Debouncer to enqueue
   */
  Polymer.enqueueDebouncer = function (debouncer) {
    debouncerQueue.push(debouncer);
  };

  function flushDebouncers() {
    var didFlush = Boolean(debouncerQueue.length);
    while (debouncerQueue.length) {
      try {
        debouncerQueue.shift().flush();
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    return didFlush;
  }

  /**
   * Forces several classes of asynchronously queued tasks to flush:
   * - Debouncers added via `enqueueDebouncer`
   * - ShadyDOM distribution
   *
   * @memberof Polymer
   */
  Polymer.flush = function () {
    var shadyDOM = void 0,
        debouncers = void 0;
    do {
      shadyDOM = window.ShadyDOM && ShadyDOM.flush();
      if (window.ShadyCSS && window.ShadyCSS.ScopingShim) {
        window.ShadyCSS.ScopingShim.flush();
      }
      debouncers = flushDebouncers();
    } while (shadyDOM || debouncers);
  };
})();