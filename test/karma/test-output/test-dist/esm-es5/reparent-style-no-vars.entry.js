import { r as registerInstance, h } from "./index-a2c0d171.js";

var reparentStyleNoVarsCss = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}", ReparentStyleNoVars = /** @class */ function() {
  function ReparentStyleNoVars(e) {
    registerInstance(this, e);
  }
  return ReparentStyleNoVars.prototype.render = function() {
    return h("div", {
      class: "css-entry"
    }, "No CSS Variables");
  }, ReparentStyleNoVars;
}();

ReparentStyleNoVars.style = reparentStyleNoVarsCss;

export { ReparentStyleNoVars as reparent_style_no_vars };