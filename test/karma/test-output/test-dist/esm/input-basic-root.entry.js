import { r as registerInstance, h, g as getElement } from './index-a2c0d171.js';

const InputBasicRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.value = undefined;
  }
  render() {
    return (h("div", null, h("p", null, "Value: ", h("span", { class: "value" }, this.value)), h("input", { type: "text", value: this.value, onInput: (ev) => (this.value = ev.target.value) })));
  }
  get el() { return getElement(this); }
};

export { InputBasicRoot as input_basic_root };
