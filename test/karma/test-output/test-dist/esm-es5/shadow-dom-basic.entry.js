import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomBasic = /** @class */ function() {
  function ShadowDomBasic(o) {
    registerInstance(this, o);
  }
  return ShadowDomBasic.prototype.render = function() {
    return [ h("div", null, "shadow"), h("slot", null) ];
  }, ShadowDomBasic;
}();

ShadowDomBasic.style = "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }";

export { ShadowDomBasic as shadow_dom_basic };