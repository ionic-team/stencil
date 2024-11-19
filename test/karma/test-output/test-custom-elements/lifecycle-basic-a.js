import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$3 } from './cmp-b2.js';
import { d as defineCustomElement$2 } from './cmp-c2.js';

const LifecycleBasicA$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.componentWillUpdated = false;
    this.componentDidUpdated = false;
    this.value = '';
    this.rendered = 0;
    this.loads = [];
    this.updates = [];
  }
  lifecycleLoad(ev) {
    this.loads = [...this.loads, ev.detail];
  }
  lifecycleUpdate(ev) {
    this.updates = [...this.updates, ev.detail];
  }
  componentWillLoad() {
    this.loads = [...this.loads, 'componentWillLoad-a'];
  }
  componentDidLoad() {
    this.loads = [...this.loads, 'componentDidLoad-a'];
  }
  componentWillUpdate() {
    if (this.value === 'Updated' && !this.componentWillUpdated) {
      this.updates = [...this.updates, 'componentWillUpdate-a'];
      this.componentWillUpdated = true;
    }
  }
  componentDidUpdate() {
    if (this.value === 'Updated' && !this.componentDidUpdated) {
      this.updates = [...this.updates, 'componentDidUpdate-a'];
      this.componentDidUpdated = true;
    }
  }
  testClick() {
    this.value = 'Updated';
  }
  render() {
    this.rendered++;
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Update"), h("hr", null), h("div", null, "LifecycleBasicA ", this.value), h("div", { class: "rendered-a" }, "rendered a: ", this.rendered), h("div", null, "loads a:"), h("ol", { class: "lifecycle-loads-a" }, this.loads.map((load) => {
      return h("li", null, load);
    })), h("div", null, "updates a:"), h("ol", { class: "lifecycle-updates-a" }, this.updates.map((update) => {
      return h("li", null, update);
    })), h("lifecycle-basic-b", { value: this.value })));
  }
}, [0, "lifecycle-basic-a", {
    "value": [32],
    "rendered": [32],
    "loads": [32],
    "updates": [32]
  }, [[0, "lifecycleLoad", "lifecycleLoad"], [0, "lifecycleUpdate", "lifecycleUpdate"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-basic-a", "lifecycle-basic-b", "lifecycle-basic-c"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-basic-a":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleBasicA$1);
      }
      break;
    case "lifecycle-basic-b":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "lifecycle-basic-c":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const LifecycleBasicA = LifecycleBasicA$1;
const defineCustomElement = defineCustomElement$1;

export { LifecycleBasicA, defineCustomElement };
