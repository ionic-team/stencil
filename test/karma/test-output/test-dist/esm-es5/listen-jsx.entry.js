import { r as registerInstance, h } from "./index-a2c0d171.js";

var AttributeBasic = /** @class */ function() {
  function AttributeBasic(t) {
    registerInstance(this, t), this.wasClicked = "";
  }
  return AttributeBasic.prototype.onClick = function() {
    this.wasClicked = "Host event";
  }, AttributeBasic.prototype.render = function() {
    return h("span", {
      id: "result"
    }, this.wasClicked);
  }, AttributeBasic;
}();

AttributeBasic.style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";

export { AttributeBasic as listen_jsx };