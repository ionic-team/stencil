import { r as e, h as r } from "./p-55339060.js";

const t = class {
  constructor(r) {
    e(this, r), this.renderCmp = !0;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return r("div", null, r("button", {
      onClick: this.testClick.bind(this)
    }, this.renderCmp ? "Remove" : "Add"), this.renderCmp ? r("lifecycle-unload-a", null) : null);
  }
};

export { t as lifecycle_unload_root }