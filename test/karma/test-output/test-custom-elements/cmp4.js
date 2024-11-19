import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ScopedBasic = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("div", null, "scoped"),
      h("p", null, h("slot", null)),
    ];
  }
  static get style() { return ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }"; }
}, [6, "scoped-basic"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["scoped-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "scoped-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ScopedBasic);
      }
      break;
  } });
}

export { ScopedBasic as S, defineCustomElement as d };
