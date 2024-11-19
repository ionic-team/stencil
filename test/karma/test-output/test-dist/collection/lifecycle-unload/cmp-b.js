import { h } from '@stencil/core';
export class LifecycleUnloadB {
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }
  disconnectedCallback() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-b unload';
    this.results.appendChild(elm);
  }
  render() {
    return [
      h("article", null, "cmp-b - top"),
      h("section", null, h("slot", null)),
      h("nav", null, "cmp-b - bottom"),
    ];
  }
  static get is() { return "lifecycle-unload-b"; }
  static get encapsulation() { return "shadow"; }
  static get elementRef() { return "el"; }
}
