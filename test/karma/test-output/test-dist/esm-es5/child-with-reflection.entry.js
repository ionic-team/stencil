import { r as registerInstance, h } from "./index-a2c0d171.js";

var ChildWithReflection = /** @class */ function() {
  function ChildWithReflection(t) {
    registerInstance(this, t), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  return ChildWithReflection.prototype.render = function() {
    return this.renderCount += 1, h("div", null, h("div", null, "Child Render Count: ", this.renderCount), h("input", {
      step: this.val
    }));
  }, ChildWithReflection.prototype.componentDidUpdate = function() {
    this.renderCount += 1;
  }, ChildWithReflection;
}();

export { ChildWithReflection as child_with_reflection };