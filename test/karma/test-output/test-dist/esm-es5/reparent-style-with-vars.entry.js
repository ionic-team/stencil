import { r as registerInstance, h } from "./index-a2c0d171.js";

var reparentStyleWithVarsCss = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}", ReparentStyleWithVars = /** @class */ function() {
  function ReparentStyleWithVars(t) {
    registerInstance(this, t);
  }
  return ReparentStyleWithVars.prototype.render = function() {
    return h("div", {
      class: "css-entry"
    }, "With CSS Vars");
  }, ReparentStyleWithVars;
}();

ReparentStyleWithVars.style = reparentStyleWithVarsCss;

export { ReparentStyleWithVars as reparent_style_with_vars };