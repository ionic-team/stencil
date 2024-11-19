import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const AngularSlotBinding = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
}, [4, "slot-ng-if"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-ng-if"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-ng-if":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AngularSlotBinding);
      }
      break;
  } });
}

const SlotNgIf = AngularSlotBinding;
const defineCustomElement = defineCustomElement$1;

export { SlotNgIf, defineCustomElement };
