import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';

const EventBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.testEvent = createEvent(this, "testEvent", 7);
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
};

export { EventBasic as event_basic };
