import { r as registerInstance, h } from "./index-a2c0d171.js";

var FactoryJSX = /** @class */ function() {
  function FactoryJSX(t) {
    registerInstance(this, t);
  }
  return FactoryJSX.prototype.getJsxNode = function() {
    return h("div", null, "Factory JSX");
  }, FactoryJSX.prototype.render = function() {
    return h("div", null, this.getJsxNode(), this.getJsxNode());
  }, FactoryJSX;
}();

export { FactoryJSX as factory_jsx };