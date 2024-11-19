import { r, h as t } from "./p-55339060.js";

const o = class {
  constructor(t) {
    r(this, t);
  }
  render() {
    return t("slot-map-order", null, [ "a", "b", "c" ].map((r => t("div", null, t("input", {
      type: "text",
      value: r
    })))));
  }
};

export { o as slot_map_order_root }