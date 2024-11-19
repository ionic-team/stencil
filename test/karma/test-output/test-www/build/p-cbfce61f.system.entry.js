System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, i, c;
  return {
    setters: [ function(e) {
      t = e.r, i = e.f, c = e.h;
    } ],
    execute: function() {
      e("lifecycle_basic_b", /** @class */ function() {
        function class_1(e) {
          t(this, e), this.lifecycleLoad = i(this, "lifecycleLoad", 7), this.lifecycleUpdate = i(this, "lifecycleUpdate", 7), 
          this.value = "", this.rendered = 0;
        }
        return class_1.prototype.componentWillLoad = function() {
          this.lifecycleLoad.emit("componentWillLoad-b");
        }, class_1.prototype.componentDidLoad = function() {
          this.lifecycleLoad.emit("componentDidLoad-b");
        }, class_1.prototype.componentWillUpdate = function() {
          this.lifecycleUpdate.emit("componentWillUpdate-b");
        }, class_1.prototype.componentDidUpdate = function() {
          this.lifecycleUpdate.emit("componentDidUpdate-b");
        }, class_1.prototype.render = function() {
          return this.rendered++, c("div", null, c("hr", null), c("div", null, "LifecycleBasicB ", this.value), c("div", {
            class: "rendered-b"
          }, "rendered b: ", this.rendered), c("lifecycle-basic-c", {
            value: this.value
          }));
        }, class_1;
      }());
    }
  };
}));