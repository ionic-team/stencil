import { r as t, h as s } from "./p-55339060.js";

import { d as r } from "./p-d428d037.js";

const i = class {
  constructor(s) {
    t(this, s);
  }
  componentWillLoad() {
    this.first = r().first, this.last = r().last;
  }
  render() {
    return s("div", null, this.first, " ", this.last);
  }
};

export { i as external_import_c }