import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const reparentStyleNoVarsCss = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleNoVars$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return h("div", { class: "css-entry" }, "No CSS Variables");
  }
  static get style() { return reparentStyleNoVarsCss; }
}, [1, "reparent-style-no-vars"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["reparent-style-no-vars"];
  components.forEach(tagName => { switch (tagName) {
    case "reparent-style-no-vars":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ReparentStyleNoVars$1);
      }
      break;
  } });
}

const ReparentStyleNoVars = ReparentStyleNoVars$1;
const defineCustomElement = defineCustomElement$1;

export { ReparentStyleNoVars, defineCustomElement };
