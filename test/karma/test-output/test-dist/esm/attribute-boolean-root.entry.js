import { r as registerInstance, h, g as getElement, e as Host } from './index-a2c0d171.js';

const AttributeBooleanRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.state = false;
  }
  async toggleState() {
    this.state = !this.state;
  }
  hostData() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? 'hello' : null,
      'aria-hidden': `${this.state}`,
      fixedtrue: 'true',
      fixedfalse: 'false',
      'no-appear': undefined,
      'no-appear2': false,
    };
  }
  __stencil_render() {
    const AttributeBoolean = 'attribute-boolean';
    return [
      h("button", { onClick: this.toggleState.bind(this) }, "Toggle attributes"),
      h(AttributeBoolean, { boolState: this.state, strState: this.state, noreflect: this.state, tappable: this.state, "aria-hidden": `${this.state}` }),
    ];
  }
  get el() { return getElement(this); }
  render() { return h(Host, this.hostData(), this.__stencil_render()); }
};

export { AttributeBooleanRoot as attribute_boolean_root };
