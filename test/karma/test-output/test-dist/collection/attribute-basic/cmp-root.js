import { h } from '@stencil/core';
export class AttributeBasicRoot {
  componentWillLoad() {
    this.url = new URL(window.location.href);
  }
  testClick() {
    const cmp = this.el.querySelector('attribute-basic');
    cmp.setAttribute('single', 'single-update');
    cmp.setAttribute('multi-word', 'multiWord-update');
    cmp.setAttribute('my-custom-attr', 'my-custom-attr-update');
    cmp.setAttribute('getter', 'getter-update');
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test"), h("attribute-basic", null), h("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname)));
  }
  static get is() { return "attribute-basic-root"; }
  static get elementRef() { return "el"; }
}
