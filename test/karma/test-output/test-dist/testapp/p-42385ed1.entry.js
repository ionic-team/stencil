import { r as t, h as e } from "./p-55339060.js";

const n = class {
  constructor(e) {
    t(this, e), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  render() {
    return this.renderCount += 1, e("div", null, e("div", null, "parent-reflect-nan-attribute Render Count: ", this.renderCount), e("child-reflect-nan-attribute", {
      val: "I am not a number!!"
    }));
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
};

export { n as parent_reflect_nan_attribute }