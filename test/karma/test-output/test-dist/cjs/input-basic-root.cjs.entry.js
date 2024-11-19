'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const InputBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.value = undefined;
  }
  render() {
    return (index.h("div", null, index.h("p", null, "Value: ", index.h("span", { class: "value" }, this.value)), index.h("input", { type: "text", value: this.value, onInput: (ev) => (this.value = ev.target.value) })));
  }
  get el() { return index.getElement(this); }
};

exports.input_basic_root = InputBasicRoot;
