import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const AttributeBooleanRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.state = false;
  }
  async toggleState() {
    this.state = !this.state;
  }
  hostData() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? 'hello' : null,
      'aria-hidden': `${this.state}`,
      fixedtrue: 'true',
      fixedfalse: 'false',
      'no-appear': undefined,
      'no-appear2': false,
    };
  }
  __stencil_render() {
    const AttributeBoolean = 'attribute-boolean';
    return [
      h("button", { onClick: this.toggleState.bind(this) }, "Toggle attributes"),
      h(AttributeBoolean, { boolState: this.state, strState: this.state, noreflect: this.state, tappable: this.state, "aria-hidden": `${this.state}` }),
    ];
  }
  get el() { return this; }
  render() { return h(Host, this.hostData(), this.__stencil_render()); }
}, [0, "attribute-boolean-root", {
    "state": [32],
    "toggleState": [64]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-boolean-root"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-boolean-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBooleanRoot$1);
      }
      break;
  } });
}

const AttributeBooleanRoot = AttributeBooleanRoot$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeBooleanRoot, defineCustomElement };
