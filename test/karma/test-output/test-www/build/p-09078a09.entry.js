import { r as t, h as e, g as s } from "./p-55339060.js";

const a = class {
  constructor(e) {
    t(this, e), this.value = void 0;
  }
  render() {
    return e("div", null, e("p", null, "Value: ", e("span", {
      class: "value"
    }, this.value)), e("input", {
      type: "text",
      value: this.value,
      onInput: t => this.value = t.target.value
    }));
  }
  get el() {
    return s(this);
  }
};

export { a as input_basic_root }