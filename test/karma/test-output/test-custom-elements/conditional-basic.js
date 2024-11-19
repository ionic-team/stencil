import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ConditionalBasic$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showContent = false;
  }
  testClick() {
    this.showContent = !this.showContent;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), h("div", { class: "results" }, this.showContent ? 'Content' : '')));
  }
}, [0, "conditional-basic", {
    "showContent": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["conditional-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "conditional-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ConditionalBasic$1);
      }
      break;
  } });
}

const ConditionalBasic = ConditionalBasic$1;
const defineCustomElement = defineCustomElement$1;

export { ConditionalBasic, defineCustomElement };
