import { r as o, h as t } from "./p-55339060.js";

const e = class {
  constructor(t) {
    o(this, t), this.showContent = !1, this.showFooter = !1;
  }
  componentDidLoad() {
    this.showFooter = !0, setTimeout((() => this.showContent = !0), 20);
  }
  render() {
    return t("conditional-rerender", null, t("header", null, "Header"), this.showContent ? t("section", null, "Content") : null, this.showFooter ? t("footer", null, "Footer") : null);
  }
};

export { e as conditional_rerender_root }