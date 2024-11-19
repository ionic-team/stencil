System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("child_with_reflection", /** @class */ function() {
        function class_1(t) {
          n(this, t), 
          // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
          // karma tests
          this.renderCount = 0, this.val = void 0;
        }
        return class_1.prototype.render = function() {
          return this.renderCount += 1, e("div", null, e("div", null, "Child Render Count: ", this.renderCount), e("input", {
            step: this.val
          }));
        }, class_1.prototype.componentDidUpdate = function() {
          this.renderCount += 1;
        }, class_1;
      }());
    }
  };
}));