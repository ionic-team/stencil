import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const DomReattachCloneDeep = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("div", null, h("section", null, h("slot", null)))));
  }
}, [4, "dom-reattach-clone-deep-slot"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dom-reattach-clone-deep-slot"];
  components.forEach(tagName => { switch (tagName) {
    case "dom-reattach-clone-deep-slot":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DomReattachCloneDeep);
      }
      break;
  } });
}

const DomReattachCloneDeepSlot = DomReattachCloneDeep;
const defineCustomElement = defineCustomElement$1;

export { DomReattachCloneDeepSlot, defineCustomElement };
