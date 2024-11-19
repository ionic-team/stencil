import { r as registerInstance, h } from './index-a2c0d171.js';

const location$1 = 'module.js';

const location = 'module/index.js';

const NodeResolution = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("h1", null, "node-resolution"), h("p", { id: "module-index" }, location), h("p", { id: "module" }, location$1)));
  }
};

export { NodeResolution as node_resolution };
