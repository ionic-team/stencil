import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

function timeout(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

const LifecycleAsyncC = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
}, [0, "lifecycle-async-c", {
    "value": [1]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-async-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-async-c":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleAsyncC);
      }
      break;
  } });
}

export { LifecycleAsyncC as L, defineCustomElement as d, timeout as t };
