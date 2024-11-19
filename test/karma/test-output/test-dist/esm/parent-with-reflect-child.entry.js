import { r as registerInstance, h } from './index-a2c0d171.js';

const MyComponent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  render() {
    this.renderCount += 1;
    return (h("div", null, h("div", null, "Parent Render Count: ", this.renderCount), h("child-with-reflection", { val: 1 })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

export { MyComponent as parent_with_reflect_child };
