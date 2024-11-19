import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp13.js';

const SlotFallbackRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
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
      h("button", { onClick: this.changeFallbackContent.bind(this), class: "change-fallback-content" }, "Change Fallback Slot Content"),
      h("button", { onClick: this.changeLightDom.bind(this), class: "change-light-dom" }, this.inc % 2 === 0 ? 'Use light dom content' : 'Use fallback slot content'),
      h("button", { onClick: this.changeSlotContent.bind(this), class: "change-slot-content" }, "Change Slot Content"),
      h("slot-fallback", { inc: this.fallbackInc, class: "results1" }, this.inc % 2 !== 0
        ? [
          h("content-default", null, this.slotContent, " : default"),
          h("content-end", { slot: "end" }, this.slotContent, " : end"),
          h("content-start", { slot: "start" }, this.slotContent, " : start"),
        ]
        : null),
    ];
  }
}, [0, "slot-fallback-root", {
    "fallbackInc": [32],
    "inc": [32],
    "slotContent": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-fallback-root", "slot-fallback"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-fallback-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotFallbackRoot$1);
      }
      break;
    case "slot-fallback":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotFallbackRoot = SlotFallbackRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotFallbackRoot, defineCustomElement };
