import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const cmpRootCss = "div#relativeToRoot{background-image:url(\"/assets/favicon.ico?relativeToRoot\")}div#relative{background-image:url(\"../assets/favicon.ico?relative\")}div#absolute{background-image:url(\"https://www.google.com/favicon.ico\")}";

const InitCssRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [h("div", { id: "relative" }), h("div", { id: "relativeToRoot" }), h("div", { id: "absolute" })];
  }
  static get style() { return cmpRootCss; }
}, [0, "init-css-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["init-css-root"];
  components.forEach(tagName => { switch (tagName) {
    case "init-css-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, InitCssRoot$1);
      }
      break;
  } });
}

const InitCssRoot = InitCssRoot$1;
const defineCustomElement = defineCustomElement$1;

export { InitCssRoot, defineCustomElement };
