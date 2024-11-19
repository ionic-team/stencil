System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("parent_reflect_nan_attribute", /** @class */ function() {
        function class_1(t) {
          n(this, t), 
          // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
          // karma tests
          this.renderCount = 0;
        }
        return class_1.prototype.render = function() {
          return this.renderCount += 1, e("div", null, e("div", null, "parent-reflect-nan-attribute Render Count: ", this.renderCount), e("child-reflect-nan-attribute", {
            val: "I am not a number!!"
          }));
        }, class_1.prototype.componentDidUpdate = function() {
          // we don't expect the component to update, this will increment the render count in case it does (and should fail
          // the test)
          this.renderCount += 1;
        }, class_1;
      }());
    }
  };
}));