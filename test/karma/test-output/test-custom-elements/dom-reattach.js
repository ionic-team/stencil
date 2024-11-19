import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const DomReattach$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.willLoad = 0;
    this.didLoad = 0;
    this.didUnload = 0;
  }
  componentWillLoad() {
    this.willLoad++;
  }
  componentDidLoad() {
    this.didLoad++;
  }
  disconnectedCallback() {
    this.didUnload++;
  }
  render() {
    return (h(Host, null, h("p", null, "componentWillLoad: ", this.willLoad), h("p", null, "componentDidLoad: ", this.didLoad), h("p", null, "disconnectedCallback: ", this.didUnload)));
  }
}, [0, "dom-reattach", {
    "willLoad": [1026, "will-load"],
    "didLoad": [1026, "did-load"],
    "didUnload": [1026, "did-unload"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dom-reattach"];
  components.forEach(tagName => { switch (tagName) {
    case "dom-reattach":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DomReattach$1);
      }
      break;
  } });
}

const DomReattach = DomReattach$1;
const defineCustomElement = defineCustomElement$1;

export { DomReattach, defineCustomElement };
