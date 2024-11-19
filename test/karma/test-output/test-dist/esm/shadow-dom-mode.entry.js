import { r as registerInstance, i as getMode, h } from './index-a2c0d171.js';

const modeBlueCss = ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}";

const modeRedCss = ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}";

const ShadowDomMode = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.mode = getMode(this);
  }
  render() {
    return h("div", null, this.mode);
  }
};
ShadowDomMode.style = {
  blue: modeBlueCss,
  red: modeRedCss
};

export { ShadowDomMode as shadow_dom_mode };
