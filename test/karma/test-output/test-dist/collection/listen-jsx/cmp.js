import { h } from '@stencil/core';
export class AttributeBasic {
  constructor() {
    this.wasClicked = '';
  }
  onClick() {
    this.wasClicked = 'Host event';
  }
  render() {
    return h("span", { id: "result" }, this.wasClicked);
  }
  static get is() { return "listen-jsx"; }
  static get encapsulation() { return "scoped"; }
  static get styles() { return ":host{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }"; }
  static get states() {
    return {
      "wasClicked": {}
    };
  }
  static get listeners() {
    return [{
        "name": "click",
        "method": "onClick",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
