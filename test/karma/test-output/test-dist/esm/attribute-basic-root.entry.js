import { r as registerInstance, h, g as getElement } from './index-a2c0d171.js';

const AttributeBasicRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
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
  get el() { return getElement(this); }
};

export { AttributeBasicRoot as attribute_basic_root };
