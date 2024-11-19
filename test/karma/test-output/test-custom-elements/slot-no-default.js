import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const SlotNoDefault$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("slot", { name: "a-slot-name" }), h("section", null, h("slot", { name: "footer-slot-name" })), h("div", null, h("article", null, h("slot", { name: "nav-slot-name" })))));
  }
}, [4, "slot-no-default"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-no-default"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-no-default":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotNoDefault$1);
      }
      break;
  } });
}

const SlotNoDefault = SlotNoDefault$1;
const defineCustomElement = defineCustomElement$1;

export { SlotNoDefault, defineCustomElement };
