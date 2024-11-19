import { r as registerInstance, h } from "./index-a2c0d171.js";

var CustomElementChild = /** @class */ function() {
  function CustomElementChild(e) {
    registerInstance(this, e);
  }
  return CustomElementChild.prototype.render = function() {
    return h("div", null, h("strong", null, "Child Component Loaded!"), h("h3", null, "Child Nested Component?"), h("custom-element-nested-child", null));
  }, CustomElementChild;
}();

export { CustomElementChild as custom_element_child };