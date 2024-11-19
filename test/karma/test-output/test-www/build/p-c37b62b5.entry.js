import { r as t, h as s } from "./p-55339060.js";

const r = class {
  constructor(s) {
    t(this, s), this.isOpen = !1;
  }
  testClick() {
    this.isOpen = !this.isOpen;
  }
  render() {
    return s("div", null, s("div", null, s("button", {
      onClick: this.testClick.bind(this)
    }, "Test")), s("div", null, this.isOpen ? s("svg", {
      viewBox: "0 0 54 54"
    }, s("rect", {
      transform: "rotate(45 27 27)",
      y: "22",
      width: "54",
      height: "10",
      rx: "2",
      stroke: "yellow",
      "stroke-width": "5px",
      "stroke-dasharray": "8 4"
    })) : s("svg", {
      viewBox: "0 0 54 54"
    }, s("rect", {
      y: "0",
      width: "54",
      height: "10",
      rx: "2",
      stroke: "blue",
      "stroke-width": "2px",
      "stroke-dasharray": "4 2"
    }))));
  }
};

export { r as svg_attr }