import { proxyCustomElement, HTMLElement, h, Host, Build } from '@stencil/core/internal/client';

const BuildData$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("p", { class: "is-dev" }, "isDev: ", `${Build.isDev}`), h("p", { class: "is-browser" }, "isBrowser: ", `${Build.isBrowser}`), h("p", { class: "is-testing" }, "isTesting: ", `${Build.isTesting}`)));
  }
}, [0, "build-data"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["build-data"];
  components.forEach(tagName => { switch (tagName) {
    case "build-data":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, BuildData$1);
      }
      break;
  } });
}

const BuildData = BuildData$1;
const defineCustomElement = defineCustomElement$1;

export { BuildData, defineCustomElement };
