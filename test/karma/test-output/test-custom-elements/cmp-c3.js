import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const LifecycleUpdateC = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 30);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return h("span", null, " - lifecycle-update-c: ", this.value);
  }
}, [0, "lifecycle-update-c", {
    "value": [2]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-update-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-update-c":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleUpdateC);
      }
      break;
  } });
}

export { LifecycleUpdateC as L, defineCustomElement as d };
