import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { C as CustomElementNestedChild } from './custom-element-nested-child2.js';

const CustomElementChildOptionalStringB$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h("div", null, h("strong", null, "Optional Nested Component via String B Loaded!"), h("custom-element-nested-child", null)));
  }
};

const CustomElementChildOptionalStringB = /*@__PURE__*/proxyCustomElement(CustomElementChildOptionalStringB$1, [1,"custom-element-child-optional-string-b"]);
const components = ['custom-element-child-optional-string-b', 'custom-element-nested-child', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'custom-element-child-optional-string-b':
        tagName = 'custom-element-child-optional-string-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, CustomElementChildOptionalStringB);
        }
        break;

      case 'custom-element-nested-child':
        tagName = 'custom-element-nested-child';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const CustomElementNestedChild$1 = /*@__PURE__*/proxyCustomElement(CustomElementNestedChild, [1,"custom-element-child-optional-string-b"]);
          customElements.define(tagName, CustomElementNestedChild$1);
        }
        break;

    }
  });
};

export { CustomElementChildOptionalStringB, defineCustomElement };
