import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ReflectNanAttribute$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.val = undefined;
  }
  render() {
    this.renderCount += 1;
    return h("div", null, "reflect-nan-attribute Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
}, [1, "reflect-nan-attribute", {
    "val": [514]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["reflect-nan-attribute"];
  components.forEach(tagName => { switch (tagName) {
    case "reflect-nan-attribute":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ReflectNanAttribute$1);
      }
      break;
  } });
}

const ReflectNanAttribute = ReflectNanAttribute$1;
const defineCustomElement = defineCustomElement$1;

export { ReflectNanAttribute, defineCustomElement };
