import { r as l, h as t, e as n } from "./p-55339060.js";

const o = class {
  constructor(t) {
    l(this, t);
  }
  render() {
    return t(n, null, t("slot", {
      name: "a-slot-name"
    }), t("section", null, t("slot", {
      name: "footer-slot-name"
    })), t("div", null, t("article", null, t("slot", {
      name: "nav-slot-name"
    }))));
  }
};

export { o as slot_no_default }