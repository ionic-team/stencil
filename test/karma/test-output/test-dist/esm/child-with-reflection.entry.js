import { r as registerInstance, h } from './index-a2c0d171.js';

const ChildWithReflection = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.val = undefined;
  }
  render() {
    this.renderCount += 1;
    return (h("div", null, h("div", null, "Child Render Count: ", this.renderCount), h("input", { step: this.val })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

export { ChildWithReflection as child_with_reflection };
