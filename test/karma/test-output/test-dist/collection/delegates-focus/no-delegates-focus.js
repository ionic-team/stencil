import { h, Host } from '@stencil/core';
export class DelegatesFocus {
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get is() { return "no-delegates-focus"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["delegates-focus.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["delegates-focus.css"]
    };
  }
}
