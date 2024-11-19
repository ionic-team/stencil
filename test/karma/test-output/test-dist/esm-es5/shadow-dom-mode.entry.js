import { r as registerInstance, i as getMode, h } from "./index-a2c0d171.js";

var modeBlueCss = ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}", modeRedCss = ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}", ShadowDomMode = /** @class */ function() {
  function ShadowDomMode(o) {
    registerInstance(this, o), this.mode = getMode(this);
  }
  return ShadowDomMode.prototype.render = function() {
    return h("div", null, this.mode);
  }, ShadowDomMode;
}();

ShadowDomMode.style = {
  blue: modeBlueCss,
  red: modeRedCss
};

export { ShadowDomMode as shadow_dom_mode };