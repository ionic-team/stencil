import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const esmImportCss = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}";

const EsmImport$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.someEvent = createEvent(this, "someEvent", 7);
    this.propVal = 0;
    this.isReady = 'false';
    this.stateVal = undefined;
    this.listenVal = 0;
    this.someEventInc = 0;
  }
  testClick() {
    this.listenVal++;
  }
  async someMethod() {
    this.someEvent.emit();
  }
  testMethod() {
    this.el.someMethod();
  }
  componentWillLoad() {
    this.stateVal = 'mph';
    this.el.componentOnReady().then(() => {
      this.isReady = 'true';
    });
  }
  componentDidLoad() {
    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }
  render() {
    return (h("div", null, h("h1", null, "esm-import"), h("p", { id: "propVal" }, "propVal: ", this.propVal), h("p", { id: "stateVal" }, "stateVal: ", this.stateVal), h("p", { id: "listenVal" }, "listenVal: ", this.listenVal), h("p", null, h("button", { onClick: this.testMethod.bind(this) }, "Test")), h("p", { id: "isReady" }, "componentOnReady: ", this.isReady)));
  }
  get el() { return this; }
  static get style() { return esmImportCss; }
}, [1, "esm-import", {
    "propVal": [2, "prop-val"],
    "isReady": [32],
    "stateVal": [32],
    "listenVal": [32],
    "someEventInc": [32],
    "someMethod": [64]
  }, [[0, "click", "testClick"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["esm-import"];
  components.forEach(tagName => { switch (tagName) {
    case "esm-import":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, EsmImport$1);
      }
      break;
  } });
}

const EsmImport = EsmImport$1;
const defineCustomElement = defineCustomElement$1;

export { EsmImport, defineCustomElement };
