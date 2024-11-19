import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const EventCustomType$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.testEvent = createEvent(this, "testEvent", 7);
    this.counter = 0;
    this.lastEventValue = undefined;
  }
  testEventHandler(newValue) {
    this.counter++;
    this.lastEventValue = newValue.detail;
  }
  componentDidLoad() {
    this.testEvent.emit({
      value: 'Test value',
    });
  }
  render() {
    return (h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", { id: "counter" }, this.counter)), h("p", null, "Last emitted value: ", h("span", { id: "lastValue" }, JSON.stringify(this.lastEventValue))))));
  }
}, [0, "event-custom-type", {
    "counter": [32],
    "lastEventValue": [32]
  }, [[0, "testEvent", "testEventHandler"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["event-custom-type"];
  components.forEach(tagName => { switch (tagName) {
    case "event-custom-type":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, EventCustomType$1);
      }
      break;
  } });
}

const EventCustomType = EventCustomType$1;
const defineCustomElement = defineCustomElement$1;

export { EventCustomType, defineCustomElement };
