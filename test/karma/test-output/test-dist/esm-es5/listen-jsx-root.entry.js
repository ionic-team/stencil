import { r as registerInstance, h } from "./index-a2c0d171.js";

var AttributeBasicRoot = /** @class */ function() {
  function AttributeBasicRoot(t) {
    var i = this;
    registerInstance(this, t), this.onClick = function() {
      i.wasClicked = "Parent event";
    }, this.wasClicked = "";
  }
  return AttributeBasicRoot.prototype.render = function() {
    return [ h("span", {
      id: "result-root"
    }, this.wasClicked), h("listen-jsx", {
      onClick: this.onClick
    }) ];
  }, AttributeBasicRoot;
}();

export { AttributeBasicRoot as listen_jsx_root };