import { r as s, h as t } from "./p-55339060.js";

const i = class {
  constructor(t) {
    s(this, t), this.wasClicked = "";
  }
  onClick() {
    this.wasClicked = "Host event";
  }
  render() {
    return t("span", {
      id: "result"
    }, this.wasClicked);
  }
};

i.style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";

export { i as listen_jsx }