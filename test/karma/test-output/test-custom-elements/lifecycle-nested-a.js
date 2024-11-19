import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpa = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async componentWillLoad() {
    output('componentWillLoad-a');
  }
  async componentDidLoad() {
    output('componentDidLoad-a');
  }
  render() {
    return h("slot", null);
  }
}, [1, "lifecycle-nested-a"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-nested-a"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-nested-a":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Cmpa);
      }
      break;
  } });
}

const LifecycleNestedA = Cmpa;
const defineCustomElement = defineCustomElement$1;

export { LifecycleNestedA, defineCustomElement };
