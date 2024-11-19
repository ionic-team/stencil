import { r as s, h as t } from "./p-55339060.js";

const l = class {
  constructor(t) {
    s(this, t);
  }
  render() {
    return [ t("section", null, "These are my items:"), t("article", {
      class: "list-wrapper",
      style: {
        border: "2px solid blue"
      }
    }, t("slot", null)), t("div", null, "That's it....") ];
  }
};

export { l as slot_light_list }