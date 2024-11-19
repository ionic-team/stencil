import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var AngularSlotBinding = /** @class */ function() {
  function AngularSlotBinding(n) {
    registerInstance(this, n);
  }
  return AngularSlotBinding.prototype.render = function() {
    return h(Host, null, h("slot", null));
  }, AngularSlotBinding;
}();

export { AngularSlotBinding as slot_ng_if };