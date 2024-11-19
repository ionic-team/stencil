import { r as registerInstance, h } from './index-a2c0d171.js';

const FactoryJSX = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  getJsxNode() {
    return h("div", null, "Factory JSX");
  }
  render() {
    return (h("div", null, this.getJsxNode(), this.getJsxNode()));
  }
};

export { FactoryJSX as factory_jsx };
