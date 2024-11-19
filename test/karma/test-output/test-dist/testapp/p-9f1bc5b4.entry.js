import { r as s, h as t, e } from "./p-55339060.js";

const l = class {
  constructor(t) {
    s(this, t);
  }
  render() {
    return t(e, null, t("slot", null), t("slot-nested-order-child", null, t("slot", {
      name: "italic-slot-name"
    }), t("cmp-6", {
      slot: "end-slot-name"
    }, "6")));
  }
};

export { l as slot_nested_order_parent }