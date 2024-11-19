import { r as registerInstance, h } from './index-a2c0d171.js';

const CustomElementNestedChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("strong", null, "Child Nested Component Loaded!")));
  }
};

export { CustomElementNestedChild as custom_element_nested_child };
