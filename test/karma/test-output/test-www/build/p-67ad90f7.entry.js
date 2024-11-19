import { r as o, h as s } from "./p-55339060.js";

const r = class {
  constructor(s) {
    o(this, s), this.i = void 0;
  }
  render() {
    return [ s("header", null, "shadow dom: ", this.i), s("footer", null, s("slot", null)) ];
  }
};

r.style = "header {\n      color: red;\n    }";

export { r as shadow_dom_slot_nested }