import { proxyCustomElement } from '@stencil/core/internal/client';
import { C as ConditionalRerender$1 } from './cmp2.js';

const ConditionalRerender = /*@__PURE__*/proxyCustomElement(ConditionalRerender$1, [4,"conditional-rerender"]);
const components = ['conditional-rerender', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'conditional-rerender':
        tagName = 'conditional-rerender';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ConditionalRerender);
        }
        break;

    }
  });
};

export { ConditionalRerender, defineCustomElement };
