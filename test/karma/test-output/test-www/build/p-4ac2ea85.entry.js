import { r as c, h as s, e as t } from "./p-55339060.js";

const i = class {
  constructor(s) {
    c(this, s), this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return s(t, null, s("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked));
  }
};

i.style = ".sc-listen-reattach-h { display: block; background: gray;}";

export { i as listen_reattach }