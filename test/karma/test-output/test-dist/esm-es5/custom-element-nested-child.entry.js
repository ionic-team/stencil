import { r as registerInstance, h } from "./index-a2c0d171.js";

var CustomElementNestedChild = /** @class */ function() {
  function CustomElementNestedChild(e) {
    registerInstance(this, e);
  }
  return CustomElementNestedChild.prototype.render = function() {
    return h("div", null, h("strong", null, "Child Nested Component Loaded!"));
  }, CustomElementNestedChild;
}();

export { CustomElementNestedChild as custom_element_nested_child };