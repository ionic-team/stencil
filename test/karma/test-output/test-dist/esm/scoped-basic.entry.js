import { r as registerInstance, h } from './index-a2c0d171.js';

const ScopedBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [
      h("div", null, "scoped"),
      h("p", null, h("slot", null)),
    ];
  }
};
ScopedBasic.style = ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }";

export { ScopedBasic as scoped_basic };
