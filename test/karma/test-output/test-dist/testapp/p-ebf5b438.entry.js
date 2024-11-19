import { r as s, h as e, e as t } from "./p-55339060.js";

const r = class {
  constructor(e) {
    s(this, e);
  }
  render() {
    return e(t, null, e("input", null));
  }
  static get delegatesFocus() {
    return !0;
  }
};

r.style = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}";

export { r as custom_elements_delegates_focus }