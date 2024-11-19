import { r as registerInstance, f as createEvent, h } from "./index-a2c0d171.js";

var LifecycleBasicB = /** @class */ function() {
  function LifecycleBasicB(e) {
    registerInstance(this, e), this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7), this.value = "", 
    this.rendered = 0;
  }
  return LifecycleBasicB.prototype.componentWillLoad = function() {
    this.lifecycleLoad.emit("componentWillLoad-b");
  }, LifecycleBasicB.prototype.componentDidLoad = function() {
    this.lifecycleLoad.emit("componentDidLoad-b");
  }, LifecycleBasicB.prototype.componentWillUpdate = function() {
    this.lifecycleUpdate.emit("componentWillUpdate-b");
  }, LifecycleBasicB.prototype.componentDidUpdate = function() {
    this.lifecycleUpdate.emit("componentDidUpdate-b");
  }, LifecycleBasicB.prototype.render = function() {
    return this.rendered++, h("div", null, h("hr", null), h("div", null, "LifecycleBasicB ", this.value), h("div", {
      class: "rendered-b"
    }, "rendered b: ", this.rendered), h("lifecycle-basic-c", {
      value: this.value
    }));
  }, LifecycleBasicB;
}();

export { LifecycleBasicB as lifecycle_basic_b };