import { r as t, h as e, g as l } from "./p-55339060.js";

const n = class {
  constructor(e) {
    t(this, e);
  }
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }
  disconnectedCallback() {
    const t = document.createElement("div");
    t.textContent = "cmp-b unload", this.results.appendChild(t);
  }
  render() {
    return [ e("article", null, "cmp-b - top"), e("section", null, e("slot", null)), e("nav", null, "cmp-b - bottom") ];
  }
  get el() {
    return l(this);
  }
};

export { n as lifecycle_unload_b }