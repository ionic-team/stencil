import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const KeyReorderRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.isReversed = false;
  }
  testClick() {
    this.isReversed = !this.isReversed;
  }
  render() {
    let items = [0, 1, 2, 3, 4];
    if (this.isReversed) {
      items.reverse();
    }
    return [
      h("button", { onClick: this.testClick.bind(this) }, "Test"),
      h("div", null, items.map((item) => {
        return (h("div", { key: item, id: 'item-' + item }, item));
      })),
    ];
  }
}, [0, "key-reorder-root", {
    "isReversed": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["key-reorder-root"];
  components.forEach(tagName => { switch (tagName) {
    case "key-reorder-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, KeyReorderRoot$1);
      }
      break;
  } });
}

const KeyReorderRoot = KeyReorderRoot$1;
const defineCustomElement = defineCustomElement$1;

export { KeyReorderRoot, defineCustomElement };
