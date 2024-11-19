import { h } from '@stencil/core';
export class ShadowDomModeRoot {
  constructor() {
    this.showRed = false;
  }
  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }
  render() {
    return (h("div", null, h("shadow-dom-mode", { id: "blue", colormode: "blue" }), this.showRed ? h("shadow-dom-mode", { id: "red" }) : null));
  }
  static get is() { return "shadow-dom-mode-root"; }
  static get states() {
    return {
      "showRed": {}
    };
  }
}
