import { r as registerInstance, h } from "./index-a2c0d171.js";

var MyComponent = /** @class */ function() {
  function MyComponent(n) {
    registerInstance(this, n), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  return MyComponent.prototype.render = function() {
    return this.renderCount += 1, h("div", null, h("div", null, "Parent Render Count: ", this.renderCount), h("child-with-reflection", {
      val: 1
    }));
  }, MyComponent.prototype.componentDidUpdate = function() {
    this.renderCount += 1;
  }, MyComponent;
}();

export { MyComponent as parent_with_reflect_child };