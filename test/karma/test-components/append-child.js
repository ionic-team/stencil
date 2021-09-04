import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const AppendChild$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("h1", null, "H1 Top", h("slot", { name: "h1" }), h("div", null, "H1 Bottom")), h("article", null, "Default Top", h("slot", null), "Default Bottom"), h("h6", null, h("section", null, "H6 Top", h("slot", { name: "h6" }), h("div", null, "H6 Bottom")))));
  }
  static get style() { return "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }"; }
};

const AppendChild = /*@__PURE__*/proxyCustomElement(AppendChild$1, [6,"append-child"]);
const components = ['append-child', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'append-child':
        tagName = 'append-child';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, AppendChild);
        }
        break;

    }
  });
};

export { AppendChild, defineCustomElement };
