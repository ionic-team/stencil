import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp12.js';

const SlotDynamicWrapperRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.tag = 'section';
  }
  changeWrapper() {
    if (this.tag === 'section') {
      this.tag = 'article';
    }
    else {
      this.tag = 'section';
    }
  }
  render() {
    return [
      h("button", { onClick: this.changeWrapper.bind(this) }, "Change Wrapper"),
      h("slot-dynamic-wrapper", { tag: this.tag, class: "results1" }, h("h1", null, "parent text")),
    ];
  }
}, [0, "slot-dynamic-wrapper-root", {
    "tag": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-dynamic-wrapper-root", "slot-dynamic-wrapper"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-dynamic-wrapper-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotDynamicWrapperRoot$1);
      }
      break;
    case "slot-dynamic-wrapper":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotDynamicWrapperRoot = SlotDynamicWrapperRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotDynamicWrapperRoot, defineCustomElement };
