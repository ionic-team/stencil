import { r as registerInstance, h } from "./index-a2c0d171.js";

var DomReattachClone = /** @class */ function() {
  function DomReattachClone(t) {
    registerInstance(this, t);
  }
  return DomReattachClone.prototype.render = function() {
    return h("div", {
      class: "wrapper"
    }, h("span", {
      class: "component-mark-up"
    }, "Component mark-up"), h("slot", null));
  }, DomReattachClone;
}();

export { DomReattachClone as dom_reattach_clone };