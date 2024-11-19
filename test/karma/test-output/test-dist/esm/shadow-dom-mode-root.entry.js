import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomModeRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.showRed = false;
  }
  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }
  render() {
    return (h("div", null, h("shadow-dom-mode", { id: "blue", colormode: "blue" }), this.showRed ? h("shadow-dom-mode", { id: "red" }) : null));
  }
};

export { ShadowDomModeRoot as shadow_dom_mode_root };
