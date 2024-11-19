import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotDynamicWrapper = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.tag = 'section';
  }
  render() {
    return (h(this.tag, null, h("slot", null)));
  }
}, [4, "slot-dynamic-wrapper", {
    "tag": [1]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-dynamic-wrapper"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-dynamic-wrapper":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotDynamicWrapper);
      }
      break;
  } });
}

export { SlotDynamicWrapper as S, defineCustomElement as d };
