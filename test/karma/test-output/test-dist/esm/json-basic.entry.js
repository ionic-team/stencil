import { r as registerInstance, h } from './index-a2c0d171.js';

const foo = "bar";

const JsonBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return h("div", { id: "json-foo" }, foo);
  }
};

export { JsonBasic as json_basic };
