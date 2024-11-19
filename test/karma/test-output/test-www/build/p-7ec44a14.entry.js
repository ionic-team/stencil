import { r as s, h as a } from "./p-55339060.js";

const t = class {
  constructor(a) {
    s(this, a), this.values = [ 0 ];
  }
  addValue() {
    this.values = [ ...this.values, this.values.length ];
  }
  render() {
    return a("div", null, a("button", {
      onClick: this.addValue.bind(this)
    }, "Add Value"), a("shadow-dom-array", {
      values: this.values,
      class: "results1"
    }));
  }
};

export { t as shadow_dom_array_root }