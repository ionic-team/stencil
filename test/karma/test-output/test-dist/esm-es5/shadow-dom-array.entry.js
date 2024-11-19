import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomArray = /** @class */ function() {
  function ShadowDomArray(r) {
    registerInstance(this, r), this.values = [];
  }
  return ShadowDomArray.prototype.render = function() {
    return this.values.map((function(r) {
      return h("div", null, r);
    }));
  }, ShadowDomArray;
}();

export { ShadowDomArray as shadow_dom_array };