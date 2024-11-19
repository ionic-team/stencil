import { r as registerInstance, h } from './index-a2c0d171.js';

const ConditionalRerender = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("main", null, h("slot", null), h("nav", null, "Nav")));
  }
};

export { ConditionalRerender as conditional_rerender };
