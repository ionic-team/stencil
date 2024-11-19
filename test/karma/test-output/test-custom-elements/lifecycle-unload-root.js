import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$3 } from './cmp-a.js';
import { d as defineCustomElement$2 } from './cmp-b3.js';

const LifecycleUnloadRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.renderCmp = true;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, this.renderCmp ? 'Remove' : 'Add'), this.renderCmp ? h("lifecycle-unload-a", null) : null));
  }
}, [0, "lifecycle-unload-root", {
    "renderCmp": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-unload-root", "lifecycle-unload-a", "lifecycle-unload-b"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-unload-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleUnloadRoot$1);
      }
      break;
    case "lifecycle-unload-a":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "lifecycle-unload-b":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const LifecycleUnloadRoot = LifecycleUnloadRoot$1;
const defineCustomElement = defineCustomElement$1;

export { LifecycleUnloadRoot, defineCustomElement };
