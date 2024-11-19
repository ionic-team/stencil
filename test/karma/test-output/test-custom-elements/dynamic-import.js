import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const DynamicImport$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = undefined;
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await import('./module1.js')).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return h("div", null, this.value);
  }
}, [0, "dynamic-import", {
    "value": [32],
    "update": [64]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dynamic-import"];
  components.forEach(tagName => { switch (tagName) {
    case "dynamic-import":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DynamicImport$1);
      }
      break;
  } });
}

const DynamicImport = DynamicImport$1;
const defineCustomElement = defineCustomElement$1;

export { DynamicImport, defineCustomElement };
