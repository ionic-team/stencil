import { r, h as s } from "./p-55339060.js";

const o = class {
  constructor(s) {
    r(this, s);
  }
  render() {
    return s("div", {
      class: "wrapper"
    }, s("span", {
      class: "component-mark-up"
    }, "Component mark-up"), s("slot", null));
  }
};

export { o as dom_reattach_clone }