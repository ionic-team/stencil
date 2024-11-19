import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const AttributeComplex$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this._obj = { name: 'James bond' };
    this.nu0 = 1;
    this.nu1 = undefined;
    this.nu2 = undefined;
    this.bool0 = true;
    this.bool1 = undefined;
    this.bool2 = undefined;
    this.str0 = 'hello';
    this.str1 = undefined;
    this.str2 = undefined;
  }
  get obj() {
    return JSON.stringify(this._obj);
  }
  set obj(newVal) {
    if (typeof newVal === 'string') {
      this._obj = { name: newVal };
    }
  }
  async getInstance() {
    return this;
  }
}, [0, "attribute-complex", {
    "nu0": [2, "nu-0"],
    "nu1": [2, "nu-1"],
    "nu2": [2, "nu-2"],
    "bool0": [4, "bool-0"],
    "bool1": [4, "bool-1"],
    "bool2": [4, "bool-2"],
    "str0": [1, "str-0"],
    "str1": [1, "str-1"],
    "str2": [1, "str-2"],
    "obj": [6145],
    "getInstance": [64]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-complex"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-complex":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeComplex$1);
      }
      break;
  } });
}

const AttributeComplex = AttributeComplex$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeComplex, defineCustomElement };
