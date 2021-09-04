import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotBasicOrder } from './cmp11.js';

const SlotBasicOrderRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("slot-basic-order", null, h("content-a", null, "a"), h("content-b", null, "b"), h("content-c", null, "c")));
  }
};

const SlotBasicOrderRoot = /*@__PURE__*/proxyCustomElement(SlotBasicOrderRoot$1, [0,"slot-basic-order-root"]);
const components = ['slot-basic-order-root', 'slot-basic-order', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-basic-order-root':
        tagName = 'slot-basic-order-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotBasicOrderRoot);
        }
        break;

      case 'slot-basic-order':
        tagName = 'slot-basic-order';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotBasicOrder$1 = /*@__PURE__*/proxyCustomElement(SlotBasicOrder, [0,"slot-basic-order-root"]);
          customElements.define(tagName, SlotBasicOrder$1);
        }
        break;

    }
  });
};

export { SlotBasicOrderRoot, defineCustomElement };
