import { r as t, h as s } from "./p-55339060.js";

import { s as r } from "./p-2413d236.js";

import "./p-d428d037.js";

const i = class {
  constructor(s) {
    t(this, s);
  }
  componentWillLoad() {
    const t = r().data;
    this.first = t.first, this.last = t.last;
  }
  render() {
    return s("div", null, this.first, " ", this.last);
  }
};

export { i as external_import_b }