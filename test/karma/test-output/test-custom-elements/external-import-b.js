import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { s as store } from './external-store.js';

const ExternalImportB$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    const data = store().data;
    this.first = data.first;
    this.last = data.last;
  }
  render() {
    return (h("div", null, this.first, " ", this.last));
  }
}, [0, "external-import-b"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["external-import-b"];
  components.forEach(tagName => { switch (tagName) {
    case "external-import-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ExternalImportB$1);
      }
      break;
  } });
}

const ExternalImportB = ExternalImportB$1;
const defineCustomElement = defineCustomElement$1;

export { ExternalImportB, defineCustomElement };
