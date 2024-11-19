import { r as l, h as o, e as a } from "./p-55339060.js";

const c = class {
  constructor(o) {
    l(this, o);
  }
  render() {
    return o(a, null, o("div", {
      class: "black-local"
    }, "No encapsulation: Black background"), o("div", {
      class: "black-global"
    }, "No encapsulation: Black background (global style)"), o("div", {
      class: "yellow-global"
    }, "No encapsulation: Yellow background (global link)"));
  }
};

c.style = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}";

export { c as css_variables_no_encapsulation }