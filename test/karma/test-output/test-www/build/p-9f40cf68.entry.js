import { r, h as e } from "./p-55339060.js";

const o = class {
  constructor(e) {
    r(this, e);
  }
  render() {
    return [ e("header", null, "Header"), e("slot", null), e("footer", null, "Footer") ];
  }
};

o.style = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";

export { o as slot_array_basic }