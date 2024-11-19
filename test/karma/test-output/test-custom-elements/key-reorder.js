import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const KeyReorder$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.num = undefined;
  }
  render() {
    return h("div", null, this.num);
  }
}, [0, "key-reorder", {
    "num": [2]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["key-reorder"];
  components.forEach(tagName => { switch (tagName) {
    case "key-reorder":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, KeyReorder$1);
      }
      break;
  } });
}

const KeyReorder = KeyReorder$1;
const defineCustomElement = defineCustomElement$1;

export { KeyReorder, defineCustomElement };
