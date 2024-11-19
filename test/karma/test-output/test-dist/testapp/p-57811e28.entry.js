import { r as s, h as i } from "./p-55339060.js";

const t = class {
  constructor(i) {
    s(this, i), this.hasColor = !1;
  }
  testClick() {
    this.hasColor = !this.hasColor;
  }
  render() {
    return i("div", null, i("div", null, i("button", {
      onClick: this.testClick.bind(this)
    }, "Test")), i("div", null, i("svg", {
      viewBox: "0 0 54 54",
      class: this.hasColor ? "primary" : void 0
    }, i("circle", {
      cx: "8",
      cy: "18",
      width: "54",
      height: "8",
      r: "2",
      class: this.hasColor ? "red" : void 0
    }), i("rect", {
      y: "2",
      width: "54",
      height: "8",
      rx: "2",
      class: this.hasColor ? "blue" : void 0
    }))));
  }
};

export { t as svg_class }