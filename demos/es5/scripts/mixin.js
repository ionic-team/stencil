(function () {

  'use strict';

  // unique global id for deduping mixins.

  var dedupeId = 0;

  /**
   * Given a mixin producing function, memoize applications of mixin to base
   * @private
   */
  function cachingMixin(mixin) {
    return function (base) {
      if (!mixin.__mixinApplications) {
        mixin.__mixinApplications = new WeakMap();
      }
      var map = mixin.__mixinApplications;
      var application = map.get(base);
      if (!application) {
        application = mixin(base);
        map.set(base, application);
      }
      return application;
    };
  }

  /**
   * Wraps an ES6 class expression mixin such that the mixin is only applied
   * if it has not already been applied its base argument.  Also memoizes mixin
   * applications.
   *
   * @memberof Polymer
   * @param {function} mixin ES6 class expression mixin to wrap
   * @return {function} Wrapped mixin that deduplicates and memoizes
   *   mixin applications to base
   */
  Polymer.dedupingMixin = function (mixin) {
    mixin = cachingMixin(mixin);
    // maintain a unique id for each mixin
    if (!mixin.__id) {
      mixin.__dedupeId = ++dedupeId;
    }
    return function (base) {
      var baseSet = base.__mixinSet;
      if (baseSet && baseSet[mixin.__dedupeId]) {
        return base;
      }
      var extended = mixin(base);
      // copy inherited mixin set from the extended class, or the base class
      // NOTE: we avoid use of Set here because some browser (IE11)
      // cannot extend a base Set via the constructor.
      extended.__mixinSet = Object.create(extended.__mixinSet || baseSet || null);
      extended.__mixinSet[mixin.__dedupeId] = true;
      return extended;
    };
  };
})();