import { r as registerInstance, h } from "./index-a2c0d171.js";

var SvgClass = /** @class */ function() {
  function SvgClass(s) {
    registerInstance(this, s), this.hasColor = !1;
  }
  return SvgClass.prototype.testClick = function() {
    this.hasColor = !this.hasColor;
  }, SvgClass.prototype.render = function() {
    return h("div", null, h("div", null, h("button", {
      onClick: this.testClick.bind(this)
    }, "Test")), h("div", null, h("svg", {
      viewBox: "0 0 54 54",
      class: this.hasColor ? "primary" : void 0
    }, h("circle", {
      cx: "8",
      cy: "18",
      width: "54",
      height: "8",
      r: "2",
      class: this.hasColor ? "red" : void 0
    }), h("rect", {
      y: "2",
      width: "54",
      height: "8",
      rx: "2",
      class: this.hasColor ? "blue" : void 0
    }))));
  }, SvgClass;
}();

export { SvgClass as svg_class };