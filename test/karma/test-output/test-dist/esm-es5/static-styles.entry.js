import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var StaticStyles = /** @class */ function() {
  function StaticStyles(t) {
    registerInstance(this, t);
  }
  return StaticStyles.prototype.render = function() {
    return h(Host, null, h("h1", null, "static get styles()"));
  }, StaticStyles;
}();

StaticStyles.style = "h1 {\n        color: red;\n      }";

export { StaticStyles as static_styles };