import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const ListenReattach$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return (h(Host, null, h("div", { id: "clicked" }, "Clicked: ", this.clicked)));
  }
  static get style() { return ".sc-listen-reattach-h { display: block; background: gray;}"; }
}, [2, "listen-reattach", {
    "clicked": [32]
  }, [[0, "click", "click"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["listen-reattach"];
  components.forEach(tagName => { switch (tagName) {
    case "listen-reattach":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ListenReattach$1);
      }
      break;
  } });
}

const ListenReattach = ListenReattach$1;
const defineCustomElement = defineCustomElement$1;

export { ListenReattach, defineCustomElement };
