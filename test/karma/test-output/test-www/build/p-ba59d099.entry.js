import { r as e, h as t, g as l } from "./p-55339060.js";

const n = class {
  constructor(t) {
    e(this, t);
  }
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }
  disconnectedCallback() {
    const e = document.createElement("div");
    e.textContent = "cmp-a unload", this.results.appendChild(e);
  }
  render() {
    return t("main", null, t("header", null, "cmp-a - top"), t("lifecycle-unload-b", null, "cmp-a - middle"), t("footer", null, "cmp-a - bottom"));
  }
  get el() {
    return l(this);
  }
};

export { n as lifecycle_unload_a }