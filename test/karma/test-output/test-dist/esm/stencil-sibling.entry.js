import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const StencilSibling = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("sibling-root", null, "sibling-light-dom")));
  }
};

export { StencilSibling as stencil_sibling };
