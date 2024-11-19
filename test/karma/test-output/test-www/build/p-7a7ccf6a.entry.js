import { r as t, h as e, g as s } from "./p-55339060.js";

const i = class {
  constructor(e) {
    t(this, e);
  }
  componentWillLoad() {
    this.url = new URL(window.location.href);
  }
  testClick() {
    const t = this.el.querySelector("attribute-basic");
    t.setAttribute("single", "single-update"), t.setAttribute("multi-word", "multiWord-update"), 
    t.setAttribute("my-custom-attr", "my-custom-attr-update"), t.setAttribute("getter", "getter-update");
  }
  render() {
    return e("div", null, e("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), e("attribute-basic", null), e("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname));
  }
  get el() {
    return s(this);
  }
};

export { i as attribute_basic_root }