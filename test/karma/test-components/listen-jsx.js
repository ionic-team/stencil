import { proxyCustomElement } from '@stencil/core/internal/client';
import { A as AttributeBasic } from './cmp3.js';

const ListenJsx = /*@__PURE__*/proxyCustomElement(AttributeBasic, [2,"listen-jsx",{"wasClicked":[32]},[[0,"click","onClick"]]]);
const components = ['listen-jsx', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'listen-jsx':
        tagName = 'listen-jsx';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ListenJsx);
        }
        break;

    }
  });
};

export { ListenJsx, defineCustomElement };
