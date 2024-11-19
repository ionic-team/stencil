import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpc = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async componentWillLoad() {
    output('componentWillLoad-c');
  }
  componentDidLoad() {
    output('componentDidLoad-c');
  }
  render() {
    return (h(Host, null, h("div", null, "hello")));
  }
}, [1, "lifecycle-nested-c"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-nested-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-nested-c":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Cmpc);
      }
      break;
  } });
}

const LifecycleNestedC = Cmpc;
const defineCustomElement = defineCustomElement$1;

export { LifecycleNestedC, defineCustomElement };
