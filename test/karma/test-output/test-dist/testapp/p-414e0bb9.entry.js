import { r as t, h as n } from "./p-55339060.js";

const r = class {
  constructor(n) {
    t(this, n), 
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0, this.val = void 0;
  }
  render() {
    return this.renderCount += 1, n("div", null, n("div", null, "Child Render Count: ", this.renderCount), n("input", {
      step: this.val
    }));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

export { r as child_with_reflection }