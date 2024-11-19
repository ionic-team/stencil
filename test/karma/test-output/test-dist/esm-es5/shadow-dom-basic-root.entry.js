import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomBasicRoot = /** @class */ function() {
  function ShadowDomBasicRoot(o) {
    registerInstance(this, o);
  }
  return ShadowDomBasicRoot.prototype.render = function() {
    return h("shadow-dom-basic", null, h("div", null, "light"));
  }, ShadowDomBasicRoot;
}();

ShadowDomBasicRoot.style = "div {\n      background: rgb(255, 255, 0);\n    }";

export { ShadowDomBasicRoot as shadow_dom_basic_root };