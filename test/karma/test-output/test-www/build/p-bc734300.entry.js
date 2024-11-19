import { r as t, h as n } from "./p-55339060.js";

const o = class {
  constructor(n) {
    t(this, n), this.contentInc = 0, this.fallbackInc = 0, this.inc = 0, this.slotContent = "slot light dom 0";
  }
  changeLightDom() {
    this.inc++;
  }
  changeSlotContent() {
    this.contentInc++, this.slotContent = "slot light dom " + this.contentInc;
  }
  changeFallbackContent() {
    this.fallbackInc++;
  }
  render() {
    return [ n("button", {
      onClick: this.changeFallbackContent.bind(this),
      class: "change-fallback-content"
    }, "Change Fallback Slot Content"), n("button", {
      onClick: this.changeLightDom.bind(this),
      class: "change-light-dom"
    }, this.inc % 2 == 0 ? "Use light dom content" : "Use fallback slot content"), n("button", {
      onClick: this.changeSlotContent.bind(this),
      class: "change-slot-content"
    }, "Change Slot Content"), n("slot-fallback", {
      inc: this.fallbackInc,
      class: "results1"
    }, this.inc % 2 != 0 ? [ n("content-default", null, this.slotContent, " : default"), n("content-end", {
      slot: "end"
    }, this.slotContent, " : end"), n("content-start", {
      slot: "start"
    }, this.slotContent, " : start") ] : null) ];
  }
};

export { o as slot_fallback_root }