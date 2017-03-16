(function () {
  'use strict';

  var userPolymer = window.Polymer;

  /**
   * @namespace Polymer
   * @summary Polymer is a lightweight library built on top of the web
   * standards-based Web Components API's, and makes it easy to build your
   * own custom HTML elements.
   */
  window.Polymer = function (info) {
    return window.Polymer._polymerFn(info);
  };

  // support user settings on the Polymer object
  if (userPolymer) {
    Object.assign(Polymer, userPolymer);
  }

  // To be plugged by legacy implementation if loaded
  window.Polymer._polymerFn = function () {
    throw new Error('Load polymer.html to use the Polymer() function.');
  };
  window.Polymer.version = '2.0-preview';

  /* eslint-disable no-unused-vars */
  /*
  When using Closure Compiler, goog.reflect.objectProperty(property, object) is replaced by the munged name for object[property]
  We cannot alias this function, so we have to use a small shim that has the same behavior when not compiling.
  */
  window.goog = window.goog || {};
  window.goog.reflect = window.goog.reflect || {
    objectProperty: function objectProperty(s, o) {
      return s;
    }
  };
  /* eslint-enable */
})();