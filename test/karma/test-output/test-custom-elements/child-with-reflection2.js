import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ChildWithReflection = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
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
    return (h("div", null, h("div", null, "Child Render Count: ", this.renderCount), h("input", { step: this.val })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
}, [1, "child-with-reflection", {
    "val": [520]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["child-with-reflection"];
  components.forEach(tagName => { switch (tagName) {
    case "child-with-reflection":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ChildWithReflection);
      }
      break;
  } });
}

export { ChildWithReflection as C, defineCustomElement as d };
