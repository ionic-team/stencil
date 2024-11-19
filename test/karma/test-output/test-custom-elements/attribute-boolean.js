import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const AttributeBoolean$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.boolState = undefined;
    this.strState = undefined;
    this.noreflect = undefined;
  }
}, [0, "attribute-boolean", {
    "boolState": [516, "bool-state"],
    "strState": [513, "str-state"],
    "noreflect": [4]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-boolean"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-boolean":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBoolean$1);
      }
      break;
  } });
}

const AttributeBoolean = AttributeBoolean$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeBoolean, defineCustomElement };
