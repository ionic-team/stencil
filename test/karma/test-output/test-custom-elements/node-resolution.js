import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const location$1 = 'module.js';

const location = 'module/index.js';

const NodeResolution$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("div", null, h("h1", null, "node-resolution"), h("p", { id: "module-index" }, location), h("p", { id: "module" }, location$1)));
  }
}, [0, "node-resolution"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["node-resolution"];
  components.forEach(tagName => { switch (tagName) {
    case "node-resolution":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, NodeResolution$1);
      }
      break;
  } });
}

const NodeResolution = NodeResolution$1;
const defineCustomElement = defineCustomElement$1;

export { NodeResolution, defineCustomElement };
