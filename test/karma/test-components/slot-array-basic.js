import { h, proxyCustomElement } from '@stencil/core/internal/client';

const cmpCss = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";

const SlotArrayBasic$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [h("header", null, "Header"), h("slot", null), h("footer", null, "Footer")];
  }
  static get style() { return cmpCss; }
};

const SlotArrayBasic = /*@__PURE__*/proxyCustomElement(SlotArrayBasic$1, [4,"slot-array-basic"]);
const components = ['slot-array-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-array-basic':
        tagName = 'slot-array-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotArrayBasic);
        }
        break;

    }
  });
};

export { SlotArrayBasic, defineCustomElement };
