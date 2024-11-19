import { r as o, h as r, e as s } from "./p-55339060.js";

const a = class {
  constructor(r) {
    o(this, r), this.isGreen = !1;
  }
  render() {
    return r(s, {
      class: {
        "set-green": this.isGreen
      }
    }, r("div", {
      class: "inner-div"
    }, "Shadow: ", this.isGreen ? "Green" : "Red", " background"), r("div", {
      class: "black-global-shadow"
    }, "Shadow: Black background (global)"), r("button", {
      onClick: () => {
        this.isGreen = !this.isGreen;
      }
    }, "Toggle color"));
  }
};

a.style = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}";

export { a as css_variables_shadow_dom }