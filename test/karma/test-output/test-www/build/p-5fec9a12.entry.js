import { r as t } from "./p-55339060.js";

const s = class {
  constructor(s) {
    t(this, s), this._obj = {
      name: "James bond"
    }, this.nu0 = 1, this.nu1 = void 0, this.nu2 = void 0, this.bool0 = !0, this.bool1 = void 0, 
    this.bool2 = void 0, this.str0 = "hello", this.str1 = void 0, this.str2 = void 0;
  }
  get obj() {
    return JSON.stringify(this._obj);
  }
  set obj(t) {
    "string" == typeof t && (this._obj = {
      name: t
    });
  }
  async getInstance() {
    return this;
  }
};

export { s as attribute_complex }