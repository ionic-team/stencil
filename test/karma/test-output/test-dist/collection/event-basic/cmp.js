import { h } from '@stencil/core';
export class EventBasic {
  constructor() {
    this.counter = 0;
  }
  testEventHandler() {
    this.counter++;
  }
  componentDidLoad() {
    this.testEvent.emit();
  }
  render() {
    return (h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", { id: "counter" }, this.counter)))));
  }
  static get is() { return "event-basic"; }
  static get states() {
    return {
      "counter": {}
    };
  }
  static get events() {
    return [{
        "method": "testEvent",
        "name": "testEvent",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
  static get listeners() {
    return [{
        "name": "testEvent",
        "method": "testEventHandler",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
