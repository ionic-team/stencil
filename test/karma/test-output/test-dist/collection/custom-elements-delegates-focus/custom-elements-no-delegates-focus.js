import { Host, h } from '@stencil/core';
export class CustomElementsNoDelegatesFocus {
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get is() { return "custom-elements-no-delegates-focus"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["shared-delegates-focus.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["shared-delegates-focus.css"]
    };
  }
}
