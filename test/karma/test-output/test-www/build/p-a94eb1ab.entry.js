import { r as l, h as t } from "./p-55339060.js";

const s = class {
  constructor(t) {
    l(this, t), this.inc = 0;
  }
  render() {
    return t("div", null, t("hr", null), t("slot", {
      name: "start"
    }, "slot start fallback ", this.inc), t("section", null, t("slot", null, "slot default fallback ", this.inc)), t("article", null, t("span", null, t("slot", {
      name: "end"
    }, "slot end fallback ", this.inc))));
  }
};

export { s as slot_fallback }