import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const DomReattachClone$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
}, [4, "dom-reattach-clone"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dom-reattach-clone"];
  components.forEach(tagName => { switch (tagName) {
    case "dom-reattach-clone":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DomReattachClone$1);
      }
      break;
  } });
}

const DomReattachClone = DomReattachClone$1;
const defineCustomElement = defineCustomElement$1;

export { DomReattachClone, defineCustomElement };
