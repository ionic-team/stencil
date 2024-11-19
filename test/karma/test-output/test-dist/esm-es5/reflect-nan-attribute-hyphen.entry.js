import { r as registerInstance, h } from "./index-a2c0d171.js";

var ReflectNanAttributeHyphen = /** @class */ function() {
  function ReflectNanAttributeHyphen(t) {
    registerInstance(this, t), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.valNum = void 0;
  }
  return ReflectNanAttributeHyphen.prototype.render = function() {
    return this.renderCount += 1, h("div", null, "reflect-nan-attribute-hyphen Render Count: ", this.renderCount);
  }, ReflectNanAttributeHyphen.prototype.componentDidUpdate = function() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }, ReflectNanAttributeHyphen;
}();

export { ReflectNanAttributeHyphen as reflect_nan_attribute_hyphen };