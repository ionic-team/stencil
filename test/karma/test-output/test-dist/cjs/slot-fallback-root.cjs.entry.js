'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotFallbackRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.contentInc = 0;
    this.fallbackInc = 0;
    this.inc = 0;
    this.slotContent = 'slot light dom 0';
  }
  changeLightDom() {
    this.inc++;
  }
  changeSlotContent() {
    this.contentInc++;
    this.slotContent = 'slot light dom ' + this.contentInc;
  }
  changeFallbackContent() {
    this.fallbackInc++;
  }
  render() {
    return [
      index.h("button", { onClick: this.changeFallbackContent.bind(this), class: "change-fallback-content" }, "Change Fallback Slot Content"),
      index.h("button", { onClick: this.changeLightDom.bind(this), class: "change-light-dom" }, this.inc % 2 === 0 ? 'Use light dom content' : 'Use fallback slot content'),
      index.h("button", { onClick: this.changeSlotContent.bind(this), class: "change-slot-content" }, "Change Slot Content"),
      index.h("slot-fallback", { inc: this.fallbackInc, class: "results1" }, this.inc % 2 !== 0
        ? [
          index.h("content-default", null, this.slotContent, " : default"),
          index.h("content-end", { slot: "end" }, this.slotContent, " : end"),
          index.h("content-start", { slot: "start" }, this.slotContent, " : start"),
        ]
        : null),
    ];
  }
};

exports.slot_fallback_root = SlotFallbackRoot;
