import { proxyCustomElement } from '@stencil/core/internal/client';

const AttributeComplex$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.nu0 = 1;
    this.bool0 = true;
    this.str0 = 'hello';
  }
  async getInstance() {
    return this;
  }
};

const AttributeComplex = /*@__PURE__*/proxyCustomElement(AttributeComplex$1, [0,"attribute-complex",{"nu0":[2,"nu-0"],"nu1":[2,"nu-1"],"nu2":[2,"nu-2"],"bool0":[4,"bool-0"],"bool1":[4,"bool-1"],"bool2":[4,"bool-2"],"str0":[1,"str-0"],"str1":[1,"str-1"],"str2":[1,"str-2"]}]);
const components = ['attribute-complex', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'attribute-complex':
        tagName = 'attribute-complex';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, AttributeComplex);
        }
        break;

    }
  });
};

export { AttributeComplex, defineCustomElement };
