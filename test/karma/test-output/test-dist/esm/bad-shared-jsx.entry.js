import { r as registerInstance, h } from './index-a2c0d171.js';

const BadSharedJSX = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const sharedNode = h("div", null, "Do Not Share JSX Nodes!");
    return (h("div", null, sharedNode, sharedNode));
  }
};

export { BadSharedJSX as bad_shared_jsx };
