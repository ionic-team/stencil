import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const cmpCss = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";

const SlotArrayBasic$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [h("header", null, "Header"), h("slot", null), h("footer", null, "Footer")];
  }
  static get style() { return cmpCss; }
}, [4, "slot-array-basic"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-array-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-array-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotArrayBasic$1);
      }
      break;
  } });
}

const SlotArrayBasic = SlotArrayBasic$1;
const defineCustomElement = defineCustomElement$1;

export { SlotArrayBasic, defineCustomElement };
