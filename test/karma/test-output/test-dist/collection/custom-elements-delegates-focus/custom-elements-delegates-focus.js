import { Host, h } from '@stencil/core';
export class CustomElementsDelegatesFocus {
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get is() { return "custom-elements-delegates-focus"; }
  static get encapsulation() { return "shadow"; }
  static get delegatesFocus() { return true; }
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
