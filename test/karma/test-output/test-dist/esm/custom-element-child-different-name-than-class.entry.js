import { r as registerInstance, h } from './index-a2c0d171.js';

const CustomElementChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!")));
  }
};

export { CustomElementChild as custom_element_child_different_name_than_class };
