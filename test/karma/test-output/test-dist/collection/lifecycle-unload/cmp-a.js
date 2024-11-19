import { h } from '@stencil/core';
export class LifecycleUnloadA {
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }
  disconnectedCallback() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-a unload';
    this.results.appendChild(elm);
  }
  render() {
    return (h("main", null, h("header", null, "cmp-a - top"), h("lifecycle-unload-b", null, "cmp-a - middle"), h("footer", null, "cmp-a - bottom")));
  }
  static get is() { return "lifecycle-unload-a"; }
  static get encapsulation() { return "shadow"; }
  static get elementRef() { return "el"; }
}
