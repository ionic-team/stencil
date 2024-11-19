import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './child-reflect-nan-attribute2.js';

const ParentReflectNanAttribute$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
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
    return (h("div", null, h("div", null, "parent-reflect-nan-attribute Render Count: ", this.renderCount), h("child-reflect-nan-attribute", { val: 'I am not a number!!' })));
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
}, [1, "parent-reflect-nan-attribute"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["parent-reflect-nan-attribute", "child-reflect-nan-attribute"];
  components.forEach(tagName => { switch (tagName) {
    case "parent-reflect-nan-attribute":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ParentReflectNanAttribute$1);
      }
      break;
    case "child-reflect-nan-attribute":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ParentReflectNanAttribute = ParentReflectNanAttribute$1;
const defineCustomElement = defineCustomElement$1;

export { ParentReflectNanAttribute, defineCustomElement };
