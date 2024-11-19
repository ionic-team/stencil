import { r as registerInstance, h } from "./index-a2c0d171.js";

var cmpCss = ":root{--font-color:blue}header{color:var(--font-color)}", DynamicCssVariables = /** @class */ function() {
  function DynamicCssVariables(o) {
    registerInstance(this, o), this.bgColor = "white";
  }
  return DynamicCssVariables.prototype.getBackgroundStyle = function() {
    return this.bgColor && "white" !== this.bgColor ? {
      background: this.bgColor,
      "--font-color": "white"
    } : {};
  }, DynamicCssVariables.prototype.changeColor = function() {
    "white" === this.bgColor ? this.bgColor = "red" : this.bgColor = "white";
  }, DynamicCssVariables.prototype.render = function() {
    return [ h("header", {
      style: this.getBackgroundStyle()
    }, "Dynamic CSS Variables!!"), h("main", null, h("p", null, h("button", {
      onClick: this.changeColor.bind(this)
    }, "Change Color"))) ];
  }, DynamicCssVariables;
}();

DynamicCssVariables.style = cmpCss;

export { DynamicCssVariables as dynamic_css_variable };