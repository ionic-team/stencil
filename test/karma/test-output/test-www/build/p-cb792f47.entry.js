import { r as o, h as n } from "./p-55339060.js";

import { o as s } from "./p-10870045.js";

const t = class {
  constructor(n) {
    o(this, n);
  }
  async componentWillLoad() {
    s("componentWillLoad-a");
  }
  async componentDidLoad() {
    s("componentDidLoad-a");
  }
  render() {
    return n("slot", null);
  }
};

export { t as lifecycle_nested_a }