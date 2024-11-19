import { r as s, h as t, e } from "./p-55339060.js";

const r = class {
  constructor(t) {
    s(this, t);
  }
  render() {
    return t(e, null, t("input", null));
  }
  static get delegatesFocus() {
    return !0;
  }
};

r.style = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}";

export { r as delegates_focus }