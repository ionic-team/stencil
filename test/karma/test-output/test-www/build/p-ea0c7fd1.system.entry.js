System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("parent_with_reflect_child", /** @class */ function() {
        function class_1(t) {
          e(this, t), 
          // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
          // karma tests
          this.renderCount = 0;
        }
        return class_1.prototype.render = function() {
          return this.renderCount += 1, n("div", null, n("div", null, "Parent Render Count: ", this.renderCount), n("child-with-reflection", {
            val: 1
          }));
        }, class_1.prototype.componentDidUpdate = function() {
          this.renderCount += 1;
        }, class_1;
      }());
    }
  };
}));