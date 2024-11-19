import { h, getMode } from '@stencil/core';
/**
 * @virtualProp {string} colormode - The mode determines which platform styles to use.
 */
export class ShadowDomMode {
  constructor() {
    this.mode = getMode(this);
  }
  render() {
    return h("div", null, this.mode);
  }
  static get is() { return "shadow-dom-mode"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "blue": ["mode-blue.css"],
      "red": ["mode-red.css"]
    };
  }
  static get styleUrls() {
    return {
      "blue": ["mode-blue.css"],
      "red": ["mode-red.css"]
    };
  }
}
