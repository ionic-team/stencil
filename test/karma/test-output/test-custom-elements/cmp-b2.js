import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './cmp-c2.js';

const LifecycleBasicB = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-basic-c", { value: this.value })));
  }
}, [0, "lifecycle-basic-b", {
    "value": [1],
    "rendered": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-basic-b", "lifecycle-basic-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-basic-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleBasicB);
      }
      break;
    case "lifecycle-basic-c":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { LifecycleBasicB as L, defineCustomElement as d };
