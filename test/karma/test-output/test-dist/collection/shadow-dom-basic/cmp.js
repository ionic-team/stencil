import { h } from '@stencil/core';
export class ShadowDomBasic {
  render() {
    return [h("div", null, "shadow"), h("slot", null)];
  }
  static get is() { return "shadow-dom-basic"; }
  static get encapsulation() { return "shadow"; }
  static get styles() { return "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }"; }
}
