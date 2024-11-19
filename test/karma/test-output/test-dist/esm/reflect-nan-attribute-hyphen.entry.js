import { r as registerInstance, h } from './index-a2c0d171.js';

const ReflectNanAttributeHyphen = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.valNum = undefined;
  }
  render() {
    this.renderCount += 1;
    return h("div", null, "reflect-nan-attribute-hyphen Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
};

export { ReflectNanAttributeHyphen as reflect_nan_attribute_hyphen };
