import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const DomReattachCloneHost$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
}, [4, "dom-reattach-clone-host"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dom-reattach-clone-host"];
  components.forEach(tagName => { switch (tagName) {
    case "dom-reattach-clone-host":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DomReattachCloneHost$1);
      }
      break;
  } });
}

const DomReattachCloneHost = DomReattachCloneHost$1;
const defineCustomElement = defineCustomElement$1;

export { DomReattachCloneHost, defineCustomElement };
