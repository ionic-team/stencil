import { h, Host } from '@stencil/core';
export class ListenReattach {
  constructor() {
    this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return (h(Host, null, h("div", { id: "clicked" }, "Clicked: ", this.clicked)));
  }
  static get is() { return "listen-reattach"; }
  static get encapsulation() { return "scoped"; }
  static get styles() { return ":host { display: block; background: gray;}"; }
  static get states() {
    return {
      "clicked": {}
    };
  }
  static get listeners() {
    return [{
        "name": "click",
        "method": "click",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
