import { h } from '@stencil/core';
export class EventCustomType {
  constructor() {
    this.counter = 0;
    this.lastEventValue = undefined;
  }
  testEventHandler(newValue) {
    this.counter++;
    this.lastEventValue = newValue.detail;
  }
  componentDidLoad() {
    this.testEvent.emit({
      value: 'Test value',
    });
  }
  render() {
    return (h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", { id: "counter" }, this.counter)), h("p", null, "Last emitted value: ", h("span", { id: "lastValue" }, JSON.stringify(this.lastEventValue))))));
  }
  static get is() { return "event-custom-type"; }
  static get states() {
    return {
      "counter": {},
      "lastEventValue": {}
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
          "original": "TestEventDetail",
          "resolved": "TestEventDetail",
          "references": {
            "TestEventDetail": {
              "location": "local"
            }
          }
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
