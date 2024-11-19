import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomArray = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.values = [];
  }
  render() {
    return this.values.map((v) => h("div", null, v));
  }
};

export { ShadowDomArray as shadow_dom_array };
