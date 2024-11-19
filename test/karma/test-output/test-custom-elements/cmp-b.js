import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { t as timeout, d as defineCustomElement$1 } from './cmp-c.js';

const LifecycleAsyncB = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-async-c", { value: this.value })));
  }
}, [0, "lifecycle-async-b", {
    "value": [1]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-async-b", "lifecycle-async-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-async-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleAsyncB);
      }
      break;
    case "lifecycle-async-c":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { LifecycleAsyncB as L, defineCustomElement as d };
