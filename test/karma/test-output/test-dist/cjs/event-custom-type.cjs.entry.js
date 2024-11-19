'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const EventCustomType = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.testEvent = index.createEvent(this, "testEvent", 7);
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
    return (index.h("div", null, index.h("p", null, "testEvent is emitted on componentDidLoad"), index.h("div", null, index.h("p", null, "Emission count: ", index.h("span", { id: "counter" }, this.counter)), index.h("p", null, "Last emitted value: ", index.h("span", { id: "lastValue" }, JSON.stringify(this.lastEventValue))))));
  }
};

exports.event_custom_type = EventCustomType;
