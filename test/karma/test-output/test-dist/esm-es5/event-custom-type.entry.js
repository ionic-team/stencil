import { r as registerInstance, f as createEvent, h } from "./index-a2c0d171.js";

var EventCustomType = /** @class */ function() {
  function EventCustomType(t) {
    registerInstance(this, t), this.testEvent = createEvent(this, "testEvent", 7), this.counter = 0, 
    this.lastEventValue = void 0;
  }
  return EventCustomType.prototype.testEventHandler = function(t) {
    this.counter++, this.lastEventValue = t.detail;
  }, EventCustomType.prototype.componentDidLoad = function() {
    this.testEvent.emit({
      value: "Test value"
    });
  }, EventCustomType.prototype.render = function() {
    return h("div", null, h("p", null, "testEvent is emitted on componentDidLoad"), h("div", null, h("p", null, "Emission count: ", h("span", {
      id: "counter"
    }, this.counter)), h("p", null, "Last emitted value: ", h("span", {
      id: "lastValue"
    }, JSON.stringify(this.lastEventValue)))));
  }, EventCustomType;
}();

export { EventCustomType as event_custom_type };