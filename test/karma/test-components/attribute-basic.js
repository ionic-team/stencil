import { proxyCustomElement } from '@stencil/core/internal/client';
import { A as AttributeBasic$1 } from './cmp.js';

const AttributeBasic = /*@__PURE__*/proxyCustomElement(AttributeBasic$1, [0,"attribute-basic",{"single":[1],"multiWord":[1,"multi-word"],"customAttr":[1,"my-custom-attr"]}]);
const components = ['attribute-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'attribute-basic':
        tagName = 'attribute-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, AttributeBasic);
        }
        break;

    }
  });
};

export { AttributeBasic, defineCustomElement };
