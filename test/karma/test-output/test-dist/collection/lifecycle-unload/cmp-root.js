import { h } from '@stencil/core';
export class LifecycleUnloadRoot {
  constructor() {
    this.renderCmp = true;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, this.renderCmp ? 'Remove' : 'Add'), this.renderCmp ? h("lifecycle-unload-a", null) : null));
  }
  static get is() { return "lifecycle-unload-root"; }
  static get states() {
    return {
      "renderCmp": {}
    };
  }
}
