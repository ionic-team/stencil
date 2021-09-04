import { h, proxyCustomElement } from '@stencil/core/internal/client';

const foo = "bar";

const JsonBasic$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", { id: "json-foo" }, foo);
  }
};

const JsonBasic = /*@__PURE__*/proxyCustomElement(JsonBasic$1, [0,"json-basic"]);
const components = ['json-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'json-basic':
        tagName = 'json-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, JsonBasic);
        }
        break;

    }
  });
};

export { JsonBasic, defineCustomElement };
