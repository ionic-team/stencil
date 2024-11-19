import { r as s, h as t } from "./p-55339060.js";

const i = class {
  constructor(t) {
    s(this, t), this.items = [];
  }
  render() {
    return t("slot-light-scoped-list", null, this.items.map((s => t("div", null, s))));
  }
};

export { i as slot_dynamic_scoped_list }