import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotMapOrder } from './cmp15.js';

const SlotMapOrderRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const items = ['a', 'b', 'c'];
    return (h("slot-map-order", null, items.map((item) => (h("div", null, h("input", { type: "text", value: item }))))));
  }
};

const SlotMapOrderRoot = /*@__PURE__*/proxyCustomElement(SlotMapOrderRoot$1, [0,"slot-map-order-root"]);
const components = ['slot-map-order-root', 'slot-map-order', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-map-order-root':
        tagName = 'slot-map-order-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotMapOrderRoot);
        }
        break;

      case 'slot-map-order':
        tagName = 'slot-map-order';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotMapOrder$1 = /*@__PURE__*/proxyCustomElement(SlotMapOrder, [0,"slot-map-order-root"]);
          customElements.define(tagName, SlotMapOrder$1);
        }
        break;

    }
  });
};

export { SlotMapOrderRoot, defineCustomElement };
