import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotChildrenRoot = /** @class */ function() {
  function SlotChildrenRoot(o) {
    registerInstance(this, o);
  }
  return SlotChildrenRoot.prototype.render = function() {
    return h("section", null, "ShadowRoot1", h("article", null, h("slot", null)), "ShadowRoot2");
  }, SlotChildrenRoot;
}();

export { SlotChildrenRoot as slot_children_root };