import { h } from '@stencil/core';
export class ScopedBasic {
  render() {
    return [
      h("div", null, "scoped"),
      h("p", null, h("slot", null)),
    ];
  }
  static get is() { return "scoped-basic"; }
  static get encapsulation() { return "scoped"; }
  static get styles() { return ":host {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div {\n      color: red;\n    }\n\n    ::slotted(span) {\n      color: yellow;\n    }"; }
}
