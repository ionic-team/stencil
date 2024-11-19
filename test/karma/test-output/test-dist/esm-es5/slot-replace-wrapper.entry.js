import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotReplaceWrapper = /** @class */ function() {
  function SlotReplaceWrapper(e) {
    registerInstance(this, e), this.href = void 0;
  }
  return SlotReplaceWrapper.prototype.render = function() {
    var e = null != this.href ? "a" : "div", r = null != this.href ? {
      href: this.href,
      target: "_blank"
    } : {};
    return [ h(e, Object.assign({}, r), h("slot", {
      name: "start"
    }), h("span", null, h("slot", null), h("span", null, h("slot", {
      name: "end"
    })))), h("hr", null) ];
  }, SlotReplaceWrapper;
}();

export { SlotReplaceWrapper as slot_replace_wrapper };