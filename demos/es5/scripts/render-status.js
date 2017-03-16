(function () {

  'use strict';

  var scheduled = false;
  var beforeRenderQueue = [];
  var afterRenderQueue = [];

  function schedule() {
    scheduled = true;
    // before next render
    requestAnimationFrame(function () {
      scheduled = false;
      flushQueue(beforeRenderQueue);
      // after the render
      setTimeout(function () {
        flushQueue(afterRenderQueue);
      });
    });
  }

  function flushQueue(queue) {
    while (queue.length) {
      var q = queue.shift();
      var context = q[0];
      var callback = q[1];
      var args = q[2];
      try {
        callback.apply(context, args);
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
  }

  function flush() {
    while (beforeRenderQueue.length || afterRenderQueue.length) {
      flushQueue(beforeRenderQueue);
      flushQueue(afterRenderQueue);
    }
  }

  /**
   * Module for scheduling flushable pre-render and post-render tasks.
   *
   * @namespace
   * @memberof Polymer
   * @summary Module for scheduling flushable pre-render and post-render tasks.
   */
  Polymer.RenderStatus = {

    /**
     * Enqueues a callback which will be run before the next render, at
     * `requestAnimationFrame` timing.
     *
     * This method is useful for enqueuing work that requires DOM measurement,
     * since measurement may not be reliable in custom element callbacks before
     * the first render, as well as for batching measurement tasks in general.
     *
     * Tasks in this queue may be flushed by calling `Polymer.RenderStatus.flush()`.
     *
     * @memberof Polymer.RenderStatus
     * @param {*} context Context object the callback function will be bound to
     * @param {function} callback Callback function
     * @param {Array} args An array of arguments to call the callback function with
     */
    beforeNextRender: function beforeNextRender(context, callback, args) {
      if (!scheduled) {
        schedule();
      }
      beforeRenderQueue.push([context, callback, args]);
    },

    /**
     * Enqueues a callback which will be run after the next render, equivalent
     * to one task (`setTimeout`) after the next `requestAnimationFrame`.
     *
     * This method is useful for tuning the first-render performance of an
     * element or application by deferring non-critical work until after the
     * first paint.  Typical non-render-critical work may include adding UI
     * event listeners and aria attributes.
     *
     * @memberof Polymer.RenderStatus
     * @param {*} context Context object the callback function will be bound to
     * @param {function} callback Callback function
     * @param {Array} args An array of arguments to call the callback function with
     */
    afterNextRender: function afterNextRender(context, callback, args) {
      if (!scheduled) {
        schedule();
      }
      afterRenderQueue.push([context, callback, args]);
    },

    /**
     * Flushes all `beforeNextRender` tasks, followed by all `afterNextRender`
     * tasks.
     *
     * @memberof Polymer.RenderStatus
     */
    flush: flush

  };
})();