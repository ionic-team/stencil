import { r, h as o } from "./p-55339060.js";

const s = class {
  constructor(o) {
    r(this, o);
  }
  render() {
    return o("div", {
      class: "css-entry"
    }, "With CSS Vars");
  }
};

s.style = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

export { s as reparent_style_with_vars }