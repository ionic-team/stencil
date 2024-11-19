import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const AttributeBasic = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.wasClicked = '';
  }
  onClick() {
    this.wasClicked = 'Host event';
  }
  render() {
    return h("span", { id: "result" }, this.wasClicked);
  }
  static get style() { return ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }"; }
}, [2, "listen-jsx", {
    "wasClicked": [32]
  }, [[0, "click", "onClick"]]]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["listen-jsx"];
  components.forEach(tagName => { switch (tagName) {
    case "listen-jsx":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBasic);
      }
      break;
  } });
}

export { AttributeBasic as A, defineCustomElement as d };
