import { r as registerInstance, f as createEvent, h } from "./index-a2c0d171.js";

var EventBasic = /** @class */ function() {
  function EventBasic(t) {
    registerInstance(this, t), this.testEvent = createEvent(this, "testEvent", 7), this.counter = 0;
  }
  return EventBasic.prototype.testEventHandler = function() {
    this.counter++;
  }, EventBasic.prototype.componentDidLoad = function() {
    this.testEvent.emit();
  }, EventBasic.prototype.render = function() {
    return h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", {
      id: "counter"
    }, this.counter))));
  }, EventBasic;
}();

export { EventBasic as event_basic };