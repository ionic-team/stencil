import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SiblingRoot$1 } from './sibling-root2.js';

const SiblingRoot = /*@__PURE__*/proxyCustomElement(SiblingRoot$1, [6,"sibling-root"]);
const components = ['sibling-root', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'sibling-root':
        tagName = 'sibling-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SiblingRoot);
        }
        break;

    }
  });
};

export { SiblingRoot, defineCustomElement };
