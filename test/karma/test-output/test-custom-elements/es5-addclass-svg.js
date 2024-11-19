import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SvgAddClass = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("svg", { viewBox: "0 0 8 8", class: "existing-css-class" }, h("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
  }
}, [1, "es5-addclass-svg"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["es5-addclass-svg"];
  components.forEach(tagName => { switch (tagName) {
    case "es5-addclass-svg":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SvgAddClass);
      }
      break;
  } });
}

const Es5AddclassSvg = SvgAddClass;
const defineCustomElement = defineCustomElement$1;

export { Es5AddclassSvg, defineCustomElement };
