import { r as t, h as r } from "./p-55339060.js";

const e = class {
  constructor(r) {
    t(this, r), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  render() {
    return this.renderCount += 1, r("div", null, "child-reflect-nan-attribute Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
};

export { e as child_reflect_nan_attribute }