import { r as registerInstance, h } from './index-a2c0d171.js';

const CustomElementChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!"), h("h3", null, "Child Nested Component?"), h("custom-element-nested-child", null)));
  }
};

export { CustomElementChild as custom_element_child };
