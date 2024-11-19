import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './cmp-c3.js';

const LifecycleUpdateB = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return (h("section", null, "lifecycle-update-b: ", this.value, h("lifecycle-update-c", { value: this.value })));
  }
}, [0, "lifecycle-update-b", {
    "value": [2]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-update-b", "lifecycle-update-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-update-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleUpdateB);
      }
      break;
    case "lifecycle-update-c":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { LifecycleUpdateB as L, defineCustomElement as d };
