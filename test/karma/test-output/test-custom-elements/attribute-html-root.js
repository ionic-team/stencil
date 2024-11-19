import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const AttributeHtmlRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.strAttr = undefined;
    this.anyAttr = undefined;
    this.nuAttr = undefined;
  }
  render() {
    return [
      h("p", null, "strAttr:", ' ', h("strong", { id: "str-attr" }, this.strAttr, " ", typeof this.strAttr)),
      h("p", null, "anyAttr:", ' ', h("strong", { id: "any-attr" }, this.anyAttr, " ", typeof this.anyAttr)),
      h("p", null, "nuAttr:", ' ', h("strong", { id: "nu-attr" }, this.nuAttr, " ", typeof this.nuAttr)),
    ];
  }
}, [0, "attribute-html-root", {
    "strAttr": [1, "str-attr"],
    "anyAttr": [8, "any-attr"],
    "nuAttr": [2, "nu-attr"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-html-root"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-html-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeHtmlRoot$1);
      }
      break;
  } });
}

const AttributeHtmlRoot = AttributeHtmlRoot$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeHtmlRoot, defineCustomElement };
