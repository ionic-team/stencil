import { h, proxyCustomElement } from '@stencil/core/internal/client';

const SlotHtml$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("article", null, h("span", null, h("slot", { name: "start" }))), h("slot", null), h("section", null, h("slot", { name: "end" }))));
  }
};

const SlotHtml = /*@__PURE__*/proxyCustomElement(SlotHtml$1, [4,"slot-html",{"inc":[2]}]);
const components = ['slot-html', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-html':
        tagName = 'slot-html';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotHtml);
        }
        break;

    }
  });
};

export { SlotHtml, defineCustomElement };
