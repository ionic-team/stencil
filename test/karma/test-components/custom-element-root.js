import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { C as CustomElementChildA } from './custom-element-child-a2.js';

const CustomElementRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.optionalComponentString = 'a';
  }
  render() {
    const OptionalComponentStringTag = 'custom-element-child-optional-string-' + this.optionalComponentString;
    return (h("div", null, h("h4", null, "Basic Nested Component"), h("custom-element-child-a", null), h("h4", null, "Optional Nested Component via String"), h(OptionalComponentStringTag, null)));
  }
};

const CustomElementRoot = /*@__PURE__*/proxyCustomElement(CustomElementRoot$1, [1,"custom-element-root",{"optionalComponentString":[32]}]);
const components = ['custom-element-root', 'custom-element-child-a', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'custom-element-root':
        tagName = 'custom-element-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, CustomElementRoot);
        }
        break;

      case 'custom-element-child-a':
        tagName = 'custom-element-child-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const CustomElementChildA$1 = /*@__PURE__*/proxyCustomElement(CustomElementChildA, [1,"custom-element-root",{"optionalComponentString":[32]}]);
          customElements.define(tagName, CustomElementChildA$1);
        }
        break;

    }
  });
};

export { CustomElementRoot, defineCustomElement };
