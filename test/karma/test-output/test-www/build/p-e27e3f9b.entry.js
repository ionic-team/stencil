import { r as t, f as n, h as e } from "./p-55339060.js";

const s = class {
  constructor(e) {
    t(this, e), this.testEvent = n(this, "testEvent", 7), this.counter = 0;
  }
  testEventHandler() {
    this.counter++;
  }
  componentDidLoad() {
    this.testEvent.emit();
  }
  render() {
    return e("div", null, e("p", null, "testEvent is emitted on componentDidLoad"), e("div", null, e("p", null, "Emission count: ", e("span", {
      id: "counter"
    }, this.counter))));
  }
};

export { s as event_basic }