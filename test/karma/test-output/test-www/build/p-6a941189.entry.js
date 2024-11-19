import { r as s, h as r } from "./p-55339060.js";

const t = class {
  constructor(r) {
    s(this, r), this.href = void 0;
  }
  render() {
    const s = null != this.href ? "a" : "div", t = null != this.href ? {
      href: this.href,
      target: "_blank"
    } : {};
    return [ r(s, Object.assign({}, t), r("slot", {
      name: "start"
    }), r("span", null, r("slot", null), r("span", null, r("slot", {
      name: "end"
    })))), r("hr", null) ];
  }
};

export { t as slot_replace_wrapper }