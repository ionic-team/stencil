import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const CmpTag88 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", null, "tag-88");
  }
}, [0, "tag-88"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["tag-88"];
  components.forEach(tagName => { switch (tagName) {
    case "tag-88":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CmpTag88);
      }
      break;
  } });
}

const Tag88 = CmpTag88;
const defineCustomElement = defineCustomElement$1;

export { Tag88, defineCustomElement };
