import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomSlotNested } from './cmp8.js';

const ShadowDomSlotNestedRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    const nested = [0, 1, 2].map((i) => {
      return h("shadow-dom-slot-nested", { i: i }, "light dom: ", i);
    });
    return [h("section", null, "shadow-dom-slot-nested"), h("article", null, nested)];
  }
  static get style() { return ":host {\n      color: green;\n      font-weight: bold;\n    }"; }
};

const ShadowDomSlotNestedRoot = /*@__PURE__*/proxyCustomElement(ShadowDomSlotNestedRoot$1, [1,"shadow-dom-slot-nested-root"]);
const components = ['shadow-dom-slot-nested-root', 'shadow-dom-slot-nested', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-slot-nested-root':
        tagName = 'shadow-dom-slot-nested-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomSlotNestedRoot);
        }
        break;

      case 'shadow-dom-slot-nested':
        tagName = 'shadow-dom-slot-nested';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ShadowDomSlotNested$1 = /*@__PURE__*/proxyCustomElement(ShadowDomSlotNested, [1,"shadow-dom-slot-nested-root"]);
          customElements.define(tagName, ShadowDomSlotNested$1);
        }
        break;

    }
  });
};

export { ShadowDomSlotNestedRoot, defineCustomElement };
