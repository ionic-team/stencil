import { r as registerInstance, h } from "./index-a2c0d171.js";

var CustomElementRoot = /** @class */ function() {
  function CustomElementRoot(t) {
    registerInstance(this, t);
  }
  return CustomElementRoot.prototype.render = function() {
    return h("div", null, h("h2", null, "Root Element Loaded"), h("custom-element-child-different-name-than-class", null));
  }, CustomElementRoot;
}();

export { CustomElementRoot as custom_element_root_different_name_than_class };