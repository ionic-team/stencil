import { r as o, h as n, e as c } from "./p-55339060.js";

import { o as e } from "./p-10870045.js";

const l = class {
  constructor(n) {
    o(this, n);
  }
  async componentWillLoad() {
    e("componentWillLoad-c");
  }
  componentDidLoad() {
    e("componentDidLoad-c");
  }
  render() {
    return n(c, null, n("div", null, "hello"));
  }
};

export { l as lifecycle_nested_c }