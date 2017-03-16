(function () {
  'use strict';

  /**
   * Legacy class factory and registration helper for defining Polymer
   * elements.
   *
   * This method is equivalent to
   * `customElements.define(info.is, Polymer.Class(info));`
   *
   * See `Polymer.Class` for details on valid legacy metadata format for `info`.
   *
   * @function Polymer
   * @param {Object} info Object containing Polymer metadata and functions
   *   to become class methods.
   * @return {Polymer.LegacyElement} Generated class
   */

  window.Polymer._polymerFn = function (info) {
    // if input is a `class` (aka a function with a prototype), use the prototype
    // remember that the `constructor` will never be called
    var klass = void 0;
    if (typeof info === 'function') {
      klass = info;
    } else {
      klass = Polymer.Class(info);
    }
    customElements.define(klass.is, klass);
    return klass;
  };
})();