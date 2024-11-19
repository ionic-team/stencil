System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n, s;
  return {
    setters: [ function(t) {
      e = t.r, n = t.f, s = t.h;
    } ],
    execute: function() {
      t("event_custom_type", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.testEvent = n(this, "testEvent", 7), this.counter = 0, this.lastEventValue = void 0;
        }
        return class_1.prototype.testEventHandler = function(t) {
          this.counter++, this.lastEventValue = t.detail;
        }, class_1.prototype.componentDidLoad = function() {
          this.testEvent.emit({
            value: "Test value"
          });
        }, class_1.prototype.render = function() {
          return s("div", null, s("p", null, "testEvent is emitted on componentDidLoad"), s("div", null, s("p", null, "Emission count: ", s("span", {
            id: "counter"
          }, this.counter)), s("p", null, "Last emitted value: ", s("span", {
            id: "lastValue"
          }, JSON.stringify(this.lastEventValue)))));
        }, class_1;
      }());
    }
  };
}));