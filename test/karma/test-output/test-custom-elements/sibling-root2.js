import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SiblingRoot = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  render() {
    return (h("div", null, h("section", null, "sibling-shadow-dom"), h("article", null, h("slot", null))));
  }
  static get style() { return ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }"; }
}, [6, "sibling-root"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["sibling-root"];
  components.forEach(tagName => { switch (tagName) {
    case "sibling-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SiblingRoot);
      }
      break;
  } });
}

export { SiblingRoot as S, defineCustomElement as d };
