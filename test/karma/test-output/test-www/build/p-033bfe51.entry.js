import { r, h as s } from "./p-55339060.js";

const o = class {
  constructor(s) {
    r(this, s);
  }
  render() {
    return s("div", {
      class: "css-entry"
    }, "No CSS Variables");
  }
};

o.style = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

export { o as reparent_style_no_vars }