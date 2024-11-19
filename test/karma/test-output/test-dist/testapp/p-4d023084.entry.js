import { r as o, i as t, h as s } from "./p-55339060.js";

const d = class {
  constructor(s) {
    o(this, s), this.mode = t(this);
  }
  render() {
    return s("div", null, this.mode);
  }
};

d.style = {
  blue: ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}",
  red: ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}"
};

export { d as shadow_dom_mode }