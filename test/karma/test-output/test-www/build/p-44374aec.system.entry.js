System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("reflect_nan_attribute", /** @class */ function() {
        function class_1(t) {
          e(this, t), 
          // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
          // karma tests
          this.renderCount = 0, this.val = void 0;
        }
        return class_1.prototype.render = function() {
          return this.renderCount += 1, n("div", null, "reflect-nan-attribute Render Count: ", this.renderCount);
        }, class_1.prototype.componentDidUpdate = function() {
          // we don't expect the component to update, this will increment the render count in case it does (and should fail
          // the test)
          this.renderCount += 1;
        }, class_1;
      }());
    }
  };
}));