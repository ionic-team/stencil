import { r as registerInstance, h } from './index-a2c0d171.js';

const ChildReflectNanAttribute = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.val = undefined;
  }
  render() {
    this.renderCount += 1;
    return h("div", null, "child-reflect-nan-attribute Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
};

export { ChildReflectNanAttribute as child_reflect_nan_attribute };
