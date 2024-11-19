System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, i, n;
  return {
    setters: [ function(t) {
      e = t.r, i = t.h, n = t.g;
    } ],
    execute: function() {
      t("custom_event_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.output = "";
        }
        return class_1.prototype.componentDidLoad = function() {
          this.elm.addEventListener("eventNoDetail", this.receiveEvent.bind(this)), this.elm.addEventListener("eventWithDetail", this.receiveEvent.bind(this));
        }, class_1.prototype.receiveEvent = function(t) {
          this.output = "".concat(t.type, " ").concat(t.detail || "").trim();
        }, class_1.prototype.fireCustomEventNoDetail = function() {
          var t = new CustomEvent("eventNoDetail");
          this.elm.dispatchEvent(t);
        }, class_1.prototype.fireCustomEventWithDetail = function() {
          var t = new CustomEvent("eventWithDetail", {
            detail: 88
          });
          this.elm.dispatchEvent(t);
        }, class_1.prototype.render = function() {
          return i("div", null, i("div", null, i("button", {
            id: "btnNoDetail",
            onClick: this.fireCustomEventNoDetail.bind(this)
          }, "Fire Custom Event, no detail")), i("div", null, i("button", {
            id: "btnWithDetail",
            onClick: this.fireCustomEventWithDetail.bind(this)
          }, "Fire Custom Event, with detail")), i("pre", {
            id: "output"
          }, this.output));
        }, Object.defineProperty(class_1.prototype, "elm", {
          get: function() {
            return n(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }());
    }
  };
}));