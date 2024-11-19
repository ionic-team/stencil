import { r as s, h as t } from "./p-55339060.js";

const i = class {
  constructor(t) {
    s(this, t), this.onClick = () => {
      this.wasClicked = "Parent event";
    }, this.wasClicked = "";
  }
  render() {
    return [ t("span", {
      id: "result-root"
    }, this.wasClicked), t("listen-jsx", {
      onClick: this.onClick
    }) ];
  }
};

export { i as listen_jsx_root }