import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var cmpShadowDomCss = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}", CssVariablesRoot = /** @class */ function() {
  function CssVariablesRoot(o) {
    registerInstance(this, o), this.isGreen = !1;
  }
  return CssVariablesRoot.prototype.render = function() {
    var o = this;
    return h(Host, {
      class: {
        "set-green": this.isGreen
      }
    }, h("div", {
      class: "inner-div"
    }, "Shadow: ", this.isGreen ? "Green" : "Red", " background"), h("div", {
      class: "black-global-shadow"
    }, "Shadow: Black background (global)"), h("button", {
      onClick: function() {
        o.isGreen = !o.isGreen;
      }
    }, "Toggle color"));
  }, CssVariablesRoot;
}();

CssVariablesRoot.style = cmpShadowDomCss;

export { CssVariablesRoot as css_variables_shadow_dom };