import { r as registerInstance, h } from "./index-a2c0d171.js";

var DomReattachCloneDeep = /** @class */ function() {
  function DomReattachCloneDeep(e) {
    registerInstance(this, e);
  }
  return DomReattachCloneDeep.prototype.render = function() {
    return h("div", {
      class: "wrapper"
    }, h("span", {
      class: "component-mark-up"
    }, "Component mark-up"), h("div", null, h("section", null, h("slot", null))));
  }, DomReattachCloneDeep;
}();

export { DomReattachCloneDeep as dom_reattach_clone_deep_slot };