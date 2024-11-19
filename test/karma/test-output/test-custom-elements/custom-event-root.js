import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const CustomEventCmp = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.output = '';
  }
  componentDidLoad() {
    this.elm.addEventListener('eventNoDetail', this.receiveEvent.bind(this));
    this.elm.addEventListener('eventWithDetail', this.receiveEvent.bind(this));
  }
  receiveEvent(ev) {
    this.output = `${ev.type} ${ev.detail || ''}`.trim();
  }
  fireCustomEventNoDetail() {
    const ev = new CustomEvent('eventNoDetail');
    this.elm.dispatchEvent(ev);
  }
  fireCustomEventWithDetail() {
    const ev = new CustomEvent('eventWithDetail', { detail: 88 });
    this.elm.dispatchEvent(ev);
  }
  render() {
    return (h("div", null, h("div", null, h("button", { id: "btnNoDetail", onClick: this.fireCustomEventNoDetail.bind(this) }, "Fire Custom Event, no detail")), h("div", null, h("button", { id: "btnWithDetail", onClick: this.fireCustomEventWithDetail.bind(this) }, "Fire Custom Event, with detail")), h("pre", { id: "output" }, this.output)));
  }
  get elm() { return this; }
}, [0, "custom-event-root", {
    "output": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-event-root"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-event-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomEventCmp);
      }
      break;
  } });
}

const CustomEventRoot = CustomEventCmp;
const defineCustomElement = defineCustomElement$1;

export { CustomEventRoot, defineCustomElement };
