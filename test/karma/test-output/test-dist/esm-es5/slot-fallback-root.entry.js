import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotFallbackRoot = /** @class */ function() {
  function SlotFallbackRoot(t) {
    registerInstance(this, t), this.contentInc = 0, this.fallbackInc = 0, this.inc = 0, 
    this.slotContent = "slot light dom 0";
  }
  return SlotFallbackRoot.prototype.changeLightDom = function() {
    this.inc++;
  }, SlotFallbackRoot.prototype.changeSlotContent = function() {
    this.contentInc++, this.slotContent = "slot light dom " + this.contentInc;
  }, SlotFallbackRoot.prototype.changeFallbackContent = function() {
    this.fallbackInc++;
  }, SlotFallbackRoot.prototype.render = function() {
    return [ h("button", {
      onClick: this.changeFallbackContent.bind(this),
      class: "change-fallback-content"
    }, "Change Fallback Slot Content"), h("button", {
      onClick: this.changeLightDom.bind(this),
      class: "change-light-dom"
    }, this.inc % 2 == 0 ? "Use light dom content" : "Use fallback slot content"), h("button", {
      onClick: this.changeSlotContent.bind(this),
      class: "change-slot-content"
    }, "Change Slot Content"), h("slot-fallback", {
      inc: this.fallbackInc,
      class: "results1"
    }, this.inc % 2 != 0 ? [ h("content-default", null, this.slotContent, " : default"), h("content-end", {
      slot: "end"
    }, this.slotContent, " : end"), h("content-start", {
      slot: "start"
    }, this.slotContent, " : start") ] : null) ];
  }, SlotFallbackRoot;
}();

export { SlotFallbackRoot as slot_fallback_root };