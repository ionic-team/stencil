import { h } from '@stencil/core/internal/client';

const ScopedBasic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("div", null, "scoped"),
      h("p", null, h("slot", null)),
    ];
  }
  static get style() { return ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }"; }
};

export { ScopedBasic as S };
