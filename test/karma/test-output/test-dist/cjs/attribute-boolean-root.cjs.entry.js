'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeBooleanRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
      index.h("button", { onClick: this.toggleState.bind(this) }, "Toggle attributes"),
      index.h(AttributeBoolean, { boolState: this.state, strState: this.state, noreflect: this.state, tappable: this.state, "aria-hidden": `${this.state}` }),
    ];
  }
  get el() { return index.getElement(this); }
  render() { return index.h(index.Host, this.hostData(), this.__stencil_render()); }
};

exports.attribute_boolean_root = AttributeBooleanRoot;
