System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e, s;
  return {
    setters: [ function(t) {
      n = t.r, e = t.f, s = t.h;
    } ],
    execute: function() {
      t("event_basic", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.testEvent = e(this, "testEvent", 7), this.counter = 0;
        }
        return class_1.prototype.testEventHandler = function() {
          this.counter++;
        }, class_1.prototype.componentDidLoad = function() {
          this.testEvent.emit();
        }, class_1.prototype.render = function() {
          return s("div", null, s("p", null, "testEvent is emitted on componentDidLoad"), s("div", null, s("p", null, "Emission count: ", s("span", {
            id: "counter"
          }, this.counter))));
        }, class_1;
      }());
    }
  };
}));