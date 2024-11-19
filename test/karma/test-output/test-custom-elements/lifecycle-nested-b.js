import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpb = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async componentWillLoad() {
    output('componentWillLoad-b');
  }
  async componentDidLoad() {
    output('componentDidLoad-b');
  }
  render() {
    return h("slot", null);
  }
}, [1, "lifecycle-nested-b"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-nested-b"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-nested-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Cmpb);
      }
      break;
  } });
}

const LifecycleNestedB = Cmpb;
const defineCustomElement = defineCustomElement$1;

export { LifecycleNestedB, defineCustomElement };
