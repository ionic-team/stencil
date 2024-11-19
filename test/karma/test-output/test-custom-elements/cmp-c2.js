import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const LifecycleBasicC = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
}, [0, "lifecycle-basic-c", {
    "value": [1],
    "rendered": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-basic-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-basic-c":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleBasicC);
      }
      break;
  } });
}

export { LifecycleBasicC as L, defineCustomElement as d };
