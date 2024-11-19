import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SvgClass$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.hasColor = false;
  }
  testClick() {
    this.hasColor = !this.hasColor;
  }
  render() {
    return (h("div", null, h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test")), h("div", null, h("svg", { viewBox: "0 0 54 54", class: this.hasColor ? 'primary' : undefined }, h("circle", { cx: "8", cy: "18", width: "54", height: "8", r: "2", class: this.hasColor ? 'red' : undefined }), h("rect", { y: "2", width: "54", height: "8", rx: "2", class: this.hasColor ? 'blue' : undefined })))));
  }
}, [0, "svg-class", {
    "hasColor": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["svg-class"];
  components.forEach(tagName => { switch (tagName) {
    case "svg-class":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SvgClass$1);
      }
      break;
  } });
}

const SvgClass = SvgClass$1;
const defineCustomElement = defineCustomElement$1;

export { SvgClass, defineCustomElement };
