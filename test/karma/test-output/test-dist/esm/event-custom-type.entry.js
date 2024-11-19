import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';

const EventCustomType = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.testEvent = createEvent(this, "testEvent", 7);
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
};

export { EventCustomType as event_custom_type };
