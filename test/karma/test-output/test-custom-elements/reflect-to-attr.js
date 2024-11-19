import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const ReflectToAttr$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.str = 'single';
    this.nu = 2;
    this.undef = undefined;
    this.null = null;
    this.bool = false;
    this.otherBool = true;
    this.disabled = false;
    this.dynamicStr = undefined;
    this.dynamicNu = undefined;
  }
  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }
  get el() { return this; }
}, [0, "reflect-to-attr", {
    "str": [513],
    "nu": [514],
    "undef": [513],
    "null": [513],
    "bool": [516],
    "otherBool": [516, "other-bool"],
    "disabled": [516],
    "dynamicStr": [1537, "dynamic-str"],
    "dynamicNu": [514, "dynamic-nu"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["reflect-to-attr"];
  components.forEach(tagName => { switch (tagName) {
    case "reflect-to-attr":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ReflectToAttr$1);
      }
      break;
  } });
}

const ReflectToAttr = ReflectToAttr$1;
const defineCustomElement = defineCustomElement$1;

export { ReflectToAttr, defineCustomElement };
