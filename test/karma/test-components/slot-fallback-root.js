import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotFallback } from './cmp13.js';

const SlotFallbackRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.fallbackInc = 0;
    this.inc = 0;
    this.slotContent = 'slot light dom 0';
    this.contentInc = 0;
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
};

const SlotFallbackRoot = /*@__PURE__*/proxyCustomElement(SlotFallbackRoot$1, [0,"slot-fallback-root",{"fallbackInc":[32],"inc":[32],"slotContent":[32]}]);
const components = ['slot-fallback-root', 'slot-fallback', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-fallback-root':
        tagName = 'slot-fallback-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotFallbackRoot);
        }
        break;

      case 'slot-fallback':
        tagName = 'slot-fallback';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotFallback$1 = /*@__PURE__*/proxyCustomElement(SlotFallback, [0,"slot-fallback-root",{"fallbackInc":[32],"inc":[32],"slotContent":[32]}]);
          customElements.define(tagName, SlotFallback$1);
        }
        break;

    }
  });
};

export { SlotFallbackRoot, defineCustomElement };
