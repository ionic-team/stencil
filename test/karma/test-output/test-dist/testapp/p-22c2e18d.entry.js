import { r as t, f as e, h as s } from "./p-55339060.js";

const n = class {
  constructor(s) {
    t(this, s), this.testEvent = e(this, "testEvent", 7), this.counter = 0, this.lastEventValue = void 0;
  }
  testEventHandler(t) {
    this.counter++, this.lastEventValue = t.detail;
  }
  componentDidLoad() {
    this.testEvent.emit({
      value: "Test value"
    });
  }
  render() {
    return s("div", null, s("p", null, "testEvent is emitted on componentDidLoad"), s("div", null, s("p", null, "Emission count: ", s("span", {
      id: "counter"
    }, this.counter)), s("p", null, "Last emitted value: ", s("span", {
      id: "lastValue"
    }, JSON.stringify(this.lastEventValue)))));
  }
};

export { n as event_custom_type }