import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomModeRoot = /** @class */ function() {
  function ShadowDomModeRoot(o) {
    registerInstance(this, o), this.showRed = !1;
  }
  return ShadowDomModeRoot.prototype.componentDidLoad = function() {
    var o = this;
    setTimeout((function() {
      o.showRed = !0;
    }), 50);
  }, ShadowDomModeRoot.prototype.render = function() {
    return h("div", null, h("shadow-dom-mode", {
      id: "blue",
      colormode: "blue"
    }), this.showRed ? h("shadow-dom-mode", {
      id: "red"
    }) : null);
  }, ShadowDomModeRoot;
}();

export { ShadowDomModeRoot as shadow_dom_mode_root };