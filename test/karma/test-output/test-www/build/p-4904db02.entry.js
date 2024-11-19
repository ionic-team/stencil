import { r as e, h as s } from "./p-55339060.js";

const t = class {
  constructor(s) {
    e(this, s), this.isReversed = !1;
  }
  testClick() {
    this.isReversed = !this.isReversed;
  }
  render() {
    let e = [ 0, 1, 2, 3, 4 ];
    return this.isReversed && e.reverse(), [ s("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), s("div", null, e.map((e => s("div", {
      key: e,
      id: "item-" + e
    }, e)))) ];
  }
};

export { t as key_reorder_root }