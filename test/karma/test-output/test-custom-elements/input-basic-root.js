import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const InputBasicRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = undefined;
  }
  render() {
    return (h("div", null, h("p", null, "Value: ", h("span", { class: "value" }, this.value)), h("input", { type: "text", value: this.value, onInput: (ev) => (this.value = ev.target.value) })));
  }
  get el() { return this; }
}, [0, "input-basic-root", {
    "value": [1025]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["input-basic-root"];
  components.forEach(tagName => { switch (tagName) {
    case "input-basic-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, InputBasicRoot$1);
      }
      break;
  } });
}

const InputBasicRoot = InputBasicRoot$1;
const defineCustomElement = defineCustomElement$1;

export { InputBasicRoot, defineCustomElement };
