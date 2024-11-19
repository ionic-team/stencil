import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const EventBasic$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.testEvent = createEvent(this, "testEvent", 7);
    this.counter = 0;
  }
  testEventHandler() {
    this.counter++;
  }
  componentDidLoad() {
    this.testEvent.emit();
  }
  render() {
    return (h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", { id: "counter" }, this.counter)))));
  }
}, [0, "event-basic", {
    "counter": [32]
  }, [[0, "testEvent", "testEventHandler"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["event-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "event-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, EventBasic$1);
      }
      break;
  } });
}

const EventBasic = EventBasic$1;
const defineCustomElement = defineCustomElement$1;

export { EventBasic, defineCustomElement };
