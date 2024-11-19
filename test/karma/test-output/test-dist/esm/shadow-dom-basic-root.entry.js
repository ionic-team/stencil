import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomBasicRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("shadow-dom-basic", null, h("div", null, "light")));
  }
};
ShadowDomBasicRoot.style = "div {\n      background: rgb(255, 255, 0);\n    }";

export { ShadowDomBasicRoot as shadow_dom_basic_root };
