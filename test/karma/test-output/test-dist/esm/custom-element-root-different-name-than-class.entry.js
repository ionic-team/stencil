import { r as registerInstance, h } from './index-a2c0d171.js';

const CustomElementRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("custom-element-child-different-name-than-class", null)));
  }
};

export { CustomElementRoot as custom_element_root_different_name_than_class };
