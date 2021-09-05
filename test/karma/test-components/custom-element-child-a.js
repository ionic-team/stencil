import { proxyCustomElement } from '@stencil/core/internal/client';
import { C as CustomElementChildA$1 } from './custom-element-child-a2.js';

const CustomElementChildA = /*@__PURE__*/ proxyCustomElement(CustomElementChildA$1, [1, 'custom-element-child-a']);
const components = ['custom-element-child-a'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'custom-element-child-a':
        tagName = 'custom-element-child-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, CustomElementChildA);
        }
        break;
    }
  });
};

export { CustomElementChildA, defineCustomElement };
