import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotHtml$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("article", null, h("span", null, h("slot", { name: "start" }))), h("slot", null), h("section", null, h("slot", { name: "end" }))));
  }
}, [4, "slot-html", {
    "inc": [2]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-html"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-html":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotHtml$1);
      }
      break;
  } });
}

const SlotHtml = SlotHtml$1;
const defineCustomElement = defineCustomElement$1;

export { SlotHtml, defineCustomElement };
