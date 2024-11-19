import { r as s, h as t } from "./p-55339060.js";

const r = class {
  constructor(t) {
    s(this, t);
  }
  render() {
    return [ t("section", null, "These are my items:"), t("article", {
      class: "list-wrapper",
      style: {
        border: "2px solid green"
      }
    }, t("slot", null)), t("div", null, "That's it....") ];
  }
};

export { r as slot_light_scoped_list }