import { h } from '@stencil/core';
export class ShadowDomBasicRoot {
  render() {
    return (h("shadow-dom-basic", null, h("div", null, "light")));
  }
  static get is() { return "shadow-dom-basic-root"; }
  static get encapsulation() { return "shadow"; }
  static get styles() { return "div {\n      background: rgb(255, 255, 0);\n    }"; }
}
