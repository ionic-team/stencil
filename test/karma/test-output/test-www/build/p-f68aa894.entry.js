import { r as o, h as r } from "./p-55339060.js";

const t = class {
  constructor(r) {
    o(this, r), this.bgColor = "white";
  }
  getBackgroundStyle() {
    return this.bgColor && "white" !== this.bgColor ? {
      background: this.bgColor,
      "--font-color": "white"
    } : {};
  }
  changeColor() {
    "white" === this.bgColor ? this.bgColor = "red" : this.bgColor = "white";
  }
  render() {
    return [ r("header", {
      style: this.getBackgroundStyle()
    }, "Dynamic CSS Variables!!"), r("main", null, r("p", null, r("button", {
      onClick: this.changeColor.bind(this)
    }, "Change Color"))) ];
  }
};

t.style = ":root{--font-color:blue}header{color:var(--font-color)}";

export { t as dynamic_css_variable }