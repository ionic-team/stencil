import { r as registerInstance, h, g as getElement } from "./index-a2c0d171.js";

var CustomEventCmp = /** @class */ function() {
  function CustomEventCmp(t) {
    registerInstance(this, t), this.output = "";
  }
  return CustomEventCmp.prototype.componentDidLoad = function() {
    this.elm.addEventListener("eventNoDetail", this.receiveEvent.bind(this)), this.elm.addEventListener("eventWithDetail", this.receiveEvent.bind(this));
  }, CustomEventCmp.prototype.receiveEvent = function(t) {
    this.output = "".concat(t.type, " ").concat(t.detail || "").trim();
  }, CustomEventCmp.prototype.fireCustomEventNoDetail = function() {
    var t = new CustomEvent("eventNoDetail");
    this.elm.dispatchEvent(t);
  }, CustomEventCmp.prototype.fireCustomEventWithDetail = function() {
    var t = new CustomEvent("eventWithDetail", {
      detail: 88
    });
    this.elm.dispatchEvent(t);
  }, CustomEventCmp.prototype.render = function() {
    return h("div", null, h("div", null, h("button", {
      id: "btnNoDetail",
      onClick: this.fireCustomEventNoDetail.bind(this)
    }, "Fire Custom Event, no detail")), h("div", null, h("button", {
      id: "btnWithDetail",
      onClick: this.fireCustomEventWithDetail.bind(this)
    }, "Fire Custom Event, with detail")), h("pre", {
      id: "output"
    }, this.output));
  }, Object.defineProperty(CustomEventCmp.prototype, "elm", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), CustomEventCmp;
}();

export { CustomEventCmp as custom_event_root };