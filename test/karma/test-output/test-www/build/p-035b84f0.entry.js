import { r as o, h as d } from "./p-55339060.js";

const s = class {
  constructor(d) {
    o(this, d), this.showRed = !1;
  }
  componentDidLoad() {
    setTimeout((() => {
      this.showRed = !0;
    }), 50);
  }
  render() {
    return d("div", null, d("shadow-dom-mode", {
      id: "blue",
      colormode: "blue"
    }), this.showRed ? d("shadow-dom-mode", {
      id: "red"
    }) : null);
  }
};

export { s as shadow_dom_mode_root }