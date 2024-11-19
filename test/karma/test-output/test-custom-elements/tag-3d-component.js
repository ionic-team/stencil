import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const CmpTag3d = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", null, "tag-3d-component");
  }
}, [0, "tag-3d-component"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["tag-3d-component"];
  components.forEach(tagName => { switch (tagName) {
    case "tag-3d-component":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CmpTag3d);
      }
      break;
  } });
}

const Tag3dComponent = CmpTag3d;
const defineCustomElement = defineCustomElement$1;

export { Tag3dComponent, defineCustomElement };
