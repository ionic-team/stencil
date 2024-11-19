import { r as registerInstance, h } from "./index-a2c0d171.js";

var ConditionalRerender = /** @class */ function() {
  function ConditionalRerender(n) {
    registerInstance(this, n);
  }
  return ConditionalRerender.prototype.render = function() {
    return h("main", null, h("slot", null), h("nav", null, "Nav"));
  }, ConditionalRerender;
}();

export { ConditionalRerender as conditional_rerender };