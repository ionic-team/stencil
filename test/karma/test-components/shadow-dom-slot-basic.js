import { attachShadow, proxyCustomElement } from '@stencil/core/internal/client';

const ShadowDomSlotBasic$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  static get style() { return ":host {\n      color: red;\n    }"; }
};

const ShadowDomSlotBasic = /*@__PURE__*/proxyCustomElement(ShadowDomSlotBasic$1, [1,"shadow-dom-slot-basic"]);
const components = ['shadow-dom-slot-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-slot-basic':
        tagName = 'shadow-dom-slot-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomSlotBasic);
        }
        break;

    }
  });
};

export { ShadowDomSlotBasic, defineCustomElement };
