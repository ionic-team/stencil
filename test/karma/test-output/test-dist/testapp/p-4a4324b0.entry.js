import { r as o, h as t } from "./p-55339060.js";

const s = class {
  constructor(t) {
    o(this, t);
  }
  render() {
    const o = [ 0, 1, 2 ].map((o => t("shadow-dom-slot-nested", {
      i: o
    }, "light dom: ", o)));
    return [ t("section", null, "shadow-dom-slot-nested"), t("article", null, o) ];
  }
};

s.style = ":host {\n      color: green;\n      font-weight: bold;\n    }";

export { s as shadow_dom_slot_nested_root }