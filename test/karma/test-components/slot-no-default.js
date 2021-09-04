import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const SlotNoDefault$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("slot", { name: "a-slot-name" }), h("section", null, h("slot", { name: "footer-slot-name" })), h("div", null, h("article", null, h("slot", { name: "nav-slot-name" })))));
  }
};

const SlotNoDefault = /*@__PURE__*/proxyCustomElement(SlotNoDefault$1, [4,"slot-no-default"]);
const components = ['slot-no-default', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-no-default':
        tagName = 'slot-no-default';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotNoDefault);
        }
        break;

    }
  });
};

export { SlotNoDefault, defineCustomElement };
