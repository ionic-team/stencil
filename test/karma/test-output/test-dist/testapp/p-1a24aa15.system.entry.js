System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, c, i;
  return {
    setters: [ function(e) {
      t = e.r, c = e.f, i = e.h;
    } ],
    execute: function() {
      e("lifecycle_basic_c", /** @class */ function() {
        function class_1(e) {
          t(this, e), this.lifecycleLoad = c(this, "lifecycleLoad", 7), this.lifecycleUpdate = c(this, "lifecycleUpdate", 7), 
          this.value = "", this.rendered = 0;
        }
        return class_1.prototype.componentWillLoad = function() {
          this.lifecycleLoad.emit("componentWillLoad-c");
        }, class_1.prototype.componentDidLoad = function() {
          this.lifecycleLoad.emit("componentDidLoad-c");
        }, class_1.prototype.componentWillUpdate = function() {
          this.lifecycleUpdate.emit("componentWillUpdate-c");
        }, class_1.prototype.componentDidUpdate = function() {
          this.lifecycleUpdate.emit("componentDidUpdate-c");
        }, class_1.prototype.render = function() {
          return this.rendered++, i("div", null, i("hr", null), i("div", null, "LifecycleBasicC ", this.value), i("div", {
            class: "rendered-c"
          }, "rendered c: ", this.rendered));
        }, class_1;
      }());
    }
  };
}));