import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var StencilSibling = /** @class */ function() {
  function StencilSibling(i) {
    registerInstance(this, i);
  }
  return StencilSibling.prototype.render = function() {
    return h(Host, null, h("sibling-root", null, "sibling-light-dom"));
  }, StencilSibling;
}();

export { StencilSibling as stencil_sibling };