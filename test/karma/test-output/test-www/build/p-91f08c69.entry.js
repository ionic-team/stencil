import { r as t, g as i } from "./p-55339060.js";

const s = class {
  constructor(i) {
    t(this, i), this.str = "single", this.nu = 2, this.undef = void 0, this.null = null, 
    this.bool = !1, this.otherBool = !0, this.disabled = !1, this.dynamicStr = void 0, 
    this.dynamicNu = void 0;
  }
  componentDidLoad() {
    this.dynamicStr = "value", this.el.dynamicNu = 123;
  }
  get el() {
    return i(this);
  }
};

export { s as reflect_to_attr }