import { r as registerInstance, f as createEvent, h } from "./index-a2c0d171.js";

var LifecycleBasicC = /** @class */ function() {
  function LifecycleBasicC(e) {
    registerInstance(this, e), this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7), this.value = "", 
    this.rendered = 0;
  }
  return LifecycleBasicC.prototype.componentWillLoad = function() {
    this.lifecycleLoad.emit("componentWillLoad-c");
  }, LifecycleBasicC.prototype.componentDidLoad = function() {
    this.lifecycleLoad.emit("componentDidLoad-c");
  }, LifecycleBasicC.prototype.componentWillUpdate = function() {
    this.lifecycleUpdate.emit("componentWillUpdate-c");
  }, LifecycleBasicC.prototype.componentDidUpdate = function() {
    this.lifecycleUpdate.emit("componentDidUpdate-c");
  }, LifecycleBasicC.prototype.render = function() {
    return this.rendered++, h("div", null, h("hr", null), h("div", null, "LifecycleBasicC ", this.value), h("div", {
      class: "rendered-c"
    }, "rendered c: ", this.rendered));
  }, LifecycleBasicC;
}();

export { LifecycleBasicC as lifecycle_basic_c };