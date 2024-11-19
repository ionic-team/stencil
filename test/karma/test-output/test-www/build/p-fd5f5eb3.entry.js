import { r as s, h as c } from "./p-55339060.js";

const n = class {
  constructor(c) {
    s(this, c);
  }
  render() {
    return [ c("div", null, "scoped"), c("p", null, c("slot", null)) ];
  }
};

n.style = ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }";

export { n as scoped_basic }