import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const BadSharedJSX = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const sharedNode = h("div", null, "Do Not Share JSX Nodes!");
    return (h("div", null, sharedNode, sharedNode));
  }
}, [0, "bad-shared-jsx"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["bad-shared-jsx"];
  components.forEach(tagName => { switch (tagName) {
    case "bad-shared-jsx":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, BadSharedJSX);
      }
      break;
  } });
}

const BadSharedJsx = BadSharedJSX;
const defineCustomElement = defineCustomElement$1;

export { BadSharedJsx, defineCustomElement };
