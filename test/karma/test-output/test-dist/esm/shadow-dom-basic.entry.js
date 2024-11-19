import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [h("div", null, "shadow"), h("slot", null)];
  }
};
ShadowDomBasic.style = "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }";

export { ShadowDomBasic as shadow_dom_basic };
