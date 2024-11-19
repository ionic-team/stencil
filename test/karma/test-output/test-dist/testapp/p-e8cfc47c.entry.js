import { r as l, h as t } from "./p-55339060.js";

const n = class {
  constructor(t) {
    l(this, t), this.inc = 0;
  }
  render() {
    return t("div", null, t("hr", null), t("article", null, t("span", null, t("slot", {
      name: "start"
    }))), t("slot", null), t("section", null, t("slot", {
      name: "end"
    })));
  }
};

export { n as slot_html }