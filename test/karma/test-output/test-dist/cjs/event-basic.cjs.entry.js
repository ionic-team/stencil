'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const EventBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.testEvent = index.createEvent(this, "testEvent", 7);
    this.counter = 0;
  }
  testEventHandler() {
    this.counter++;
  }
  componentDidLoad() {
    this.testEvent.emit();
  }
  render() {
    return (index.h("div", null, index.h("p", null, "testEvent is emitted on componentDidLoad"), index.h("div", null, index.h("p", null, "Emission count: ", index.h("span", { id: "counter" }, this.counter)))));
  }
};

exports.event_basic = EventBasic;
