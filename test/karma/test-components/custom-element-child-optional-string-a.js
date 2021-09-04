import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const CustomElementChildOptionalStringA$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h("div", null, h("strong", null, "Optional Nested Component via String A Loaded!")));
  }
};

const CustomElementChildOptionalStringA = /*@__PURE__*/proxyCustomElement(CustomElementChildOptionalStringA$1, [1,"custom-element-child-optional-string-a"]);
const components = ['custom-element-child-optional-string-a', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'custom-element-child-optional-string-a':
        tagName = 'custom-element-child-optional-string-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, CustomElementChildOptionalStringA);
        }
        break;

    }
  });
};

export { CustomElementChildOptionalStringA, defineCustomElement };
