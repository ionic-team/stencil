import { r as registerInstance, h } from './index-a2c0d171.js';

const LifecycleUnloadRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.renderCmp = true;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, this.renderCmp ? 'Remove' : 'Add'), this.renderCmp ? h("lifecycle-unload-a", null) : null));
  }
};

export { LifecycleUnloadRoot as lifecycle_unload_root };
