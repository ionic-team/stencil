import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as data } from './external-data.js';

const ExternalImportB = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    this.first = data().first;
    this.last = data().last;
  }
  render() {
    return (h("div", null, this.first, " ", this.last));
  }
}, [0, "external-import-c"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["external-import-c"];
  components.forEach(tagName => { switch (tagName) {
    case "external-import-c":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ExternalImportB);
      }
      break;
  } });
}

const ExternalImportC = ExternalImportB;
const defineCustomElement = defineCustomElement$1;

export { ExternalImportC, defineCustomElement };
