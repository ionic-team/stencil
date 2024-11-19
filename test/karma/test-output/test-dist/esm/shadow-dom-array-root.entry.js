import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomArrayRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.values = [0];
  }
  addValue() {
    this.values = [...this.values, this.values.length];
  }
  render() {
    return (h("div", null, h("button", { onClick: this.addValue.bind(this) }, "Add Value"), h("shadow-dom-array", { values: this.values, class: "results1" })));
  }
};

export { ShadowDomArrayRoot as shadow_dom_array_root };
