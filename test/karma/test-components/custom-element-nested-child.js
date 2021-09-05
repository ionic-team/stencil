import { proxyCustomElement } from '@stencil/core/internal/client';
import { C as CustomElementNestedChild$1 } from './custom-element-nested-child2.js';

const CustomElementNestedChild = /*@__PURE__*/ proxyCustomElement(CustomElementNestedChild$1, [
  1,
  'custom-element-nested-child',
]);
const components = ['custom-element-nested-child'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'custom-element-nested-child':
        tagName = 'custom-element-nested-child';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, CustomElementNestedChild);
        }
        break;
    }
  });
};

export { CustomElementNestedChild, defineCustomElement };
