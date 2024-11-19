import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var cmpNoEncapsulationCss = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}", CssVariablesNoEncapsulation = /** @class */ function() {
  function CssVariablesNoEncapsulation(a) {
    registerInstance(this, a);
  }
  return CssVariablesNoEncapsulation.prototype.render = function() {
    return h(Host, null, h("div", {
      class: "black-local"
    }, "No encapsulation: Black background"), h("div", {
      class: "black-global"
    }, "No encapsulation: Black background (global style)"), h("div", {
      class: "yellow-global"
    }, "No encapsulation: Yellow background (global link)"));
  }, CssVariablesNoEncapsulation;
}();

CssVariablesNoEncapsulation.style = cmpNoEncapsulationCss;

export { CssVariablesNoEncapsulation as css_variables_no_encapsulation };