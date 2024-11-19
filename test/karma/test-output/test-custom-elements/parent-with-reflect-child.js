import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './child-with-reflection2.js';

const MyComponent = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  render() {
    this.renderCount += 1;
    return (h("div", null, h("div", null, "Parent Render Count: ", this.renderCount), h("child-with-reflection", { val: 1 })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
}, [1, "parent-with-reflect-child"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["parent-with-reflect-child", "child-with-reflection"];
  components.forEach(tagName => { switch (tagName) {
    case "parent-with-reflect-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MyComponent);
      }
      break;
    case "child-with-reflection":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ParentWithReflectChild = MyComponent;
const defineCustomElement = defineCustomElement$1;

export { ParentWithReflectChild, defineCustomElement };
