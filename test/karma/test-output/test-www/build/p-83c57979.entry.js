import { r as t, h as r } from "./p-55339060.js";

const e = class {
  constructor(r) {
    t(this, r), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  render() {
    return this.renderCount += 1, r("div", null, r("div", null, "Parent Render Count: ", this.renderCount), r("child-with-reflection", {
      val: 1
    }));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

export { e as parent_with_reflect_child }